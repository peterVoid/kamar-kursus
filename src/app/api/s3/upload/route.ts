import { requireAdmin } from "@/data/require-admin";
import { env } from "@/env";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3-client";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

const validationSchema = z.object({
  fileName: z.string().min(1, "Required"),
  size: z.number().min(1, "Required"),
  contentType: z.string().min(1, "Required"),
});

export async function POST(req: Request) {
  const session = await requireAdmin();

  try {
    const decision = await aj.protect(req, {
      userId: session.id,
    });
    if (decision.isDenied()) {
      return NextResponse.json({ message: null }, { status: 429 });
    }

    const body = await req.json();

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: "Data invalid" }, { status: 400 });
    }

    const { contentType, fileName, size } = validation.data;

    const generateUniqueId = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: generateUniqueId,
      ContentLength: size,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return NextResponse.json({ presignedUrl, key: generateUniqueId });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}
