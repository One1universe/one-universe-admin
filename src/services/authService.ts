import { signIn } from "next-auth/react";

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignInResponse {
  success: boolean;
  url?: string;
  error?: boolean;
  message?: string;
}

const authService = {
  async signin(credentials: SignInCredentials): Promise<SignInResponse> {
    try {
      console.log("🔐 Attempting sign in with NextAuth...");

      const result = await signIn("credentials", {
        redirect: false, // Don't redirect automatically
        email: credentials.email,
        password: credentials.password,
      });

      console.log("📝 Sign in result:", result);
      console.log("📝 Result status:", result?.status);
      console.log("📝 Result ok:", result?.ok);
      console.log("📝 Result error:", result?.error);
      console.log("📝 Result url:", result?.url);

      if (result?.error) {
        console.error("❌ Sign in failed:", result.error);
        return {
          success: false,
          error: true,
          message: result.error || "Invalid credentials",
        };
      }

      if (result?.ok) {
        console.log("✅ Sign in successful");
        return {
          success: true,
          url: result.url || "/admin", // Default to admin dashboard
        };
      }

      // Fallback for unexpected results
      return {
        success: false,
        error: true,
        message: "An unexpected error occurred",
      };
    } catch (error: any) {
      console.error("❌ Sign in error:", error);
      return {
        success: false,
        error: true,
        message: error.message || "Failed to sign in",
      };
    }
  },
};

export default authService;