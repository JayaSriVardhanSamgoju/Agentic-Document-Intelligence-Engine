// ============================================
// Typed API Client
// Single boundary between frontend and backend
// ============================================

import type {
  LoginRequest,
  LoginResponse,
  QueryResponse,
  UploadResponse,
  HealthResponse,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "Unknown error");
    throw new ApiError(detail, response.status);
  }

  return response.json();
}

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

// --- Auth ---
export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password } satisfies LoginRequest),
  });
}

// --- Query ---
export async function queryDocument(
  query: string,
  sessionId: string,
  token: string
): Promise<QueryResponse> {
  return request<QueryResponse>("/query", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ query, session_id: sessionId }),
  });
}

// --- Streaming Query ---
export async function queryStream(
  query: string,
  sessionId: string,
  token: string
): Promise<Response> {
  const url = `${API_BASE_URL}/query/stream`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify({ query, session_id: sessionId }),
  });

  if (!response.ok) {
    throw new ApiError("Streaming query failed", response.status);
  }

  return response;
}

// --- Upload ---
export async function uploadDocument(
  file: File,
  token: string
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const url = `${API_BASE_URL}/upload`;
  const response = await fetch(url, {
    method: "POST",
    headers: authHeaders(token),
    body: formData,
  });

  if (!response.ok) {
    throw new ApiError("Upload failed", response.status);
  }

  return response.json();
}

// --- Health ---
export async function healthCheck(): Promise<HealthResponse> {
  return request<HealthResponse>("/health");
}

export { ApiError };
