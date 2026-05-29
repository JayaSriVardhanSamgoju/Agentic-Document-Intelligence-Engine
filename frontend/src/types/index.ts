// ============================================
// Agentic Document Intelligence Engine
// Complete TypeScript Type System
// ============================================

// --- Authentication ---
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
}

export type UserRole = "admin" | "researcher" | "viewer";

export type Permission = "upload" | "query" | "delete" | "manage_users" | "view_citations";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ["upload", "query", "delete", "manage_users"],
  researcher: ["query", "view_citations"],
  viewer: ["query"],
};

export interface User {
  username: string;
  role: UserRole;
  token: string;
}

// --- Query ---
export interface QueryRequest {
  query: string;
  session_id: string;
}

export interface Citation {
  source: string;
  chunk_id: number | null;
}

export interface AgentTrace {
  agent: string;
  status: string;
  timestamp: string;
}

export interface EvaluationMetrics {
  groundedness: number;
  hallucination_risk: string;
  retrieval_quality: number;
  answer_completeness: number;
}

export interface ObservabilityReport {
  latency_ms: number;
  agent_timings: Record<string, number>;
  pipeline_health: string;
  risk_level: "low" | "medium" | "high";
}

export interface QueryResponse {
  answer: string;
  confidence_score: number;
  citations: Citation[];
  reasoning: string;
  agent_trace: AgentTrace[];
  evaluation: EvaluationMetrics;
  observability: ObservabilityReport;
}

// --- Upload ---
export interface UploadResponse {
  filename: string;
  status: string;
  chunks_created: number;
}

// --- Health ---
export interface HealthResponse {
  status: string;
  app_name: string;
}

// --- Chat UI ---
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  // AI-only fields
  citations?: Citation[];
  confidence?: number;
  reasoning?: string;
  agentTrace?: AgentTrace[];
  evaluation?: EvaluationMetrics;
  observability?: ObservabilityReport;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// --- Analytics ---
export interface AnalyticsEntry {
  query: string;
  confidence: number;
  latency: number;
  timestamp: Date;
  citationsCount: number;
}
