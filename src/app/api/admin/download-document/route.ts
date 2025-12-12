// app/api/admin/download-document/route.ts

import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest) {
  try {
    console.log("📥 Download request received");
    
    // Verify authentication
    const token = await getToken({ req, secret });
    
    if (!token) {
      console.error("❌ No valid token found");
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    console.log("✅ Token verified for user:", token.email);

    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get("url");

    if (!fileUrl) {
      console.error("❌ Missing url parameter");
      return new NextResponse("Missing url parameter", { status: 400 });
    }

    console.log("📄 Requested file URL:", fileUrl);

    // Validate it's a Cloudinary URL (security check)
    if (!fileUrl.includes('cloudinary.com')) {
      console.error("❌ Invalid URL - not from Cloudinary");
      return new NextResponse("Invalid file URL", { status: 400 });
    }

    // Fetch the file from Cloudinary
    const cloudinaryResponse = await fetch(fileUrl);

    if (!cloudinaryResponse.ok) {
      console.error("❌ Failed to fetch from Cloudinary:", cloudinaryResponse.status);
      return new NextResponse("Failed to fetch file from storage", { status: 404 });
    }

    const fileBuffer = await cloudinaryResponse.arrayBuffer();
    const contentType = cloudinaryResponse.headers.get("content-type") || "application/octet-stream";
    
    // Extract filename from URL
    const urlParts = fileUrl.split('/');
    const fileNameWithExt = urlParts[urlParts.length - 1];
    const fileName = fileNameWithExt.split('?')[0]; // Remove query params if any

    console.log("✅ File fetched successfully, size:", fileBuffer.byteLength);
    console.log("📝 Filename:", fileName);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileBuffer.byteLength.toString(),
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("❌ Download error:", error);
    return new NextResponse(
      `Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 
      { status: 500 }
    );
  }
}