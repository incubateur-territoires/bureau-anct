import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { parseProConnectUserinfo } from "./infrastructure/proconnect/userinfo"
import { getOidcConfig } from "./infrastructure/proconnect/discovery"
import { authEnabled, authSecret, devBypassEmail, env } from "./env"

export { authEnabled } from "./env"

function deriveNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email
  return local
    .split(/[._+-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function devBypassProvider(email: string) {
  return Credentials({
    id: "proconnect",
    name: "ProConnect",
    credentials: {},
    async authorize() {
      return {
        id: "dev-bypass",
        name: deriveNameFromEmail(email),
        email,
      }
    },
  })
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: authSecret,
  providers: authEnabled
    ? [
        {
          id: "proconnect",
          name: "ProConnect",
          type: "oidc",
          // Validés par assertRequiredEnv() dans env.ts quand authEnabled
          issuer: env.PROCONNECT_ISSUER!,
          clientId: env.PROCONNECT_CLIENT_ID!,
          clientSecret: env.PROCONNECT_CLIENT_SECRET!,
          checks: ["state", "pkce"],
          authorization: {
            params: {
              scope: "openid given_name usual_name email",
              acr_values: "eidas1",
            },
          },
          async profile(_profile, tokens) {
            // L'endpoint userinfo est lu depuis le discovery : ProConnect le
            // sert sur /oauth/userinfo, pas sur `${issuer}/userinfo`.
            const { userinfo_endpoint } = await getOidcConfig()
            const res = await fetch(userinfo_endpoint, {
              headers: { Authorization: `Bearer ${tokens.access_token}` },
            })
            if (!res.ok) {
              throw new Error(
                `ProConnect userinfo failed: ${res.status} ${res.statusText}`,
              )
            }
            const user = await parseProConnectUserinfo(
              await res.text(),
              env.PROCONNECT_ISSUER!,
              env.PROCONNECT_CLIENT_ID!,
            )
            return {
              id: user.sub,
              name: `${user.givenName} ${user.usualName}`.trim(),
              email: user.email,
            }
          },
        },
      ]
    : devBypassEmail
      ? [devBypassProvider(devBypassEmail)]
      : [],
})

export async function getCurrentUser() {
  const session = await auth()
  return session?.user ?? null
}
