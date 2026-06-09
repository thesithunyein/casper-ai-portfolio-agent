/**
 * x402 Micropayments Integration
 *
 * x402 is Casper's HTTP-native payment protocol that lets agents pay per API
 * request with cryptographic proof. This module builds and verifies the
 * `x402-payment` header used by the analysis endpoint.
 *
 * NOTE: This is a demo-grade implementation that encodes a signed-style payment
 * intent. Settling real payments uses the Casper x402 Facilitator
 * (https://www.casper.network/ai). Wiring the live facilitator is a roadmap
 * item and requires a funded agent wallet.
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
  const json = JSON.stringify(payment)
  const encoded =
    typeof window === 'undefined'
      ? Buffer.from(json, 'utf-8').toString('base64')
      : btoa(json)
  return `x402-payment: ${encoded}`
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
