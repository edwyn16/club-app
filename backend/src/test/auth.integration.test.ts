
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { after, before, test } from "node:test";
import type { AddressInfo } from "node:net";

import app from "../app.js";
import { env } from "../config/env.js";

let server: ReturnType<typeof createServer>;
let baseUrl: string;

before(async () => {
    server = createServer(app);

    await new Promise<void>((resolve, reject) => {
        server.once("error", reject);
        server.listen(0, "127.0.0.1", resolve);
    });

    const address = server.address() as AddressInfo;

    baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
    if (!server) return;

    await new Promise<void>((resolve, reject) => {
        server.close((error) => {
            if (error) reject(error);
            else resolve();
        });
    });
});

test("GET /api/auth/csrf-token initializes CSRF protection", async () => {
    const response = await fetch(
        `${baseUrl}/api/auth/csrf-token`,
    );

    assert.equal(response.status, 200);

    const body = await response.json() as {
        status: string;
        data: {
            csrfToken: string;
        };
    };

    assert.equal(body.status, "success");
    assert.equal(typeof body.data.csrfToken, "string");
    assert.ok(body.data.csrfToken.length > 0);

    const cookies = response.headers.getSetCookie();

    assert.ok(cookies.length >= 2);
    assert.ok(
        cookies.some((cookie) =>
            cookie.includes("club_csrf_context=") ||
            cookie.includes("__Host-club_csrf_context="),
        ),
    );
});

test("POST /api/auth/login rejects requests without a trusted origin", async () => {
    const response = await fetch(
        `${baseUrl}/api/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: "test@example.com",
                password: "invalid-password",
            }),
        },
    );

    assert.equal(response.status, 403);

    const body = await response.json() as {
        status: string;
        message: string;
    };

    assert.equal(body.status, "error");
    assert.equal(
        body.message,
        "Request origin is not allowed.",
    );
});

test("POST /api/auth/login rejects requests without CSRF protection", async () => {
    const response = await fetch(
        `${baseUrl}/api/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Origin: new URL(env.FRONTEND_URL).origin,
            },
            body: JSON.stringify({
                email: "test@example.com",
                password: "invalid-password",
            }),
        },
    );

    assert.equal(response.status, 403);
});