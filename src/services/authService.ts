// services/authService.ts

import { signIn, signOut, getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://one-universe-de5673cf0d65.herokuapp.com/api/v1";

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignInResponse {
  success: boolean;
  url?: string;
  error?: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
}

interface SignOutResponse {
  success: boolean;
  message?: string;
}

const authService = {
  /**
   * Sign in with credentials
   */
  async signin(credentials: { email: string; password: string }): Promise<SignInResponse> {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: credentials.email,
        password: credentials.password,
      });

      if (result?.error) {
        return {
          success: false,
          error: true,
          message: result.error,
        };
      }

      if (result?.ok) {
        // Fetch the session to get tokens
        const session = await getSession();

        return {
          success: true,
          url: result.url || "/admin",
          accessToken: session?.accessToken,
          refreshToken: session?.refreshToken,
        };
      }

      return {
        success: false,
        error: true,
        message: "Login failed",
      };
    } catch (error: any) {
      console.error("Auth service error:", error);
      return {
        success: false,
        error: true,
        message: error.message || "An error occurred during sign in",
      };
    }
  },

  /**
   * Sign out
   */
  async signout(): Promise<SignOutResponse> {
    try {
      await signOut({ redirect: false });

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error: any) {
      console.error("Sign out error:", error);
      return {
        success: false,
        message: error.message || "An error occurred during sign out",
      };
    }
  },

  /**
   * Request OTP for password reset
   * POST /auth/forgot-password
   */
  async requestPasswordResetOTP(
    email: string,
    token: string
  ): Promise<{ message: string }> {
    try {
      console.log("📧 Requesting OTP for password reset:", { email });

      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data?.message?.[0] ||
          data?.message ||
          data?.error ||
          `HTTP ${response.status}`;

        console.error("❌ Failed to request OTP:", {
          status: response.status,
          message: errorMessage,
        });

        throw new Error(String(errorMessage));
      }

      console.log("✅ OTP requested successfully:", data);
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to request OTP";

      console.error("❌ Error requesting OTP:", errorMessage);
      throw error;
    }
  },

  /**
   * Verify OTP for password reset
   * POST /auth/verify
   */
  async verifyPasswordResetOTP(
    email: string,
    code: string,
    token: string
  ): Promise<{ message: string }> {
    try {
      console.log("🔐 Verifying OTP code:", { email, code, tokenLength: token?.length });

      const payload = {
        email,
        code,
        purpose: "FORGOT_PASSWORD",
      };

      console.log("📤 OTP Verification Request:", {
        url: `${API_BASE_URL}/auth/verify`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.substring(0, 20)}...`,
        },
        body: payload,
      });

      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("📬 OTP Response status:", response.status);
      console.log("📬 OTP Response ok:", response.ok);
      console.log("📬 OTP Response headers:", {
        contentType: response.headers.get("content-type"),
        contentLength: response.headers.get("content-length"),
      });

      // Get response text first
      const responseText = await response.text();
      console.log("📦 Raw response text length:", responseText.length);
      console.log("📦 Raw response text:", responseText);

      let data: any = {};
      if (responseText) {
        try {
          data = JSON.parse(responseText);
          console.log("📦 Parsed response data:", data);
        } catch (e) {
          console.log("⚠️ Could not parse response as JSON");
          data = { rawResponse: responseText };
        }
      }

      if (!response.ok) {
        console.error("❌ Response NOT ok!");
        const errorMessage =
          data?.message?.[0] ||
          data?.message ||
          data?.error ||
          responseText ||
          `HTTP ${response.status}`;

        console.error("❌ Failed to verify OTP:", {
          status: response.status,
          statusText: response.statusText,
          message: errorMessage,
          responseData: data,
        });

        throw new Error(String(errorMessage));
      }

      console.log("✅ OTP verified successfully:", data);
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to verify OTP";

      console.error("❌ Error verifying OTP:", errorMessage);
      throw error;
    }
  },

  /**
   * Change password with current password
   * POST /auth/change-password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
    token: string
  ): Promise<{ message: string }> {
    try {
      console.log("🔐 Changing password");

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data?.message?.[0] ||
          data?.message ||
          data?.error ||
          `HTTP ${response.status}`;

        console.error("❌ Failed to change password:", {
          status: response.status,
          message: errorMessage,
        });

        throw new Error(String(errorMessage));
      }

      console.log("✅ Password changed successfully:", data);
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to change password";

      console.error("❌ Error changing password:", errorMessage);
      throw error;
    }
  },
};

export default authService;