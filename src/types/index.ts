export type RiskTier = 'Low' | 'Medium' | 'Critical';

export interface Mitigation {
    id: string;
    standard: 'ISO 27001' | 'SOC 2' | 'General';
    controlCode: string;
    description: string;
}

export interface Vendor {
    id: string;
    name: string;
    serviceType: string;
    description?: string;
    hasSoC2: boolean;
    storesPII: boolean;
    isCriticalSystem: boolean;
    dataAccessLevel: 'None' | 'Read' | 'Write' | 'Admin';
    riskScore: number;
    riskTier: RiskTier;
    createdAt: string;
    mitigations?: Mitigation[];
}

export type VendorInput = Omit<Vendor, 'id' | 'riskScore' | 'riskTier' | 'createdAt' | 'mitigations'>;
