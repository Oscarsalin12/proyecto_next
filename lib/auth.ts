import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function getSession() {
  const token = (await cookies()).get("authToken")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as any;
  } catch {
    return null;
  }
}