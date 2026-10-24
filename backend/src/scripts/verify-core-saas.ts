import { prisma } from "../database/prisma.js";


const verifyCoreSaas = async (): Promise<void> => {
    console.log("Club LMS — Core SaaS Database Verification");
    console.log("------------------------------------------");

    const checks = [
        {
            name: "Churches",
            run: () => prisma.church.count(),
        },
        {
            name: "Clubs",
            run: () => prisma.club.count(),
        },
        {
            name: "Club Registration Requests",
            run: () => prisma.clubRegistrationRequest.count(),
        },
        {
            name: "Club Subscriptions",
            run: () => prisma.clubSubscription.count(),
        },
        {
            name: "Club Settings",
            run: () => prisma.clubSettings.count(),
        },
        {
            name: "Club Years",
            run: () => prisma.clubYear.count(),
        },
    ];

    try {
        await prisma.$connect();

        console.log("PASS: Database connection established");

        for (const check of checks) {
        const count = await check.run();

        console.log(`PASS: ${check.name} — ${count} records`);
        }

        console.log("------------------------------------------");
        console.log("SUCCESS: All Core SaaS database checks passed");
    } catch (error) {
        console.error("FAIL: Core SaaS database verification failed");
        console.error(error);

        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
}

void verifyCoreSaas();
