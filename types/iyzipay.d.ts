declare module "iyzipay" {
  interface IyzipayConfig {
    apiKey: string
    secretKey: string
    uri: string
  }

  interface IyzipayResult {
    status: string
    errorCode?: string
    errorMessage?: string
    locale?: string
    systemTime?: number
    conversationId?: string
    [key: string]: unknown
  }

  interface PaymentResult extends IyzipayResult {
    paymentId?: string
    price?: string
    paidPrice?: string
    installment?: number
    token?: string
    checkoutFormContent?: string
    paymentTransactionId?: string
    cardAssociation?: string
    lastFourDigits?: string
    itemTransactions?: Array<{ paymentTransactionId: string; [key: string]: unknown }>
  }

  interface InstallmentResult extends IyzipayResult {
    installmentDetails?: Array<{
      binNumber: string
      price: string
      cardAssociation: string
      cardFamilyName: string
      installmentPrices: Array<{
        installmentNumber: number
        totalPrice: string
        installmentPrice: string
      }>
    }>
  }

  interface RefundResult extends IyzipayResult {
    paymentId?: string
    paymentTransactionId?: string
    price?: string
  }

  class Iyzipay {
    constructor(config: IyzipayConfig)

    payment: {
      create(request: Record<string, unknown>, callback: (err: Error | null, result: PaymentResult) => void): void
      retrieve(request: Record<string, unknown>, callback: (err: Error | null, result: PaymentResult) => void): void
    }

    checkoutFormInitialize: {
      create(request: Record<string, unknown>, callback: (err: Error | null, result: PaymentResult) => void): void
    }

    checkoutForm: {
      retrieve(request: Record<string, unknown>, callback: (err: Error | null, result: PaymentResult) => void): void
    }

    installmentInfo: {
      retrieve(request: Record<string, unknown>, callback: (err: Error | null, result: InstallmentResult) => void): void
    }

    refund: {
      create(request: Record<string, unknown>, callback: (err: Error | null, result: RefundResult) => void): void
    }

    static LOCALE: { TR: string; EN: string }
    static CURRENCY: { TRY: string; EUR: string; USD: string }
    static PAYMENT_CHANNEL: { WEB: string; MOBILE: string; MOBILE_WEB: string }
    static PAYMENT_GROUP: { PRODUCT: string; LISTING: string; SUBSCRIPTION: string }
    static BASKET_ITEM_TYPE: { PHYSICAL: string; VIRTUAL: string }
  }

  export = Iyzipay
}
