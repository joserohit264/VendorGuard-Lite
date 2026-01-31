"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Vendor, VendorInput } from "@/types";
import { dummyVendors } from "@/lib/data";
import { calculateRisk } from "@/lib/riskEngine";

interface VendorContextType {
    vendors: Vendor[];
    addVendor: (input: VendorInput) => void;
    getVendor: (id: string) => Vendor | undefined;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export function VendorProvider({ children }: { children: React.ReactNode }) {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from local storage on mount (client-only)
    useEffect(() => {
        const saved = localStorage.getItem("vendor-guard-data");
        if (saved) {
            try {
                setVendors(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse vendor data", e);
                setVendors(dummyVendors);
            }
        } else {
            setVendors(dummyVendors);
        }
        setIsInitialized(true);
    }, []);

    // Save to local storage whenever vendors change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("vendor-guard-data", JSON.stringify(vendors));
        }
    }, [vendors, isInitialized]);

    const addVendor = (input: VendorInput) => {
        const { score, tier, mitigations } = calculateRisk(input);
        const newVendor: Vendor = {
            ...input,
            id: crypto.randomUUID(),
            riskScore: score,
            riskTier: tier,
            createdAt: new Date().toISOString(),
            mitigations: mitigations
        };

        setVendors((prev) => [newVendor, ...prev]);
    };

    const getVendor = (id: string) => {
        return vendors.find((v) => v.id === id);
    };

    // Prevent hydration mismatch by rendering nothing until client load
    // Or render children but with empty data if that's preferred.
    // For a dash, better to wait for data (small flicker) or show loading.
    if (!isInitialized) {
        return null; // or a loading spinner
    }

    return (
        <VendorContext.Provider value={{ vendors, addVendor, getVendor }}>
            {children}
        </VendorContext.Provider>
    );
}

export function useVendors() {
    const context = useContext(VendorContext);
    if (context === undefined) {
        throw new Error("useVendors must be used within a VendorProvider");
    }
    return context;
}
