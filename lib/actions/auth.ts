"use server";

import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "../workflow";
import config from "../config";

export async function signUp(params: AuthCredentials) {
  const { fullName, email, universityId, password, universityCard } = params;

  // rate limit protection
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) redirect("/too-fast");

  // check if the user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return {
      success: false,
      error: "User already exists",
    };
  }

  const hashedPassword = await hash(password, 10);
  try {
    await db.insert(users).values({
      fullName,
      email,
      universityId,
      universityCard,
      password: hashedPassword,
    });

    await workflowClient.trigger({
      url: `${config.env.apiEndPoint}/api/workflows/onboarding`,
      body: {
        email,
        fullName,
      },
    });
    await signInWithCredentials({ email, password });

    return { success: true };
  } catch (error) {
    console.error("SignUp Error", error);
    return { success: false, error: "SignUp Error" };
  }
}

export async function signInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">
) {
  const { email, password } = params;

  // rate limit protection
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) redirect("/too-fast");

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    console.log("result", result);
    return { success: true };
  } catch (error) {
    console.error("SignIn Error", error);
    return { success: false, error: "SignIn Error" };
  }
}
