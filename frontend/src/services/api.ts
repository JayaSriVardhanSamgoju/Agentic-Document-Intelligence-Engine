// ============================================
// Typed API Client — Interceptor Pattern
// Auto-attaches JWT from localStorage
// ============================================

import type {
  LoginResponse,
  QueryResponse,
  UploadResponse,
  HealthResponse,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// --- Error Class ---
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// --- Token Helper ---
function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.token || null;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

// --- Interceptor Fetch ---
async function authFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Merge with any additional headers from options
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "Unknown error");
      throw new ApiError(detail, response.status);
    }

    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// --- Auth ---
export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const res = await authFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

// --- Query ---
export async function queryDocument(
  query: string,
  sessionId: string,
  token?: string
): Promise<QueryResponse> {
  const res = await authFetch("/query", {
    method: "POST",
    body: JSON.stringify({ query, session_id: sessionId }),
  });
  return res.json();
}

// --- Streaming Query ---
export async function queryStream(
  query: string,
  sessionId: string,
  signal?: AbortSignal
): Promise<Response> {
  const token = getStoredToken();
  const response = await fetch(`${API_BASE_URL}/query/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, session_id: sessionId }),
    signal,
  });

  if (!response.ok) {
    throw new ApiError("Streaming query failed", response.status);
  }

  return response;
}

// --- Upload ---
export async function uploadDocument(file: File): Promise<UploadResponse> {
  const token = getStoredToken();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "Upload failed");
    throw new ApiError(detail, response.status);
  }

  return response.json();
}

// --- Health ---
export async function healthCheck(): Promise<HealthResponse> {
  const res = await authFetch("/health");
  return res.json();
}
