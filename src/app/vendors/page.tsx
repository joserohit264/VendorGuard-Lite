"use client";
import { useVendors } from "@/context/VendorContext";
import { getTierColor } from "@/lib/riskEngine";
import { Search, Filter, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default function VendorsPage() {
    const { vendors } = useVendors();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Vendor Registry</h1>
                    <p className="text-slate-400 mt-1">Manage your third-party vendors and their risk status.</p>
                </div>
                <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:bg-white/10 transition-colors">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors font-medium">
                        <Link href="/assessments">Add Vendor</Link>
                    </button>
                </div>
            </div>

            <div className="glass-panel rounded-xl overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-white/10 flex items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search vendors..."
                            className="w-full bg-[#020617] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Vendor Name</th>
                                <th className="px-6 py-4 font-medium">Service Type</th>
                                <th className="px-6 py-4 font-medium">Data Access</th>
                                <th className="px-6 py-4 font-medium">Risk Score</th>
                                <th className="px-6 py-4 font-medium">Tier</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {vendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4">
                                        <Link href={`/vendors/${vendor.id}`}>
                                            <div className="font-medium text-white hover:text-indigo-400 transition-colors">{vendor.name}</div>
                                        </Link>
                                        <div className="text-xs text-slate-500">{vendor.description}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">
                                        {vendor.serviceType}
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                        ${vendor.dataAccessLevel === 'Admin' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-700/30 text-slate-300'}`}>
                                            {vendor.dataAccessLevel}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300 font-mono">
                                        {vendor.riskScore}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTierColor(vendor.riskTier)}`}>
                                            {vendor.riskTier}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-500 hover:text-white transition-colors">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Dummy */}
                <div className="p-4 border-t border-white/10 flex items-center justify-between text-sm text-slate-500">
                    <span>Showing 1 to {vendors.length} of {vendors.length} entries</span>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>

            </div>
        </div>
    );
}
