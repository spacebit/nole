import { NextResponse, type NextRequest } from "next/server";
import { getPinataInstance } from "@/lib/pinata";

export async function POST(request: NextRequest) {
  try {
    console.log("✅ Received metadata upload request...");

    const pinata = await getPinataInstance();
    const metadata = await request.json();

    if (!metadata.name || !metadata.description || !metadata.image) {
      return NextResponse.json({ error: "Missing required metadata fields" }, { status: 400 });
    }

    console.log("📤 Uploading metadata to Pinata...", metadata);

    const uploadData = await pinata.upload.json(metadata);
    console.log("✅ Metadata uploaded:", uploadData);

    const url = await pinata.gateways.convert(uploadData.IpfsHash);
    console.log("✅ Metadata accessible at:", url);

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error("❌ Error uploading metadata:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
