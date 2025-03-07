import { NextResponse, type NextRequest } from "next/server";
import { getPinataInstance } from "@/lib/pinata";
import { MAX_FILE_SIZE } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    console.log("✅ Received file upload request...");

    const pinata = await getPinataInstance();
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      console.error("❌ No file provided.");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      console.error("❌ File is too large.");
      return NextResponse.json({ error: "File size exceeds 1MB limit" }, { status: 413 });
    }

    console.log("📤 Uploading file to Pinata...");

    const uploadData = await pinata.upload.file(file);
    console.log("✅ File uploaded:", uploadData);

    const url = await pinata.gateways.convert(uploadData.IpfsHash);
    console.log("✅ File accessible at:", url);

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error("❌ Error uploading file:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
