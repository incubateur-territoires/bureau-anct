import { createRemoteJWKSet, type JWTVerifyGetKey } from "jose"
import { z } from "zod"

const oidcConfigSchema = z.object({
  issuer: z.string(),
  jwks_uri: z.string().url(),
  userinfo_endpoint: z.string().url(),
})

type OidcConfig = z.infer<typeof oidcConfigSchema>

const TTL_MS = 60 * 60 * 1000

let configCache: { value: OidcConfig; expiresAt: number } | null = null
let jwksCache: JWTVerifyGetKey | null = null

async function fetchConfig(): Promise<OidcConfig> {
  const issuer = process.env.PROCONNECT_ISSUER
  if (!issuer) {
    throw new Error("PROCONNECT_ISSUER non défini")
  }
  const res = await fetch(`${issuer}/.well-known/openid-configuration`)
  if (!res.ok) {
    throw new Error(
      `Discovery OIDC ProConnect en échec: ${res.status} ${res.statusText}`,
    )
  }
  const parsed = oidcConfigSchema.safeParse(await res.json())
  if (!parsed.success) {
    throw new Error(
      `Document discovery ProConnect invalide: ${parsed.error.message}`,
    )
  }
  return parsed.data
}

export async function getOidcConfig(): Promise<OidcConfig> {
  if (configCache && configCache.expiresAt > Date.now()) {
    return configCache.value
  }
  const value = await fetchConfig()
  configCache = { value, expiresAt: Date.now() + TTL_MS }
  return value
}

export async function getJwks(): Promise<JWTVerifyGetKey> {
  if (jwksCache) return jwksCache
  const config = await getOidcConfig()
  jwksCache = createRemoteJWKSet(new URL(config.jwks_uri))
  return jwksCache
}

export function _resetDiscoveryCacheForTests(): void {
  configCache = null
  jwksCache = null
}
