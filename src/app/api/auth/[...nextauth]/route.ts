import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import getBaseUrl from "@/services/baseUrl";

const baseUrl = getBaseUrl("live");

// Refresh token helper
async function refreshAccessToken(token: any): Promise<any> {
  try {
    console.log("🔄 Attempting to refresh token...");
    
    const res = await fetch(`${baseUrl}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Refresh failed:", data.message);
      throw new Error(data.message || "Refresh token failed");
    }

    console.log("✅ Token refreshed successfully");

    return {
      ...token,
      accessToken: data.accessToken, // Backend returns at root level
      refreshToken: data.refreshToken || token.refreshToken,
      accessTokenExpires: Date.now() + 5 * 60 * 1000, // 5 min
      error: undefined, // Clear any previous errors
    };
  } catch (error) {
    console.error("❌ Refresh token error:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        try {
          console.log("🔐 Attempting login for:", credentials.email);
          
          // Only send email and password to backend, not the extra NextAuth properties
          const res = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            console.error("❌ Login failed:", data.message);
            throw new Error(data.message || "Login failed");
          }

          console.log("✅ Login successful for:", credentials.email);

          return {
            id: data.user?.id,
            email: data.user?.email,
            name: data.user?.name,
            accessToken: data.tokens?.accessToken,
            refreshToken: data.tokens?.refreshToken,
          } as User;
        } catch (error: any) {
          console.error("❌ Authorization error:", error.message);
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      // Initial sign in
      if (user) {
        console.log("👤 New user login, setting initial token");
        return {
          ...token,
          accessToken: user.accessToken!,
          refreshToken: user.refreshToken!,
          id: user.id!,
          accessTokenExpires: Date.now() + 5 * 60 * 1000, // 5 min
          error: undefined,
        };
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        console.log("✓ Token still valid");
        return token;
      }

      // Access token has expired, try to refresh it
      console.log("⚠️ Token expired, refreshing...");
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user = session.user || {};
      session.user.id = token.id!;
      session.accessToken = token.accessToken!;
      session.refreshToken = token.refreshToken!;
      session.error = token.error;
      
      if (token.error) {
        console.warn("⚠️ Session has error:", token.error);
      }
      
      return session;
    },
  },

  pages: { signIn: "/auth/sign-in", error: "/auth/sign-in" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };