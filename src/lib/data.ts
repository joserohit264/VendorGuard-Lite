import { Vendor } from "@/types";

export const dummyVendors: Vendor[] = [
    {
        id: "v1",
        name: "CloudStorage Pro",
        serviceType: "SaaS",
        description: "Enterprise file storage solution",
        hasSoC2: true,
        storesPII: true,
        isCriticalSystem: true,
        dataAccessLevel: 'Admin',
        riskScore: 70, // 40 (PII) + 30 (Crit) + 30 (Admin) - 30 (SoC2) = 70
        riskTier: 'Critical',
        createdAt: "2024-01-15T10:00:00Z"
    },
    {
        id: "v2",
        name: "MarketingTool.io",
        serviceType: "Marketing",
        description: "Email campaign manager",
        hasSoC2: false,
        storesPII: true,
        isCriticalSystem: false,
        dataAccessLevel: 'Read',
        riskScore: 50, // 40 (PII) + 10 (Read) = 50
        riskTier: 'Medium',
        createdAt: "2024-02-10T14:30:00Z"
    },
    {
        id: "v3",
        name: "DevUtils",
        serviceType: "Development",
        description: "Code formatting tool",
        hasSoC2: false,
        storesPII: false,
        isCriticalSystem: false,
        dataAccessLevel: 'None',
        riskScore: 0,
        riskTier: 'Low',
        createdAt: "2024-03-01T09:15:00Z"
    },
    {
        id: "v4",
        name: "HR Payroll System",
        serviceType: "HR",
        description: "Global payroll processor",
        hasSoC2: true,
        storesPII: true,
        isCriticalSystem: true,
        dataAccessLevel: 'Write',
        riskScore: 60, // 40 + 30 + 20 - 30 = 60
        riskTier: 'Critical',
        createdAt: "2024-03-05T16:45:00Z"
    },
    {
        id: "v5",
        name: "TicketMaster Internal",
        serviceType: "Support",
        description: "Internal ticketing system",
        hasSoC2: true,
        storesPII: false,
        isCriticalSystem: false,
        dataAccessLevel: 'Read',
        riskScore: -20, // 10 - 30 = -20 -> Clamped to 0
        riskTier: 'Low',
        createdAt: "2024-01-20T11:20:00Z"
    }
];
