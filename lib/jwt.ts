const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "oordhwa_admin_jwt_secret_key_2026_secure_hmac";

function base64UrlEncode(buffer: ArrayBuffer | Uint8Array | string): string {
  let str = "";
  if (typeof buffer === "string") {
    str = btoa(unescape(encodeURIComponent(buffer)));
  } else {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    str = btoa(binary);
  }
  return str.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export interface AdminTokenPayload {
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Sign a JWT token using Web Crypto API (supported in Next.js Edge Middleware and Node.js).
 */
export async function signJwtToken(
  payload: Record<string, unknown>,
  expiresInSeconds: number = 86400,
): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  const key = await getHmacKey(JWT_SECRET);
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(dataToSign),
  );

  const signature = base64UrlEncode(signatureBuffer);
  return `${dataToSign}.${signature}`;
}

/**
 * Verify a JWT token using Web Crypto API (supported in Next.js Edge Middleware and Node.js).
 */
export async function verifyJwtToken<T = AdminTokenPayload>(
  token: string,
): Promise<T | null> {
  try {
    if (!token || typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signatureStr] = parts;
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    const key = await getHmacKey(JWT_SECRET);
    const enc = new TextEncoder();

    let base64Sig = signatureStr.replace(/-/g, "+").replace(/_/g, "/");
    while (base64Sig.length % 4) base64Sig += "=";
    const binarySig = atob(base64Sig);
    const sigBytes = new Uint8Array(binarySig.length);
    for (let i = 0; i < binarySig.length; i++) {
      sigBytes[i] = binarySig.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      enc.encode(dataToSign),
    );

    if (!isValid) return null;

    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as T & {
      exp?: number;
    };
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
