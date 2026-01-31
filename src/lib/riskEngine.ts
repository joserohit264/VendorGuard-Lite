import { VendorInput, RiskTier, Mitigation } from "@/types";

interface RiskCalculation {
    score: number;
    tier: RiskTier;
    factors: string[];
    mitigations: Mitigation[];
}

export function calculateRisk(input: VendorInput): RiskCalculation {
    let score = 0;
    const factors: string[] = [];
    const mitigations: Mitigation[] = [];

    // Risk Factors & Mitigations

    // 1. PII Handling
    if (input.storesPII) {
        score += 40;
        factors.push("Stores PII (+40)");
        mitigations.push({
            id: "m-pii-1",
            standard: "ISO 27001",
            controlCode: "A.18.1.4",
            description: "Sign Data Processing Agreement (DPA) & Privacy Policy Review"
        });
        mitigations.push({
            id: "m-pii-2",
            standard: "SOC 2",
            controlCode: "CC6.1",
            description: "Verify Encryption at Rest (AES-256) and in Transit (TLS 1.2+)"
        });
    }

    // 2. Critical System
    if (input.isCriticalSystem) {
        score += 30;
        factors.push("Critical System (+30)");
        mitigations.push({
            id: "m-crit-1",
            standard: "ISO 27001",
            controlCode: "A.17.1",
            description: "Review Business Continuity & Disaster Recovery (BCDR) Plan"
        });
        mitigations.push({
            id: "m-crit-2",
            standard: "SOC 2",
            controlCode: "A1.2",
            description: "Require 99.9% Uptime SLA with Financial Penalties"
        });
    }

    // 3. Access Level
    switch (input.dataAccessLevel) {
        case 'Admin':
            score += 30;
            factors.push("Admin Access (+30)");
            mitigations.push({
                id: "m-acc-1",
                standard: "ISO 27001",
                controlCode: "A.9.2.3",
                description: "Restrict access to named accounts only (No shared logins)"
            });
            mitigations.push({
                id: "m-acc-2",
                standard: "SOC 2",
                controlCode: "CC6.3",
                description: "Enforce Multi-Factor Authentication (MFA) & SSO"
            });
            break;
        case 'Write':
            score += 20;
            factors.push("Write Access (+20)");
            mitigations.push({
                id: "m-acc-3",
                standard: "ISO 27001",
                controlCode: "A.9.4.1",
                description: "Limit access to 'Least Privilege' required for function"
            });
            break;
        case 'Read':
            score += 10;
            factors.push("Read Access (+10)");
            break;
    }

    // Mitigations Existing
    if (input.hasSoC2) {
        score -= 30;
        factors.push("Has SOC2 Compliance (-30)");
    } else {
        // Recommendation if missing
        mitigations.push({
            id: "m-soc-1",
            standard: "General",
            controlCode: "VRM.1",
            description: "Request SIG-Lite Questionnaire or Penetration Test Report"
        });
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    // Determine Tier
    let tier: RiskTier = 'Low';
    if (score >= 60) tier = 'Critical';
    else if (score >= 30) tier = 'Medium';

    return { score, tier, factors, mitigations };
}

export function getTierColor(tier: RiskTier): string {
    switch (tier) {
        case 'Critical': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
        case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
        case 'Low': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
        default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
}
