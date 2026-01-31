"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { calculateRisk, getTierColor } from "@/lib/riskEngine";
import { useVendors } from "@/context/VendorContext";
import { Mitigation, VendorInput, RiskTier } from "@/types";
import { Shield, AlertTriangle, CheckCircle, Info, Save, FileCheck } from "lucide-react";

export default function AssessmentPage() {
    const router = useRouter();
    const { addVendor } = useVendors();
    const [formData, setFormData] = useState<VendorInput>({
        name: "",
        serviceType: "SaaS",
        hasSoC2: false,
        storesPII: false,
        isCriticalSystem: false,
        dataAccessLevel: 'None'
    });

    const [result, setResult] = useState<{ score: number; tier: RiskTier; factors: string[]; mitigations: Mitigation[] } | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCalculate = () => {
        const riskResult = calculateRisk(formData);
        setResult(riskResult);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">New Vendor Assessment</h1>
                <p className="text-slate-400 mt-1">Evaluate the security risk of a potential vendor.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="glass-panel p-6 rounded-xl space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Vendor Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                placeholder="e.g. Acme Corp"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Service Type</label>
                            <select
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleInputChange}
                                className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                                <option value="SaaS">SaaS Application</option>
                                <option value="Infrastructure">Infrastructure / Hosting</option>
                                <option value="Consulting">Consulting / Services</option>
                                <option value="Hardware">Hardware Provider</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Data Access Level</label>
                            <select
                                name="dataAccessLevel"
                                value={formData.dataAccessLevel}
                                onChange={handleInputChange}
                                className="w-full bg-[#020617] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                                <option value="None">None (No Data Access)</option>
                                <option value="Read">Read Only</option>
                                <option value="Write">Write / Modify</option>
                                <option value="Admin">Full Admin Access</option>
                            </select>
                        </div>

                        <div className="pt-4 space-y-3">
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="storesPII"
                                    checked={formData.storesPII}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 rounded border-white/10 bg-[#020617] text-indigo-500 focus:ring-offset-0 focus:ring-indigo-500/50"
                                />
                                <span className="text-slate-300 group-hover:text-white transition-colors">Stores PII (Personal Data)</span>
                            </label>

                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="isCriticalSystem"
                                    checked={formData.isCriticalSystem}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 rounded border-white/10 bg-[#020617] text-indigo-500 focus:ring-offset-0 focus:ring-indigo-500/50"
                                />
                                <span className="text-slate-300 group-hover:text-white transition-colors">Critical System (High Availability)</span>
                            </label>

                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="hasSoC2"
                                    checked={formData.hasSoC2}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 rounded border-white/10 bg-[#020617] text-indigo-500 focus:ring-offset-0 focus:ring-indigo-500/50"
                                />
                                <span className="text-slate-300 group-hover:text-white transition-colors">Has SOC2 (or ISO 27001) Report</span>
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={handleCalculate}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20"
                    >
                        Calculate Risk Score
                    </button>
                </div>

                {/* Result Section */}
                <div className="space-y-6">
                    {!result ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 rounded-xl text-slate-500">
                            <Shield size={48} className="mb-4 opacity-50" />
                            <p>Complete the form to see the risk analysis</p>
                        </div>
                    ) : (
                        <div className="glass-panel p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-white">Risk Analysis</h2>
                                <div className={`px-3 py-1 rounded-full text-sm font-bold ${getTierColor(result.tier)}`}>
                                    {result.tier} Risk
                                </div>
                            </div>

                            <div className="flex items-center justify-center py-8">
                                <div className="relative">
                                    <svg className="h-32 w-32 rotate-[-90deg]">
                                        <circle
                                            className="text-slate-800"
                                            strokeWidth="8"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="58"
                                            cx="64"
                                            cy="64"
                                        />
                                        <circle
                                            className={`${result.score > 60 ? 'text-rose-500' : result.score > 30 ? 'text-amber-500' : 'text-emerald-500'} transition-all duration-1000 ease-out`}
                                            strokeWidth="8"
                                            strokeDasharray={365}
                                            strokeDashoffset={365 - (365 * result.score) / 100}
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="58"
                                            cx="64"
                                            cy="64"
                                        />
                                    </svg>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                        <span className="text-3xl font-bold text-white">{result.score}</span>
                                        <span className="text-xs text-slate-400 block">/100</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mt-4">
                                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Contributing Factors</h3>
                                {result.factors.map((factor, i) => (
                                    <div key={i} className="flex items-center text-sm text-slate-200 bg-white/5 px-3 py-2 rounded">
                                        {factor.includes("-") ? (
                                            <CheckCircle size={16} className="text-emerald-400 mr-2" />
                                        ) : (
                                            <AlertTriangle size={16} className="text-amber-400 mr-2" />
                                        )}
                                        {factor}
                                    </div>
                                ))}
                            </div>

                            {result.mitigations.length > 0 && (
                                <div className="space-y-3 mt-6">
                                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Required Actions</h3>
                                    <div className="space-y-2">
                                        {result.mitigations.map((m) => (
                                            <div key={m.id} className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="text-xs font-bold text-indigo-400 border border-indigo-500/30 px-1.5 rounded">{m.standard}</span>
                                                    <span className="text-xs font-mono text-slate-400">{m.controlCode}</span>
                                                </div>
                                                <p className="text-sm text-slate-200">{m.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                                <div className="flex items-start space-x-3 text-sm text-slate-400 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                                    <Info size={16} className="text-blue-400 mt-0.5 shrink-0" />
                                    <p>
                                        {result.tier === 'Critical' && "This vendor requires Executive Approval and a full security audit before onboarding."}
                                        {result.tier === 'Medium' && "Standard security review required. Ensure DPA is signed."}
                                        {result.tier === 'Low' && "Pre-approved for onboarding. No additional review needed."}
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        addVendor(formData);
                                        router.push('/vendors');
                                    }}
                                    className="w-full flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-all"
                                >
                                    <Save size={18} />
                                    <span>Save to Registry</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
