# Sign In / Sign Up — Provider Portal

**Location:** Entry point, unauthenticated (`/` before auth, replaces current `/login` + `/signup`)
**Audience:** Business owner / provider
**Description:** Single unified entry flow for authentication — no separate Sign In vs Sign Up path.
**Figma:** [Sign Up, Sign In flows](https://www.figma.com/design/Yxntd0OUl1SMXtYSu41h3P/Sign-Up--Sign-In?node-id=0-1)

---

## Rationale: one path, not two

Traditional auth UIs ask the user to choose "Sign In" or "Sign Up" before they've entered anything. That choice is a common failure point — users forget whether they already have an account (especially once SSO is in the mix), pick the wrong path, and land on a dead-end error like "an account already exists, please sign in instead."

This flow removes that decision. The user is asked for one thing — their email — and the system determines whether they're new or returning, then branches accordingly:

- **Existing account, password-based** → password field is revealed inline, same screen
- **Existing account, SSO-based** → SSO button handles it, no email step needed
- **New email** → routed to account creation via email verification

This is the current industry-standard pattern ("identifier-first authentication"), used by Slack, Linear, Notion, Stripe, and Vercel.

**Trade-off:** this shifts complexity from the UI (two static forms) to the state machine (one form, several branches). The pattern only pays off if every branch — especially "email not found" — is handled explicitly. See [Open Items](#open-items).

---

## Flow

### 1. Entry screen

Single screen, no route split. Contains:

| Element | Behavior |
|---|---|
| SSO buttons | Google, Microsoft, Apple — each initiates provider OAuth directly, bypassing the rest of the flow |
| Divider | "or continue with email" |
| Email field | Labeled "Work email" |
| Continue button | Disabled (light/inactive) until a valid email is entered; becomes primary (solid) once filled |
| Footer | "Having trouble accessing your account? Contact Us" + Terms/Privacy links |

[Frame: SSO](https://www.figma.com/design/Yxntd0OUl1SMXtYSu41h3P/Sign-Up--Sign-In?node-id=23-600)

### 2. Submit email → branch

On "Continue", the system checks the email server-side and branches into one of three states on the **same screen**:

**a. Account found, password-based**
Password field is revealed below the email field. Button label changes to "Sign In".
[Frame: Password input revealed](https://www.figma.com/design/Yxntd0OUl1SMXtYSu41h3P/Sign-Up--Sign-In?node-id=69-908)

**b. Account not found (new user)**
Inline warning: "We couldn't find an account with that email — Change email or try other sign in method above."
[Frame: Email not found](https://www.figma.com/design/Yxntd0OUl1SMXtYSu41h3P/Sign-Up--Sign-In?node-id=69-1168)

**c. Incorrect password**
Inline error: "Incorrect email or password — Check your email and password, then try again."
[Frame: Error](https://www.figma.com/design/Yxntd0OUl1SMXtYSu41h3P/Sign-Up--Sign-In?node-id=69-1000)

### 3. New account → email verification

For a new email, the flow moves to a verification step to confirm ownership before account creation completes.

[Frame: Verify email (code)](https://www.figma.com/design/Yxntd0OUl1SMXtYSu41h3P/Sign-Up--Sign-In?node-id=31-3147) — 6-digit code entry, "Continue" button, "Didn't receive an email? Resend"
[Frame: Verify email (magic link)](https://www.figma.com/design/Yxntd0OUl1SMXtYSu41h3P/Sign-Up--Sign-In?node-id=25-776) — "Open Gmail" button, no code entry

These two frames currently represent the same step with two different mechanisms — not two intentional variants. See Open Items.

### 4. SSO account creation

If a new user signs up via an SSO provider instead of email, the provider's own consent screen (e.g. Google "Choose an account") handles verification — no separate BeThere verification step.
[Frame: Account creation by choosing SSO](https://www.figma.com/design/Yxntd0OUl1SMXtYSu41h3P/Sign-Up--Sign-In?node-id=23-658)

---

## Alignment audit — spec vs. current Figma

| Principle | Figma status |
|---|---|
| One entry screen, no separate Sign In / Sign Up routes | ✅ Matches — single "Provider Portal" screen for both |
| SSO-first, email as fallback | ✅ Matches — Google/Microsoft/Apple above the email field |
| Progressive disclosure (password only appears after email is known) | ✅ Matches — see "Password input revealed" frame |
| Every branch has a clear next action | ❌ Gap — "email not found" state leaves the CTA labeled "Continue" with no explicit "Create account" affordance |
| One verification mechanism for new-user email confirmation | ❌ Gap — two frames (OTP code vs. magic link / "Open Gmail") share the same headline and copy, implying an unresolved decision |
| Consistent field labeling | ⚠️ Minor — "Work email" vs "Work Email" casing differs across frames |
| Password recovery path reachable from the password step | ⚠️ Unconfirmed — no "Forgot password?" link visible on the "Password input revealed" frame (current live `hotel-portal` login has one) |

---

## Open Items

1. **OTP vs. magic link** — resolve which verification mechanism ships. Recommend OTP code: magic links break when email clients (Gmail, Outlook) pre-fetch/scan links, which can burn a single-use link before the user clicks it — a known failure mode for work-email verification specifically.
2. **"Email not found" next step** — needs an explicit action, e.g. change the CTA to "Create account" once the not-found state is shown, rather than reusing "Continue" with ambiguous behavior.
3. **Forgot password** — confirm whether it was intentionally omitted from the password-reveal frame or just not shown on that particular screenshot; current production login has this link.
4. **Label casing** — normalize "Work email" across all frames.
5. **Gap vs. current implementation** — this is a full rebuild, not a restyle, of `hotel-portal`'s auth. Today: separate `/login` and `/signup` routes, no SSO, and signup collects first/last name + password + confirm-password up front (`SignupForm.tsx`, `GlobalUserLoginForm.tsx`). Adopting this flow means removing the standalone signup route, adding SSO provider integration, and building the branching state machine described above.
