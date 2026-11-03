// app/api/imageupload/presigned/route.ts
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
  secure: true,
});

export async function GET() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "channels"; // Optional folder in Cloudinary

    // Parameters to sign
    const paramsToSign = {
      timestamp: timestamp,
      folder: folder,
    };

    const apiSecret = process.env.CLOUDINARY_API_SECRET_KEY;
    if (!apiSecret) {
      return NextResponse.json(
        { success: false, message: "Missing CLOUDINARY_API_SECRET_KEY" },
        { status: 500 },
      );
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret,
    );

    return NextResponse.json({
      success: true,
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error: any) {
    console.error("Presign error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
