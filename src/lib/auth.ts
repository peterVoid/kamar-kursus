import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { env } from "@/env";
import { admin, emailOTP } from "better-auth/plugins";
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ otp }) {
        await resend.emails.send({
          from: "Kamar-Kursus <onboarding@resend.dev>",
          to: ["haikalprasetya.alhakim12@gmail.com"],
          subject: "Hello world",
          html: `<h1>It works ${otp}</h1>`,
        });
      },
    }),
    admin(),
  ],
  advanced: {
    cookiePrefix: env.COOKIE_PREFIX,
  },
});
