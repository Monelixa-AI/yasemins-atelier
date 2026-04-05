import Iyzipay from "iyzipay"

let _iyzico: Iyzipay | null = null

export function getIyzico(): Iyzipay {
  if (!_iyzico) {
    _iyzico = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY || "placeholder",
      secretKey: process.env.IYZICO_SECRET_KEY || "placeholder",
      uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
    })
  }
  return _iyzico
}

// Backward compat — lazy getter
export const iyzico = new Proxy({} as Iyzipay, {
  get(_target, prop) {
    return (getIyzico() as unknown as Record<string, unknown>)[prop as string]
  },
})
