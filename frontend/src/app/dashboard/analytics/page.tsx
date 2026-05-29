"use client";

import { Card, CardContent, CardTitle, CardDescription, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  BarChart3,
  Clock,
  ShieldCheck,
  TrendingUp,
  Activity,
  FileText,
} from "lucide-react";

// Client-side analytics are illustrative; in production, these would come from
// persisted state (zustand store) or a dedicated analytics API endpoint.

const stats = [
  {
    label: "Total Queries",
    value: "—",
    icon: BarChart3,
    color: "text-blue-400 bg-blue-500/10 ring-blue-500/20",
    change: "Track queries over time",
  },
  {
    label: "Avg. Confidence",
    value: "—",
    icon: ShieldCheck,
    color: "text-green-400 bg-green-500/10 ring-green-500/20",
    change: "Aggregated from responses",
  },
  {
    label: "Avg. Latency",
    value: "—",
    icon: Clock,
    color: "text-yellow-400 bg-yellow-500/10 ring-yellow-500/20",
    change: "Pipeline execution time",
  },
  {
    label: "Documents Indexed",
    value: "—",
    icon: FileText,
    color: "text-purple-400 bg-purple-500/10 ring-purple-500/20",
    change: "Active in vector store",
  },
];

export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
            <BarChart3 size={20} className="text-primary" />
          </div>
          Analytics
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Monitor system performance, query patterns, and AI response quality.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} hover>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </div>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ring-1 ${stat.color}`}
              >
                <stat.icon size={20} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Placeholder for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              Query Volume
            </CardTitle>
            <CardDescription>Queries over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center border border-dashed border-border/50 rounded-xl">
              <p className="text-sm text-muted-foreground">
                Connect to a backend analytics endpoint to render live charts.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={16} className="text-accent" />
              Pipeline Health
            </CardTitle>
            <CardDescription>Agent latency breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center border border-dashed border-border/50 rounded-xl">
              <p className="text-sm text-muted-foreground">
                Aggregate observability data from responses to populate.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
