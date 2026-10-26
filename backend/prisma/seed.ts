import { prisma } from "../src/database/prisma.js";

const roles = [
    // Platform role
    {
        code: "PLATFORM_ADMIN",
        name: "Platform Admin",
        scope: "PLATFORM",
        description: "Manages the SaaS platform.",
    },

    // Club roles
    {
        code: "CLUB_DIRECTOR",
        name: "Director",
        scope: "CLUB",
        description: "Oversees club operations.",
    },
    {
        code: "DEPUTY_DIRECTOR",
        name: "Deputy Director",
        scope: "CLUB",
        description: "Assists the club director.",
    },
    {
        code: "CLERK",
        name: "Clerk",
        scope: "CLUB",
        description: "Manages club administration.",
    },
    {
        code: "TREASURER",
        name: "Treasurer",
        scope: "CLUB",
        description: "Manages club finances.",
    },
    {
        code: "COUNSELOR",
        name: "Counselor",
        scope: "CLUB",
        description: "Supports and supervises club members.",
    },
    {
        code: "INSTRUCTOR",
        name: "Instructor",
        scope: "CLUB",
        description: "Delivers educational activities.",
    },
    {
        code: "DRILL_INSTRUCTOR",
        name: "Drill Instructor",
        scope: "CLUB",
        description: "Coordinates drill instruction.",
    },
    {
        code: "ASSISTANT_DRILL_INSTRUCTOR",
        name: "Assistant Drill Instructor",
        scope: "CLUB",
        description: "Assists with drill instruction.",
    },
    {
        code: "LOGISTICS_COORDINATOR",
        name: "Logistics Coordinator",
        scope: "CLUB",
        description: "Coordinates club logistics.",
    },
    {
        code: "MEDIA_COORDINATOR",
        name: "Media Coordinator",
        scope: "CLUB",
        description: "Coordinates club media activities.",
    },
    {
        code: "SAFE_CHURCH_AVG_OFFICER",
        name: "Safe Church/AVG Officer",
        scope: "CLUB",
        description: "Supports safeguarding and data protection.",
    },
    {
        code: "PARENT",
        name: "Parent",
        scope: "CLUB",
        description: "Accesses authorized child-related information.",
    },
    {
        code: "PATHFINDER",
        name: "Pathfinder",
        scope: "CLUB",
        description: "Pathfinder club member.",
    },
    {
        code: "ADVENTURER",
        name: "Adventurer",
        scope: "CLUB",
        description: "Adventurer club member.",
    },
] as const;

async function main() {
    for (const role of roles) {
        await prisma.role.upsert({
            where: { code: role.code },
            update: {
                name: role.name,
                description: role.description,
                scope: role.scope,
            },
            create: {
                code: role.code,
                name: role.name,
                description: role.description,
                scope: role.scope,
            },
        });
    }

    console.log(`Seeded ${roles.length} IAS-approved roles.`);
}

main()
    .catch((error: unknown) => {
        console.error("Role seeding failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });