// services/profileService.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://one-universe-de5673cf0d65.herokuapp.com/api/v1";

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  createdAt: string;
  role: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface PanicContact {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  userId: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  nin: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  address: string | null;
  profilePicture: string | null;
  isOnline: boolean;
  lastLoginAt: string;
  lastLogoutAt: string | null;
  referralCode: string;
  latitude: number | null;
  longitude: number | null;
  premiumStatus: boolean;
  sponsorStatus: boolean;
  verificationStatus: boolean;
  lastVerificationReminderAt: string;
  userRoles: UserRole[];
  sellerProfile: any | null;
  buyerProfile: any | null;
  Wallet: any | null;
  PanicContact: PanicContact[];
  JobDocument: any[];
  userType: string;
  wallet: {
    balance: number;
    holdBalance: number;
  };
  panicContacts: PanicContact[];
  jobDocuments: any[];
}

export interface UpdateProfilePayload {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
}

class ProfileService {
  /**
   * Validate token before making requests
   */
  private validateToken(token: string | null | undefined): void {
    if (!token || typeof token !== "string" || token.trim() === "") {
      console.error("❌ Token validation failed:", {
        token: token ? `${token.substring(0, 20)}...` : "null/undefined",
        type: typeof token,
        empty: token ? token.trim() === "" : "N/A",
      });
      throw new Error("Invalid or missing token. Please log in again.");
    }
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Fetch user profile by ID
   */
  async getUserProfile(userId: string, token: string): Promise<UserProfile> {
    try {
      // Validate inputs
      this.validateToken(token);

      if (!userId || typeof userId !== "string") {
        throw new Error("Invalid user ID provided");
      }

      console.log("📊 Fetching user profile:", {
        userId,
        tokenLength: token?.length,
        api: `${API_BASE_URL}/admin/users/${userId}`,
      });

      const response = await fetch(
        `${API_BASE_URL}/admin/users/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({}));
        const errorMessage =
          errorData.message ||
          errorData.error ||
          `HTTP ${response.status}`;

        console.error("❌ Profile fetch failed:", {
          status: response.status,
          message: errorMessage,
          userId,
        });

        // Handle specific error codes
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Unauthorized. Your session may have expired. Please log in again."
          );
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("✅ Profile fetched successfully:", {
        userId,
        name: data.fullName,
      });
      return data;
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    payload: UpdateProfilePayload,
    token: string
  ): Promise<UserProfile> {
    try {
      // Validate inputs
      this.validateToken(token);

      console.log("📝 Updating profile:", {
        tokenLength: token?.length,
        fields: Object.keys(payload),
      });

      const response = await fetch(
        `${API_BASE_URL}/buyer/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({}));
        const errorMessage =
          errorData.message ||
          errorData.error ||
          `HTTP ${response.status}`;

        console.error("❌ Profile update failed:", {
          status: response.status,
          message: errorMessage,
        });

        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Unauthorized. Your session may have expired. Please log in again."
          );
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("✅ Profile updated successfully");
      return data;
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      throw error;
    }
  }

  /**
   * Upload profile picture with email
   * PATCH /buyer/profile with JSON containing profilePicture URL
   */
  async uploadProfilePicture(
    file: File,
    token: string,
    email: string
  ): Promise<{ profilePicture: string }> {
    try {
      // Validate inputs
      this.validateToken(token);

      if (!file || !(file instanceof File)) {
        throw new Error("Invalid file provided");
      }

      if (!email || !this.isValidEmail(email)) {
        throw new Error("Invalid email format");
      }

      console.log("📸 Uploading profile picture:", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        email,
        tokenLength: token?.length,
      });

      // Compress the image first to reduce size
      console.log("🔄 Compressing image...");
      const compressedBase64 = await this.compressImage(file);
      console.log("✅ Image compressed, new size:", compressedBase64.length);

      // Backend expects profilePicture field with base64 data URI
      const payload = {
        email,
        profilePicture: compressedBase64, // ← Send as profilePicture with data URI
      };

      console.log("📤 JSON payload prepared:");
      console.log("  - email:", email);
      console.log("  - profilePicture length:", compressedBase64.length);

      console.log("📤 Sending request...");
      console.log("🔗 URL:", `${API_BASE_URL}/buyer/profile`);
      console.log("📋 Method: PATCH");
      console.log("📋 Content-Type: application/json");

      const response = await fetch(
        `${API_BASE_URL}/buyer/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("✅ Request sent!");
      console.log("📬 Response status:", response.status);
      console.log("📬 Response ok:", response.ok);

      // Get response text first to see what we're dealing with
      const responseText = await response.text();
      console.log("📦 Raw response text:", responseText);

      let data: any = {};
      if (responseText) {
        try {
          data = JSON.parse(responseText);
          console.log("📦 Parsed response data:", data);
        } catch (e) {
          console.log("⚠️ Could not parse response as JSON");
          data = {};
        }
      }

      if (!response.ok) {
        console.error("❌ Response NOT ok!");
        const errorMessage =
          data?.message?.[0] ||
          data?.message ||
          data?.error ||
          data?.errors ||
          responseText ||
          `HTTP ${response.status}`;

        console.error("❌ Profile picture upload failed:", {
          status: response.status,
          statusText: response.statusText,
          message: errorMessage,
          responseData: data,
        });

        if (response.status === 413) {
          throw new Error(
            "Image is too large. Please use a smaller image (under 1MB recommended)."
          );
        }

        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Unauthorized. Your session may have expired. Please log in again."
          );
        }

        throw new Error(String(errorMessage));
      }

      // Success! (200 OK)
      console.log("✅ Response is OK! Status:", response.status);
      console.log("✅ Profile picture uploaded successfully");
      console.log("📦 Full response data:", data);

      // Handle different response formats
      if (data.profilePicture) {
        return { profilePicture: data.profilePicture };
      }
      if (data.data?.profilePicture) {
        return { profilePicture: data.data.profilePicture };
      }

      // If response is empty but status is 200
      if (!data || Object.keys(data).length === 0) {
        console.log(
          "⚠️ Response was empty but upload succeeded. Refreshing profile..."
        );
        return { profilePicture: compressedBase64 };
      }

      console.log("📦 Returning response data:", data);
      return data as { profilePicture: string };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to upload profile picture";

      console.error("❌ Error uploading profile picture:", {
        error: errorMessage,
        type: typeof error,
      });

      throw error;
    }
  }

  /**
   * Compress image and convert to base64 data URI
   * Reduces file size significantly while maintaining quality
   */
  private compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Max dimensions to prevent huge files
          const maxWidth = 1024;
          const maxHeight = 1024;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Compress with quality setting (0.7 = 70% quality)
          // This significantly reduces file size
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          console.log("✅ Compression complete:");
          console.log("  - Original size:", file.size, "bytes");
          console.log(
            "  - Compressed size:",
            compressedDataUrl.length,
            "bytes"
          );
          console.log(
            "  - Reduction:",
            Math.round(
              ((file.size - compressedDataUrl.length) / file.size) * 100
            ) + "%"
          );

          resolve(compressedDataUrl);
        };

        img.onerror = () => {
          reject(new Error("Could not load image"));
        };

        const dataUrl = e.target?.result as string;
        img.src = dataUrl;
      };

      reader.onerror = () => {
        reject(new Error("Could not read file"));
      };

      reader.readAsDataURL(file);
    });
  }
}

export const profileService = new ProfileService();