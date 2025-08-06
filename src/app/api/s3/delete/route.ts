import { requireAdmin } from "@/data/require-admin";
import { env } from "@/env";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { s3 } from "@/lib/s3-client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export async function DELETE(req: Request) {
  const session = await requireAdmin();

  try {
    const decision = await aj.protect(req, { userId: session.id });

    if (decision.isDenied()) {
      return NextResponse.json({ message: null }, { status: 429 });
    }

    const body = await req.json();

    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: body.key,
    });

    await getSignedUrl(s3, command, { expiresIn: 3600 });

    return NextResponse.json({ message: null });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}
