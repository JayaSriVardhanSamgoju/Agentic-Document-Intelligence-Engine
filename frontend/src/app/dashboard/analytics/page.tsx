"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Database,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const queryActivityData = [
  { name: "Mon", queries: 145 },
  { name: "Tue", queries: 230 },
  { name: "Wed", queries: 280 },
  { name: "Thu", queries: 190 },
  { name: "Fri", queries: 320 },
  { name: "Sat", queries: 110 },
  { name: "Sun", queries: 90 },
];

const confidenceDistData = [
  { name: "0-50%", count: 12, color: "#ef4444" },
  { name: "50-70%", count: 45, color: "#f59e0b" },
  { name: "70-85%", count: 120, color: "#3b82f6" },
  { name: "85-100%", count: 450, color: "#10b981" },
];

const agentLatencyData = [
  { name: "Input Guard", ms: 12 },
  { name: "Planner", ms: 45 },
  { name: "Retriever", ms: 120 },
  { name: "Synthesizer", ms: 240 },
  { name: "Output Guard", ms: 15 },
  { name: "Verifier", ms: 35 },
];

const topDocsData = [
  { name: "Q4_Financial_Report.pdf", queries: 432, conf: "94%", ms: 312 },
  { name: "Employee_Handbook_2024.docx", queries: 285, conf: "98%", ms: 245 },
  { name: "API_Documentation_v3.txt", queries: 194, conf: "88%", ms: 410 },
  { name: "Security_Policy_Revised.pdf", queries: 145, conf: "96%", ms: 290 },
  { name: "Architecture_Decision_Records.pdf", queries: 98, conf: "85%", ms: 520 },
];

export default function AnalyticsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            System Analytics
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Performance metrics and observability for the AI pipeline.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-2 rounded-lg glass text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
        >
          <RefreshCw size={14} className={cn(isRefreshing && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Queries", value: "1,247", trend: "+12%", up: true, icon: Activity },
          { label: "Avg Confidence", value: "91.4%", trend: "+3.2%", up: true, icon: CheckCircle2 },
          { label: "Avg Latency", value: "312ms", trend: "-40ms", up: true, icon: Clock },
          { label: "Failure Rate", value: "1.8%", trend: "-0.4%", up: true, icon: AlertTriangle },
        ].map((kpi, i) => (
          <div key={i} className="glass-card flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-lg bg-raised flex items-center justify-center">
                <kpi.icon size={16} className="text-accent" />
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full",
                  kpi.up ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                )}
              >
                {kpi.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {kpi.trend}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{kpi.value}</p>
              <p className="text-xs font-medium text-text-muted mt-0.5">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Query Activity */}
        <div className="glass-card">
          <h3 className="text-sm font-bold text-text-primary mb-4">Query Activity (7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={queryActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickMargin={10} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickMargin={10} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: "#0f1f38", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "8px" }}
                  itemStyle={{ color: "#f0f6ff" }}
                />
                <Line type="monotone" dataKey="queries" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confidence Distribution */}
        <div className="glass-card">
          <h3 className="text-sm font-bold text-text-primary mb-4">Confidence Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceDistData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickMargin={10} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickMargin={10} />
                <RechartsTooltip
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  contentStyle={{ backgroundColor: "#0f1f38", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "8px" }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {confidenceDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Latency */}
        <div className="glass-card">
          <h3 className="text-sm font-bold text-text-primary mb-4">Avg Latency per Agent (ms)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentLatencyData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" fontSize={11} width={80} />
                <RechartsTooltip
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  contentStyle={{ backgroundColor: "#0f1f38", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "8px" }}
                />
                <Bar dataKey="ms" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Documents Table */}
        <div className="glass-card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-text-primary">Most Queried Documents</h3>
            <Database size={14} className="text-text-muted" />
          </div>
          <div className="flex-1 overflow-auto scrollbar-hide">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-subtle text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  <th className="pb-3 font-medium">Document</th>
                  <th className="pb-3 font-medium text-right">Queries</th>
                  <th className="pb-3 font-medium text-right">Avg Conf</th>
                  <th className="pb-3 font-medium text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {topDocsData.map((doc, i) => (
                  <tr key={i} className="hover:bg-raised/20 transition-colors">
                    <td className="py-3 font-medium text-text-primary truncate max-w-[150px]">
                      {doc.name}
                    </td>
                    <td className="py-3 text-right font-mono text-text-secondary">{doc.queries}</td>
                    <td className="py-3 text-right font-mono text-success">{doc.conf}</td>
                    <td className="py-3 text-right font-mono text-text-secondary">{doc.ms}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
