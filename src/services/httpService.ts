// services/httpService.ts
import getBaseUrl, { BaseUrlProdType } from "@/services/baseUrl";
import { getServerSession } from "next-auth/next";
import { getSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface HttpError {
  error: true;
  message: string;
}

export class HttpService {
  private baseUrl: string;
  private isRefreshing = false;

  constructor(env: BaseUrlProdType = "live") {
    this.baseUrl = getBaseUrl(env);
  }

  private async refreshAccessToken(
    refreshToken: string
  ): Promise<string | null> {
    if (this.isRefreshing) return null;

    this.isRefreshing = true;

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) throw new Error("Refresh token failed");

      const data = await response.json();
      return data.tokens?.accessToken || data.accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    } finally {
      this.isRefreshing = false;
    }
  }

  private async getAccessToken(
    isServer: boolean = false
  ): Promise<string | null> {
    try {
      if (isServer) {
        const session = await getServerSession(authOptions);
        return session?.accessToken || null;
      } else {
        const session = await getSession();
        return session?.accessToken || null;
      }
    } catch {
      return null;
    }
  }

  private async getRefreshToken(
    isServer: boolean = false
  ): Promise<string | null> {
    try {
      if (isServer) {
        const session = await getServerSession(authOptions);
        return session?.refreshToken || null;
      } else {
        const session = await getSession();
        return session?.refreshToken || null;
      }
    } catch {
      return null;
    }
  }

  private async requestWithRetry<T>(
    method: "GET" | "POST" | "PATCH" | "DELETE",
    path: string,
    data: unknown = null,
    useAuth: boolean = false,
    isServer: boolean = false
  ): Promise<T | HttpError> {
    let token: string | null = null;

    if (useAuth) {
      token = await this.getAccessToken(isServer);
    }

    const makeRequest = async (accessToken?: string) => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

      return fetch(`${this.baseUrl}${path}`, {
        method,
        headers,
        ...(method === "POST" || method === "PATCH"
          ? { body: JSON.stringify(data) }
          : {}),
      });
    };

    let response = await makeRequest(token || undefined);

    // Handle 401 - try to refresh token
    if (response.status === 401 && useAuth) {
      const refreshToken = await this.getRefreshToken(isServer);
      if (refreshToken) {
        const newAccessToken = await this.refreshAccessToken(refreshToken);
        if (newAccessToken) {
          // next-auth doesn't export an `update` helper to mutate the session here;
          // just retry the request with the refreshed access token.
          // If you need to persist the new token client-side, store it via your own logic (cookie/localStorage/secure storage).
          response = await makeRequest(newAccessToken);
        } else {
          return { error: true, message: "Unauthorized and refresh failed" };
        }
      } else {
        return { error: true, message: "No refresh token available" };
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { error: true, message: error.message || "Request failed" };
    }

    return response.json() as Promise<T>;
  }

  async post<T>(
    path: string,
    data: unknown,
    useAuth: boolean = false,
    isServer: boolean = false
  ): Promise<T | HttpError> {
    return this.requestWithRetry<T>("POST", path, data, useAuth, isServer);
  }

  async get<T>(
    path: string,
    useAuth: boolean = false,
    isServer: boolean = false
  ): Promise<T | HttpError> {
    return this.requestWithRetry<T>("GET", path, undefined, useAuth, isServer);
  }

  async patch<T>(
    path: string,
    data: unknown,
    useAuth: boolean = false,
    isServer: boolean = false
  ): Promise<T | HttpError> {
    return this.requestWithRetry<T>("PATCH", path, data, useAuth, isServer);
  }

  async delete<T>(
    path: string,
    data: unknown,
    useAuth: boolean = false,
    isServer: boolean = false
  ): Promise<T | HttpError> {
    return this.requestWithRetry<T>("DELETE", path, data, useAuth, isServer);
  }

  //   async upload<T>(
  //     path: string,
  //     file: File,
  //     useAuth: boolean = false,
  //     isServer: boolean = false
  //   ): Promise<T | HttpError> {
  //     let token: string | null = null;

  //     if (useAuth) {
  //       token = await this.getAccessToken(isServer);
  //     }

  //     const formData = new FormData();
  //     formData.append("image", file);

  //     const makeRequest = async (accessToken?: string) => {
  //       const headers: HeadersInit = {};
  //       if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  //       return fetch(`${this.baseUrl}${path}`, {
  //         method: "POST",
  //         headers,
  //         body: formData,
  //       });
  //     };

  //     let response = await makeRequest(token || undefined);

  //     if (response.status === 401 && useAuth) {
  //       const refreshToken = await this.getRefreshToken(isServer);
  //       if (refreshToken) {
  //         const newAccessToken = await this.refreshAccessToken(refreshToken);
  //         if (newAccessToken) {
  //           if (!isServer) {
  //             const { update } = await import("next-auth/react");
  //             await update({
  //               accessToken: newAccessToken,
  //             });
  //           }
  //           response = await makeRequest(newAccessToken);
  //         } else {
  //           return { error: true, message: "Unauthorized and refresh failed" };
  //         }
  //       } else {
  //         return { error: true, message: "No refresh token available" };
  //       }
  //     }

  //     if (!response.ok) {
  //       const error = await response.json().catch(() => ({}));
  //       return { error: true, message: error.message || "Upload failed" };
  //     }

  //     return response.json() as Promise<T>;
  //   }
}
