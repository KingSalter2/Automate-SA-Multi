import type { Handler } from "@netlify/functions";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

type DownloadBucket = "private";

const getRequiredEnv = (key: string) => {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
};

const normalizeEnvValue = (value: string) => {
  const trimmed = value.trim();
  const isWrapped =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith("`") && trimmed.endsWith("`"));
  return isWrapped ? trimmed.slice(1, -1).trim() : trimmed;
};

const normalizeFirebasePrivateKey = (value: string) => {
  let v = normalizeEnvValue(value);
  if (v.startsWith("{")) {
    try {
      const parsed = JSON.parse(v) as { private_key?: unknown };
      if (typeof parsed.private_key === "string") v = parsed.private_key;
    } catch {
      // ignore
    }
  }
  v = v.replace(/\\n/g, "\n").trim();
  if (!v.includes("BEGIN PRIVATE KEY") || !v.includes("END PRIVATE KEY")) {
    throw new Error(
      "Invalid FIREBASE_ADMIN_PRIVATE_KEY. Paste the full 'private_key' value from the Firebase service account JSON.",
    );
  }
  return v;
};

const getFirebaseAuth = () => {
  if (!getApps().length) {
    const projectId = normalizeEnvValue(getRequiredEnv("FIREBASE_ADMIN_PROJECT_ID"));
    const clientEmail = normalizeEnvValue(getRequiredEnv("FIREBASE_ADMIN_CLIENT_EMAIL"));
    const privateKey = normalizeFirebasePrivateKey(getRequiredEnv("FIREBASE_ADMIN_PRIVATE_KEY"));

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }
  return getAuth();
};

const getS3Client = () => {
  const accountId = getRequiredEnv("R2_ACCOUNT_ID");
  const accessKeyId = getRequiredEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = getRequiredEnv("R2_SECRET_ACCESS_KEY");

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });
};

const sanitizeKey = (key: string) => {
  const cleaned = key.trim().replace(/^\/+/, "");
  if (!cleaned) return null;
  if (cleaned.includes("..")) return null;
  return cleaned;
};

const getBucketName = (bucket: DownloadBucket) => {
  if (bucket === "private") return getRequiredEnv("R2_PRIVATE_BUCKET");
  return null;
};

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const authHeader = event.headers.authorization ?? event.headers.Authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;
    if (!token) return { statusCode: 401, body: "Unauthorized" };

    await getFirebaseAuth().verifyIdToken(token);

    const body = event.body ? JSON.parse(event.body) : null;
    const bucket = body?.bucket as DownloadBucket | undefined;
    const key = typeof body?.key === "string" ? sanitizeKey(body.key) : null;

    if (!bucket || bucket !== "private") return { statusCode: 400, body: "Invalid bucket" };
    if (!key) return { statusCode: 400, body: "Invalid key" };

    const bucketName = getBucketName(bucket);
    if (!bucketName) return { statusCode: 500, body: "Misconfigured bucket" };

    const s3 = getS3Client();
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 });

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url }),
    };
  } catch (e: unknown) {
    const message =
      e && typeof e === "object" && "message" in e && typeof (e as { message?: unknown }).message === "string"
        ? (e as { message: string }).message
        : "Internal Server Error";
    return { statusCode: 500, body: message };
  }
};
