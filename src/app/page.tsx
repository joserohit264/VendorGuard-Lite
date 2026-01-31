"use client";
import { useVendors } from "@/context/VendorContext";
import { getTierColor } from "@/lib/riskEngine";
import { ShieldAlert, ShieldCheck, AlertTriangle, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { vendors } = useVendors();
  const totalVendors = vendors.length;
  const criticalCount = vendors.filter(v => v.riskTier === 'Critical').length;
  const mediumCount = vendors.filter(v => v.riskTier === 'Medium').length;

  const avgRisk = totalVendors > 0
    ? Math.round(vendors.reduce((acc, v) => acc + v.riskScore, 0) / totalVendors)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Overview of your vendor risk landscape</p>
        </div>
        <Link href="/assessments" className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors">
          <Plus size={18} className="mr-2" />
          Assess New Vendor
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          label="Total Vendors"
          value={totalVendors}
          icon={<TrendingUp className="text-indigo-400" />}
          trend="+2 this month"
        />
        <StatCard
          label="Critical Risks"
          value={criticalCount}
          icon={<ShieldAlert className="text-rose-400" />}
          color="text-rose-400"
        />
        <StatCard
          label="Medium Risks"
          value={mediumCount}
          icon={<AlertTriangle className="text-amber-400" />}
          color="text-amber-400"
        />
        <StatCard
          label="Avg Risk Score"
          value={avgRisk}
          icon={<ShieldAlert className="text-slate-400" />}
          subValue="/ 100"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Risk Heatmap (Simplified List) */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">High Risk Vendors</h2>
          <div className="space-y-4">
            {vendors
              .filter(v => v.riskTier === 'Critical')
              .map((vendor) => (
                <div key={vendor.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div>
                    <h3 className="font-medium text-white">{vendor.name}</h3>
                    <p className="text-sm text-slate-400">{vendor.serviceType}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getTierColor(vendor.riskTier)}`}>
                        {vendor.riskTier}
                      </span>
                      <span className="text-xl font-bold">{vendor.riskScore}</span>
                    </div>
                    <p className="text-xs text-rose-400">Action Required</p>
                  </div>
                </div>
              ))}
            {criticalCount === 0 && (
              <div className="text-center py-8 text-slate-500">
                No critical vendors found. Great job!
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Recent */}
        <div className="glass-panel rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Recent Activity</h2>
          <div className="space-y-6 relative border-l border-white/10 ml-2">

            {vendors.slice(0, 3).map((v, i) => (
              <div key={v.id} className="ml-6 relative">
                <div className="absolute -left-[30px] top-1 h-3 w-3 rounded-full bg-slate-700 ring-4 ring-[#020617]" />
                <p className="text-sm text-slate-300">
                  <span className="font-medium text-white">{v.name}</span> added to registry.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  2 days ago
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, icon, subValue, trend, color }: any) {
  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <div className="mt-2 flex items-baseline">
            <span className={`text-3xl font-bold text-white ${color || ''}`}>{value}</span>
            {subValue && <span className="ml-1 text-sm text-slate-500">{subValue}</span>}
          </div>
        </div>
        <div className="p-2 bg-white/5 rounded-lg">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-xs text-emerald-400">
          {trend}
        </div>
      )}
    </div>
  );
}
