
export interface VerificationEmailInput {
    firstName: string;
    verificationUrl: string;
}

const escapeHtml = (value: string): string =>
    value.replace(/[&<>"']/g, (character) => {
        const entities: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };

        return entities[character] ?? character;
    });

export const createVerificationEmail = (input: VerificationEmailInput,) => {
    const firstName = escapeHtml(input.firstName);
    const verificationUrl = escapeHtml(input.verificationUrl);

    const subject = "Verify your email address — TheArkk";

    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Verify your email — TheArkk</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="padding:40px 16px;">
                <tr>
                    <td align="center">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:520px;background:#ffffff;border-radius:12px;">
                            <tr>
                                <td style="padding:32px;text-align:center;background:#173b70;border-radius:12px 12px 0 0;">
                                    <h1 style="margin:0;color:#ffffff;font-size:28px;">TheArkk</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:36px 32px;">
                                    <h2 style="margin:0 0 20px;font-size:22px;">Verify your email address</h2>

                                    <p style="line-height:1.7;">Hello ${firstName},</p>

                                    <p style="line-height:1.7;">
                                        Welcome to TheArkk! We're excited to help you manage your Pathfinder or Adventurer club.
                                    </p>

                                    <p style="line-height:1.7;">
                                        Please verify your email address to activate your personal account and continue your club registration.
                                    </p>

                                    <div style="text-align:center;margin:32px 0;">
                                        <a href="${verificationUrl}"
                                        style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:bold;">
                                            Verify Email Address
                                        </a>
                                    </div>

                                    <p style="font-size:14px;line-height:1.7;color:#6b7280;">
                                        This verification link expires in 24 hours.
                                    </p>

                                    <p style="font-size:14px;line-height:1.7;color:#6b7280;">
                                        If you didn't create an account with TheArkk, you can safely ignore this email.
                                    </p>

                                    <p style="margin-top:28px;line-height:1.7;">
                                        TheArkk Team
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:20px;text-align:center;background:#f8fafc;border-radius:0 0 12px 12px;">
                                    <p style="margin:0;font-size:12px;color:#64748b;">
                                        © TheArkk — Adventurer & Pathfinder Club Management
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>`;

    const text = `
        Hello ${input.firstName},
        Welcome to TheArkk!
        Please verify your email address to activate your account and continue your club registration.
        
        Verify your email: ${input.verificationUrl}
        This verification link expires in 24 hours.
        If you didn't create an account, you can safely ignore this email.
        
        TheArkk Team`.trim();

    return { subject, html, text };
};