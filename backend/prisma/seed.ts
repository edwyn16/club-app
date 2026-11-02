import { prisma } from "../src/database/prisma.js";
import { access, readFileSync } from "node:fs";

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

const isaRoleCodes: Record<string, string> = {
    "Platform Admin": "PLATFORM_ADMIN",
    Director: "CLUB_DIRECTOR",
    "Deputy Director": "DEPUTY_DIRECTOR",
    Clerk: "CLERK",
    Treasurer: "TREASURER",
    Counselor: "COUNSELOR",
    Instructor: "INSTRUCTOR",
    "Drill Instructor": "DRILL_INSTRUCTOR",
    "Assistant Drill Instructor": "ASSISTANT_DRILL_INSTRUCTOR",
    "Logistics Coordinator": "LOGISTICS_COORDINATOR",
    "Media Coordinator": "MEDIA_COORDINATOR",
    "Safe Church / AVG Officer": "SAFE_CHURCH_AVG_OFFICER",
    Parent: "PARENT",
    Pathfinder: "PATHFINDER",
    Adventurer: "ADVENTURER",
}

interface IasPermissionMapping {
    permissionCode: string;
    action: string;
    accessByRole: Record<string, string>;
}

const iasMappings = JSON.parse(
    readFileSync(
        new URL("./ias-role-permission-mapping.json", import.meta.url),
        "utf8",
    ),
) as IasPermissionMapping[];

const main = async () => {
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

    for (const [code, name, domain] of permissionDefinitions) {
        await prisma.permission.upsert({
            where: { code },
            update: {
                name,
                domain,
            },
            create: {
                code,
                name,
                domain,
            },
        });
    }

    const roleRecords = await prisma.role.findMany({
        select: { id: true, code: true },
    });

    const permissionRecords = await prisma.permission.findMany({
        select: { id: true, code: true },
    });

    const roleIds = new Map(
        roleRecords.map((role) => [role.code, role.id]),
    );

    const permissionIds = new Map(
        permissionRecords.map((permission) => [
            permission.code,
            permission.id,
        ]),
    );

    const approvedAssignments = new Set<string>();

    for (const mapping of iasMappings) {
        for (const roleName of Object.keys(mapping.accessByRole)) {
            const roleCode = isaRoleCodes[roleName];

            if (!roleCode) {
                throw new Error(`Unknown IAS role: ${roleName}`);
            }

            approvedAssignments.add(`${roleCode}:${mapping.permissionCode}`);
        }
    }

    const existingAssignments = await prisma.rolePermission.findMany({
        select: {
            id: true,
            role: { select: { code: true } },
            permission: { select: { code: true } },
        },
    });

    const obsoleteAssignmentIds = existingAssignments
        .filter(
            (assignment) =>
                !approvedAssignments.has(
                    `${assignment.role.code}:${assignment.permission.code}`,
                ),
        )
        .map((assignment) => assignment.id);

    console.log(`Found ${obsoleteAssignmentIds.length} assignments outdside the IAS matrix.`,)

    if (obsoleteAssignmentIds.length > 0) {
        await prisma.rolePermission.updateMany({
            where: {
                id: {
                    in: obsoleteAssignmentIds,
                },
            },
            data: {
                accessScope: "UNASSIGNED",
            },
        });
    }

    console.log(`Reconciled ${obsoleteAssignmentIds.length} obsolete IAS assignments.`,);

    let assignmentCount = 0;


    for (const mapping of iasMappings) {
        const permissionId = permissionIds.get(mapping.permissionCode);

        if (!permissionId) {
            throw new Error(
                `IAS permission not found: ${mapping.permissionCode}`,
            );
        }

        for (const [roleName, accessScope] of Object.entries(
            mapping.accessByRole,
        )) {
            const roleCode = isaRoleCodes[roleName];

            if (!roleCode) {
                throw new Error(`Unknown IAS role: ${roleName}`);
            }

            const roleId = roleIds.get(roleCode);

            if (!roleId) {
                throw new Error(`Database role not found: ${roleCode}`);
            }

            if (accessScope === "No" || accessScope === "UNASSIGNED") {
                throw new Error(
                    `Invalid IAS assignment: ${roleName} / ${mapping.permissionCode}`,
                );
            }

            await prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId,
                        permissionId,
                    },
                },
                update: {
                    accessScope,
                },
                create: {
                    roleId,
                    permissionId,
                    accessScope,
                },
            });
            assignmentCount++;
        }
    }

    console.log(`Prepared ${assignmentCount} IAS role-permission assignments.`,);

    console.log(`Seeded ${permissionDefinitions.length} IAS permission definitions.`),
    console.log(`Seeded ${roles.length} IAS-approved roles.`);
}


const permissionDefinitions = [
    // Platform
    ["PLATFORM_APPROVE_CLUB_REGISTRATION", "Approve new club registration", "Platform"],
    ["PLATFORM_MANAGE_SUBSCRIPTION", "Manage subscription", "Platform"],
    ["PLATFORM_MANAGE_SETTINGS", "Manage platform settings", "Platform"],

    // Club Administration
    ["CLUB_MANAGE_PROFILE", "Manage club profile", "Club Admin"],
    ["CLUB_MANAGE_STAFF_ROLES", "Manage staff roles", "Club Admin"],
    ["CLUB_MANAGE_PERMISSIONS", "Manage permissions", "Club Admin"],

    // Members
    ["MEMBERS_MANAGE_RECORDS", "Manage member records", "Members"],
    ["MEMBERS_MANAGE_FAMILIES", "Manage family records", "Members"],
    ["MEMBERS_MANAGE_REGISTRATION_FORMS", "Manage registration forms", "Members"],

    // Medical
    ["MEDICAL_VIEW_FULL_RECORDS", "View full medical records", "Medical"],
    ["MEDICAL_VIEW_ALERTS", "View medical alerts", "Medical"],
    ["MEDICAL_VIEW_ACTIVITY_RESTRICTIONS", "View activity restrictions", "Medical"],
    ["MEDICAL_VIEW_EMERGENCY_CONTACTS", "View emergency contacts", "Medical"],
    ["MEDICAL_EDIT_RECORDS_ALERTS", "Edit medical records / alerts", "Medical"],

    // Curriculum
    ["CURRICULUM_MANAGE_TEMPLATES", "Manage curriculum templates", "Curriculum"],
    ["CURRICULUM_MANAGE_CLUB_SETUP", "Manage club curriculum setup", "Curriculum"],
    ["CURRICULUM_APPROVE_REQUIREMENTS", "Approve requirements", "Curriculum"],
    ["CURRICULUM_OVERRIDE_APPROVALS", "Override approvals", "Curriculum"],
    ["CURRICULUM_SUBMIT_REQUIREMENTS", "Submit requirements", "Curriculum"],

    // Awards and Honors
    ["AWARDS_MANAGE", "Manage awards / honors", "Awards/Honors"],
    ["AWARDS_MARK_COMPLETE", "Mark awards / honors complete", "Awards/Honors"],

    // Attendance
    ["ATTENDANCE_CREATE_SESSION", "Create attendance session", "Attendance"],
    ["ATTENDANCE_MARK", "Mark attendance", "Attendance"],
    ["ATTENDANCE_VIEW", "View attendance", "Attendance"],

    // Events
    ["EVENTS_CREATE", "Create events", "Events"],
    ["EVENTS_MANAGE_LOGISTICS_INVENTORY", "Manage logistics / inventory", "Events"],

    // Finance
    ["FINANCE_MANAGE", "Manage finances", "Finance"],
    ["FINANCE_RECORD_PAYMENTS", "Record payments", "Finance"],
    ["FINANCE_EXPORT_REPORTS", "Export financial reports", "Finance"],

    // Media
    ["MEDIA_MANAGE_LIBRARY", "Manage media library", "Media"],
    ["MEDIA_MANAGE_CONSENT", "Manage media consent records", "Media"],

    // Safe Church / AVG
    ["SAFETY_MANAGE_INCIDENTS", "Manage incidents / child protection cases", "Safe Church / AVG"],
    ["SAFETY_MANAGE_BACKGROUND_CHECKS", "Manage background checks", "Safe Church / AVG"],
    ["SAFETY_MANAGE_GDPR_REQUESTS", "Manage GDPR / AVG requests", "Safe Church / AVG"],

    // Communication
    ["COMMUNICATION_CREATE_ANNOUNCEMENTS", "Create announcements", "Communication"],
    ["COMMUNICATION_CHAT_MESSAGES", "Chat / messages", "Communication"],
    ["COMMUNICATION_MONITOR_CHATS", "Monitor chats", "Communication"],

    // Reports
    ["REPORTS_EXPORT_MEMBERSHIP", "Export membership reports", "Reports"],
    ["REPORTS_EXPORT_ATTENDANCE", "Export attendance reports", "Reports"],
    ["REPORTS_EXPORT_CURRICULUM", "Export curriculum reports", "Reports"],

    // Audit
    ["AUDIT_VIEW_LOGS", "View audit logs", "Audit"],
    ["AUDIT_VIEW_LOGIN_LOGS", "View login logs", "Audit"],
] as const;

main()
    .catch((error: unknown) => {
        console.error("Role seeding failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });