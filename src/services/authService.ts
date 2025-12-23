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

/**
 * Extract error message from various response formats
 * Handles: { message: string }, { message: string[] }, { error: string }, { statusCode, message }
 */
function extractErrorMessage(data: any, responseText?: string): string {
  if (!data && !responseText) {
    return "An unknown error occurred";
  }

  // Handle string message: { message: "error text" }
  if (typeof data?.message === "string" && data.message) {
    return data.message;
  }

  // Handle array of messages: { message: ["error 1", "error 2"] }
  if (Array.isArray(data?.message) && data.message.length > 0) {
    return data.message[0];
  }

  // Handle error field: { error: "error text" }
  if (typeof data?.error === "string" && data.error) {
    return data.error;
  }

  // Handle NestJS error response: { statusCode: 400, message: "error text" }
  if (data?.statusCode && data?.message) {
    return typeof data.message === "string" 
      ? data.message 
      : Array.isArray(data.message) 
        ? data.message[0] 
        : "An error occurred";
  }

  // Handle raw response text (last resort)
  if (responseText && typeof responseText === "string") {
    try {
      const parsed = JSON.parse(responseText);
      return extractErrorMessage(parsed);
    } catch {
      return responseText.substring(0, 200);
    }
  }

  return "An unknown error occurred";
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
      // /console.error("Auth service error:", error);
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
      // console.error("Sign out error:", error);
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
      // console.log("📧 Requesting OTP for password reset:", { email });

      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const responseText = await response.text();
      let data: any = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          data = { rawResponse: responseText };
        }
      }

      if (!response.ok) {
        const errorMessage = extractErrorMessage(data, responseText);

        // console.error("❌ Failed to request OTP:", {
        //   status: response.status,
        //   message: errorMessage,
        // });

        throw new Error(errorMessage);
      }

      // console.log("✅ OTP requested successfully:", data);
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to request OTP";

      // console.error("❌ Error requesting OTP:", errorMessage);
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
      // console.log("🔐 Verifying OTP code:", { email, code, tokenLength: token?.length });

      const payload = {
        email,
        code,
        purpose: "FORGOT_PASSWORD",
      };

      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      let data: any = {};
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          // console.log("⚠️ Could not parse response as JSON");
          data = { rawResponse: responseText };
        }
      }

      if (!response.ok) {
        const errorMessage = extractErrorMessage(data, responseText);

        // console.error("❌ Failed to verify OTP:", {
        //   status: response.status,
        //   statusText: response.statusText,
        //   message: errorMessage,
        // });

        throw new Error(errorMessage);
      }

      // console.log("✅ OTP verified successfully:", data);
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to verify OTP";

      // console.error("❌ Error verifying OTP:", errorMessage);
      throw error;
    }
  },

  /**
   * Change password with current password
   * POST /auth/change-password
   * 
   * Backend throws errors for:
   * - "Current password is incorrect" (if current password doesn't match)
   * - "Passwords do not match" (if newPassword !== confirmPassword)
   * - "New password cannot be the same as your current password" (if same as old)
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
    token: string
  ): Promise<{ message: string }> {
    try {
      // console.log("🔐 Changing password...");

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

      // Get response text first to handle both JSON and plain text errors
      const responseText = await response.text();
      // console.log("📬 Response status:", response.status);
      // console.log("📬 Response text:", responseText);

      let data: any = {};
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          // console.log("⚠️ Could not parse response as JSON");
          data = { rawResponse: responseText };
        }
      }

      if (!response.ok) {
        // Extract the user-friendly error message using helper
        const errorMessage = extractErrorMessage(data, responseText);

        // console.error("❌ Failed to change password:", {
        //   status: response.status,
        //   statusText: response.statusText,
        //   message: errorMessage,
        //   fullData: data,
        // });

        throw new Error(errorMessage);
      }

      // console.log("✅ Password changed successfully");
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to change password";

      // console.error("❌ Error changing password:", errorMessage);
      throw error;
    }
  },
};

export default authService;