import { describe, it, expect, beforeEach, vi } from "vitest"
import {
  getOidcConfig,
  _resetDiscoveryCacheForTests,
} from "./discovery"

const ISSUER = "https://proconnect.test.gouv.fr"
const DISCOVERY = {
  issuer: ISSUER,
  jwks_uri: `${ISSUER}/jwks`,
  userinfo_endpoint: `${ISSUER}/oauth/userinfo`,
}

function mockDiscoveryResponse(status = 200) {
  return vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(new Response(JSON.stringify(DISCOVERY), { status }))
}

describe("discovery OIDC ProConnect", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    _resetDiscoveryCacheForTests()
    process.env.PROCONNECT_ISSUER = ISSUER
  })

  it("met en cache le discovery document (un seul fetch sur deux appels)", async () => {
    const fetchMock = mockDiscoveryResponse()

    const first = await getOidcConfig()
    const second = await getOidcConfig()

    expect(first.issuer).toBe(ISSUER)
    expect(second).toEqual(first)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it("lève une erreur explicite si le discovery échoue", async () => {
    mockDiscoveryResponse(500)
    await expect(getOidcConfig()).rejects.toThrow(/échec/i)
  })

  it("lève une erreur si PROCONNECT_ISSUER est absent", async () => {
    delete process.env.PROCONNECT_ISSUER
    // Recharger le module pour re-lire env
    vi.resetModules()
    const { getOidcConfig: freshGetOidcConfig } = await import("./discovery")
    await expect(freshGetOidcConfig()).rejects.toThrow(/PROCONNECT_ISSUER/)
  })
})
