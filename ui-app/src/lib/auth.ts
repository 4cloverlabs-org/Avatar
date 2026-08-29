import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "./db";
import { dash } from "@better-auth/infra";
import { twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  appName: "AnClone",
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://10.171.188.44:3000",
    "https://hypnotist-quality-splashy.ngrok-free.dev",
    "https://dash.better-auth.com"
  ],
  onAPIError: {
    errorURL: "/login",
  },
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for"],
    },
    database: {
      joins: true,
    }
  },
  plugins: [
    dash(),
    twoFactor({
      issuer: "AvatarApp",
      totpOptions: {
        issuer: "AvatarApp"
      },
      allowPasswordless: true
    })
  ]
});
export type Auth = typeof auth;
