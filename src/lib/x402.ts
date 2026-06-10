/**
 * x402 Micropayments Integration
 *
 * x402 is Casper's HTTP-native payment protocol that lets agents pay per API
 * request with cryptographic proof. This module builds and verifies the
 * `x402-payment` header used by the analysis endpoint.
 *
 * Two modes:
 * - Facilitator mode (set X402_FACILITATOR_URL): payments are verified and
 *   settled through the Casper x402 Facilitator (https://casper.network/ai)
 *   via its standard /verify and /settle endpoints, producing a real on-chain
 *   micropayment.
 * - Demo mode (no facilitator configured): the payment intent header is
 *   structurally verified only, clearly reported as 'verified' not 'settled'.
 */

export interface X402Payment {
  amount: string
  token: string
  recipient: string
  purpose: string
}

/** Cost of one portfolio analysis, in CSPR. */
export const ANALYSIS_COST_CSPR = '0.01'

/**
 * Recipient address for analysis payments. Configure via
 * NEXT_PUBLIC_X402_RECIPIENT; falls back to a placeholder for demo flows.
 */
export const ANALYSIS_RECIPIENT =
  process.env.NEXT_PUBLIC_X402_RECIPIENT ||
  '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'

/** Construct an x402 payment intent for portfolio analysis. */
export const createX402Payment = async (
  amount: string,
  recipient: string,
  purpose: string
): Promise<X402Payment> => ({
  amount,
  token: 'CSPR',
  recipient,
  purpose,
})

/**
 * Build the `x402-payment` HTTP header value (base64-encoded payment intent).
 */
export const buildX402Header = (payment: X402Payment): string => {
  return `x402-payment: ${buildX402HeaderValue(payment)}`
}

/** Base64-encoded payment intent, suitable as a raw HTTP header value. */
export const buildX402HeaderValue = (payment: X402Payment): string => {
  const json = JSON.stringify(payment)
  return typeof window === 'undefined'
    ? Buffer.from(json, 'utf-8').toString('base64')
    : btoa(json)
}

export type X402SettlementStatus = 'settled' | 'verified' | 'failed' | 'none'

/**
 * Verify and settle an x402 payment through the configured facilitator
 * (server-side only). Follows the standard x402 facilitator interface:
 * POST /verify then POST /settle with the payment payload and requirements.
 *
 * Returns:
 * - 'settled'  - facilitator confirmed and settled the payment on-chain
 * - 'verified' - no facilitator configured; header is structurally valid
 * - 'failed'   - facilitator rejected the payment
 * - 'none'     - no/invalid payment header
 */
export const settleX402Payment = async (
  headerValue: string | null
): Promise<X402SettlementStatus> => {
  if (!headerValue) return 'none'

  const raw = headerValue.replace(/^x402-payment:\s*/, '')
  let payment: X402Payment
  try {
    payment = JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'))
  } catch {
    return 'none'
  }

  const structurallyValid = Boolean(
    payment.amount &&
      payment.recipient &&
      payment.token === 'CSPR' &&
      parseFloat(payment.amount) > 0
  )
  if (!structurallyValid) return 'none'

  const facilitatorBase = process.env.X402_FACILITATOR_URL?.replace(/\/$/, '')
  if (!facilitatorBase) return 'verified'

  const paymentRequirements = {
    scheme: 'exact',
    network: process.env.NEXT_PUBLIC_CASPER_NETWORK === 'mainnet' ? 'casper' : 'casper-test',
    asset: 'CSPR',
    payTo: payment.recipient,
    maxAmountRequired: payment.amount,
    description: payment.purpose,
  }
  const body = JSON.stringify({
    x402Version: 1,
    paymentPayload: payment,
    paymentRequirements,
  })
  const headers = { 'Content-Type': 'application/json' }

  try {
    const verifyRes = await fetch(`${facilitatorBase}/verify`, {
      method: 'POST',
      headers,
      body,
    })
    if (!verifyRes.ok) return 'failed'
    const verifyData = await verifyRes.json()
    if (verifyData?.isValid === false) return 'failed'

    const settleRes = await fetch(`${facilitatorBase}/settle`, {
      method: 'POST',
      headers,
      body,
    })
    if (!settleRes.ok) return 'failed'
    const settleData = await settleRes.json()
    return settleData?.success === false ? 'failed' : 'settled'
  } catch {
    return 'failed'
  }
}

/** Verify the structure of an x402 payment header. */
export const verifyX402Payment = async (header: string): Promise<boolean> => {
  try {
    const raw = header.replace(/^x402-payment:\s*/, '')
    const json =
      typeof window === 'undefined'
        ? Buffer.from(raw, 'base64').toString('utf-8')
        : atob(raw)
    const payment: X402Payment = JSON.parse(json)
    return Boolean(
      payment.amount &&
        payment.recipient &&
        payment.token === 'CSPR' &&
        parseFloat(payment.amount) > 0
    )
  } catch {
    return false
  }
}
