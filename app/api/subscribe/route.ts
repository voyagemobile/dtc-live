import { NextRequest, NextResponse } from 'next/server'
import { addMember } from '@/lib/ghost'

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
 * as a Ghost member (newsletter subscriber) via the Ghost Admin API.
 *
 * Returns:
 *   200 { success: true }                    — already subscribed
 *   201 { success: true }                    — newly subscribed
 *   400 { success: false, error: string }    — missing or invalid email
 *   503 { success: false, error: string }    — env vars not configured
 *   500 { success: false, error: string }    — upstream failure
 */
export async function POST(request: NextRequest) {
  // Guard: env vars must be present
  if (!process.env.GHOST_API_URL || !process.env.GHOST_ADMIN_API_KEY) {
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
    const result = await addMember(rawEmail)
    return NextResponse.json({ success: true }, { status: result.status })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Subscription failed. Please try again.' },
      { status: 500 }
    )
  }
}
