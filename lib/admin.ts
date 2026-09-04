/**
 * Hard allowlist for /admin access. Deliberately not driven by the
 * mutable `users.is_admin` column - access to the admin portal (every
 * subscriber's PII and onboarding responses) is restricted to these
 * specific accounts, full stop.
 */
const ADMIN_EMAILS = ["marykrisgebe@gmail.com", "admin@drminesha.com"]

export function isAdminEmail(email: string | null | undefined): boolean {
    if (!email) return false
    return ADMIN_EMAILS.includes(email.trim().toLowerCase())
}
