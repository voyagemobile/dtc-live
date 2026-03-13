import { NextRequest, NextResponse } from 'next/server'

const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY
const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID

// RFC 5321 maximum email length
const MAX_EMAIL_LENGTH = 254

/**
 * Basic email format validation.
 * Checks for a single @ with non-empty local and domain parts,
 * and a domain with at least one dot.
 */
function isValidEmail(email: string): boolean {
  const atIndex = email.indexOf('@')
  if (atIndex < 1) return false
  const local = email.slice(0, atIndex)
  const domain = email.slice(atIndex + 1)
  if (!local || !domain) return false
  if (!domain.includes('.')) return false
  // Domain must not start or end with a dot
  if (domain.startsWith('.') || domain.endsWith('.')) return false
  return true
}

/**
 * POST /api/subscribe
 *
 * Accepts { email: string } in the request body and subscribes the address
 * to the Beehiiv publication configured via environment variables.
 *
 * Returns:
 *   200 { success: true }                    — already subscribed (Beehiiv 200)
 *   201 { success: true }                    — newly subscribed (Beehiiv 201)
 *   400 { success: false, error: string }    — missing or invalid email
 *   503 { success: false, error: string }    — env vars not configured
 *   500 { success: false, error: string }    — upstream failure
 */
export async function POST(request: NextRequest) {
  // Guard: env vars must be present before we attempt any parsing
  if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID) {
    return NextResponse.json(
      { success: false, error: 'Newsletter not configured' },
      { status: 503 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }

  // Type-narrow the parsed body
  if (
    typeof body !== 'object' ||
    body === null ||
    typeof (body as Record<string, unknown>).email !== 'string'
  ) {
    return NextResponse.json(
      { success: false, error: 'Missing required field: email' },
      { status: 400 }
    )
  }

  // Rate-limit defense: cap email length at RFC 5321 maximum
  const rawEmail = ((body as Record<string, unknown>).email as string).trim()
  if (rawEmail.length > MAX_EMAIL_LENGTH) {
    return NextResponse.json(
      { success: false, error: 'Invalid email address' },
      { status: 400 }
    )
  }

  if (!rawEmail) {
    return NextResponse.json(
      { success: false, error: 'Email address is required' },
      { status: 400 }
    )
  }

  if (!isValidEmail(rawEmail)) {
    return NextResponse.json(
      { success: false, error: 'Invalid email address' },
      { status: 400 }
    )
  }

  try {
    const beehiivUrl = `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`

    const res = await fetch(beehiivUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${BEEHIIV_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: rawEmail,
        reactivate_existing: true,
        send_welcome_email: true,
      }),
      // Do not cache subscription requests
      cache: 'no-store',
    })

    if (res.status === 200 || res.status === 201) {
      return NextResponse.json({ success: true }, { status: res.status })
    }

    // Beehiiv returned a non-success status
    // Avoid leaking upstream error details to the client
    return NextResponse.json(
      { success: false, error: 'Subscription failed. Please try again.' },
      { status: 500 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: 'Subscription failed. Please try again.' },
      { status: 500 }
    )
  }
}
