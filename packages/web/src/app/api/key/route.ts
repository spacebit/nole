import { NextResponse } from "next/server";
import { getPinataInstance } from "@/lib/pinata";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pinata = await getPinataInstance();

    const uuid = crypto.randomUUID();
    const keyData = await pinata.keys.create({
      keyName: uuid.toString(),
      permissions: {
        endpoints: {
          pinning: {
            pinFileToIPFS: true,
          },
        },
      },
      maxUses: 1,
    });

    return NextResponse.json({ JWT: keyData.JWT }, { status: 200 });
  } catch (error) {
    console.error("❌ Error creating API Key:", error);
    return NextResponse.json({ error: "Error generating API Key" }, { status: 500 });
  }
}
