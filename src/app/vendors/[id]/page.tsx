"use client";

import { useVendors } from "@/context/VendorContext";
import { use, useEffect, useState } from "react";
import { getTierColor } from "@/lib/riskEngine";
import { ArrowLeft, Download, Shield, Database, Calendar } from "lucide-react";
import Link from 'next/link';
import { Vendor } from "@/types";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function VendorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { vendors } = useVendors();
    const [vendor, setVendor] = useState<Vendor | null>(null);

    const [id, setId] = useState<string>("");

    useEffect(() => {
        params.then(p => setId(p.id));
    }, [params]);

    useEffect(() => {
        if (id && vendors.length > 0) {
            const found = vendors.find(v => v.id === id);
            setVendor(found || null);
        }
    }, [id, vendors]);

    const handleExport = () => {
        if (!vendor) return;

        const doc = new jsPDF();

        // Brand Color for headers
        const indigo = "#6366f1";
        const slate = "#64748b";

        // Title
        doc.setFontSize(22);
        doc.setTextColor(indigo);
        doc.text("Vendor Risk Report", 14, 20);

        // Vendor Name
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(vendor.name, 14, 32);

        // Meta Info Line
        doc.setFontSize(10);
        doc.setTextColor(slate);
        doc.text(`ID: ${vendor.id}  |  Generated: ${new Date().toLocaleDateString()}`, 14, 40);

        // Divider
        doc.setDrawColor(200, 200, 200);
        doc.line(14, 45, 196, 45);

        // Section 1: Vendor Details
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Vendor Details", 14, 55);

        doc.setFontSize(11);
        doc.setTextColor(80, 80, 80);
        doc.text(`Service Type: ${vendor.serviceType}`, 14, 65);
        doc.text(`Onboarded On: ${new Date(vendor.createdAt).toLocaleDateString()}`, 14, 72);
        doc.text(`Description: ${vendor.description || "N/A"}`, 14, 79);

        // Section 2: Risk Profile
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Risk Profile", 14, 95);

        // Score Box
        doc.setFillColor(245, 247, 255);
        doc.roundedRect(14, 100, 50, 25, 3, 3, 'F');
        doc.setFontSize(10);
        doc.setTextColor(slate);
        doc.text("Risk Score", 19, 108);
        doc.setFontSize(18);
        doc.setTextColor(indigo);
        doc.text(`${vendor.riskScore} / 100`, 19, 118);

        // Risk Factors
        doc.setFontSize(11);
        doc.setTextColor(80, 80, 80);
        doc.text(`Risk Tier: ${vendor.riskTier}`, 70, 105);
        doc.text(`Data Access: ${vendor.dataAccessLevel}`, 70, 112);
        doc.text(`Critical System: ${vendor.isCriticalSystem ? "Yes" : "No"}`, 70, 119);
        doc.text(`Stores PII: ${vendor.storesPII ? "Yes" : "No"}`, 130, 105);
        doc.text(`SOC 2 Compliant: ${vendor.hasSoC2 ? "Yes" : "No"}`, 130, 112);

        // Section 3: Remediation Plan
        if (vendor.mitigations && vendor.mitigations.length > 0) {
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text("Remediation Actions", 14, 140);

            autoTable(doc, {
                startY: 145,
                head: [['Standard', 'Control', 'Description']],
                body: vendor.mitigations.map(m => [m.standard, m.controlCode, m.description]),
                headStyles: { fillColor: indigo },
                styles: { fontSize: 10 },
                columnStyles: {
                    0: { cellWidth: 30 }, // Standard
                    1: { cellWidth: 30 }, // Control
                    2: { cellWidth: 'auto' } // Description
                }
            });
        }

        doc.save(`${vendor.name.replace(/\s+/g, '_').toLowerCase()}_report.pdf`);
    };

    if (!vendor && id) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl text-white">Vendor not found</h2>
                <Link href="/vendors" className="text-indigo-400 hover:underline mt-4 block">Back to Registry</Link>
            </div>
        );
    }

    if (!vendor) return null; // Loading

    return (
        <div className="space-y-6">
            <Link href="/vendors" className="inline-flex items-center text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={16} className="mr-2" />
                Back to Registry
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-4xl font-bold text-white mb-2">{vendor.name}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getTierColor(vendor.riskTier)}`}>
                            {vendor.riskTier} Risk
                        </span>
                    </div>
                    <p className="text-lg text-slate-400">{vendor.description || "No description provided."}</p>
                </div>

                <button onClick={handleExport} className="flex items-center space-x-2 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 px-4 py-2 rounded-lg transition-colors">
                    <Download size={18} />
                    <span>Export Report</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">Risk Profile</h3>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white/5 p-4 rounded-lg">
                                <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Risk Score</div>
                                <div className="text-3xl font-bold text-white">{vendor.riskScore} <span className="text-sm text-slate-500 font-normal">/ 100</span></div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <RiskFactorItem
                                label="Data Access Level"
                                value={vendor.dataAccessLevel}
                                safe={vendor.dataAccessLevel === 'None' || vendor.dataAccessLevel === 'Read'}
                            />
                            <RiskFactorItem
                                label="Privacy Data (PII)"
                                value={vendor.storesPII ? "Stores PII" : "No PII Access"}
                                safe={!vendor.storesPII}
                            />
                            <RiskFactorItem
                                label="System Criticality"
                                value={vendor.isCriticalSystem ? "Critical System" : "Non-Critical"}
                                safe={!vendor.isCriticalSystem}
                            />
                            <RiskFactorItem
                                label="Compliance Check"
                                value={vendor.hasSoC2 ? "SOC2 Certified" : "No Certification"}
                                safe={vendor.hasSoC2}
                            />
                        </div>

                        {vendor.mitigations && vendor.mitigations.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-white/10">
                                <h3 className="text-lg font-semibold text-white mb-4">Remediation Plan</h3>
                                <div className="space-y-3">
                                    {vendor.mitigations.map((m) => (
                                        <div key={m.id} className="flex items-start p-4 bg-[#020617] border border-white/10 rounded-lg">
                                            <div className="mt-1 mr-4 shrink-0">
                                                <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="text-xs font-bold text-indigo-400">{m.standard}</span>
                                                    <span className="text-xs text-slate-500">•</span>
                                                    <span className="text-xs font-mono text-slate-400">{m.controlCode}</span>
                                                </div>
                                                <p className="text-sm text-slate-200">{m.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Metadata */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Vendor Details</h3>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <Database size={18} className="text-indigo-400 mr-3 mt-0.5" />
                                <div>
                                    <div className="text-xs text-slate-500">Service Type</div>
                                    <div className="text-white">{vendor.serviceType}</div>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Calendar size={18} className="text-indigo-400 mr-3 mt-0.5" />
                                <div>
                                    <div className="text-xs text-slate-500">Onboarded On</div>
                                    <div className="text-white">{new Date(vendor.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Shield size={18} className="text-indigo-400 mr-3 mt-0.5" />
                                <div>
                                    <div className="text-xs text-slate-500">Vendor ID</div>
                                    <div className="text-slate-400 font-mono text-xs">{vendor.id}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RiskFactorItem({ label, value, safe }: { label: string, value: string, safe: boolean }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
            <span className="text-slate-300">{label}</span>
            <span className={`font-medium ${safe ? 'text-emerald-400' : 'text-rose-400'}`}>
                {value}
            </span>
        </div>
    )
}
