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

On "Continue", the system checks the email server-side and branches into one of three states on the **same screen** — plus a fourth case that leaves this screen entirely.

**a. Account found, password-based**
Password field is revealed below the email field. Button label changes to "Sign In".
[Frame: Password input revealed](https://www.figma.com/design/Yxntd0OUl1SMXtYSu41h3P/Sign-Up--Sign-In?node-id=69-908)

**b. Account found, but social-sign-in-linked (no password set)** ✅ *Resolved in Figma*
The email belongs to a real account, but it was created via Google/Microsoft/Apple — there is no password to check against. No password field is shown; it has nothing to validate. The "Continue" button is also removed in this state — the SSO buttons above are the actual next action, so a button below that does nothing would be dead weight.

- Message: **"This email is linked to a Google account"** (name the actual provider — Google/Microsoft/Apple)
- Body: **"Use the Google sign-in option above."**
- No CTA button in this state

Fallback copy if the provider can't be resolved: **"This email uses social sign-in"** / "Try Google, Microsoft, or Apple above."

Terminology note: use **"social sign-in"**, not "SSO" — these are consumer OAuth buttons (personal Google/Microsoft/Apple accounts), not enterprise SSO (SAML/OIDC federation with a company-managed IdP). If true enterprise SSO is added later, it needs its own distinct terminology so this ambiguity doesn't resurface.

> **Social sign-in** = authenticating with a consumer identity you already have (a personal Google, Apple, or Facebook account) via that provider's OAuth. It's B2C-flavored — "sign in with Google" using your personal Gmail, no company IT involved.
>
> **SSO (Single Sign-On)** = an enterprise pattern where one credential/session, controlled by an organization's identity provider (Okta, Azure AD/Entra ID, Google Workspace as IdP), grants access across multiple internal and third-party apps. It's B2B-flavored — a company admin provisions/deprovisions access centrally, usually via SAML or OIDC federation tied to the company's own domain.

*Requires the "check email" endpoint to return which provider the account is linked to, to show the specific-provider copy rather than the fallback.*

[Frame: Email linked to a Google account (social sign-in)](https://www.figma.com/design/Yxntd0OUl1SMXtYSu41h3P/Sign-Up--Sign-In?node-id=69-1168)

**c. Account not found (never signed up)** ✅ *Resolved — no intermediate screen*
Genuinely new email, no account exists. There is no same-screen state and no confirm/CTA step for this case — "Continue" routes straight into email verification ([step 3](#3-new-account--email-verification)), which sends the OTP immediately. This keeps signup passwordless up to that point, consistent with the OTP decision above.

The earlier "Email not found" frame (old generic copy, disabled "Continue" button) has been removed from the file — it no longer represents part of the flow.

**d. Incorrect password**
Inline error: "Incorrect email or password — Check your email and password, then try again."
[Frame: Error](https://www.figma.com/design/Yxntd0OUl1SMXtYSu41h3P/Sign-Up--Sign-In?node-id=69-1000)

### 3. New account → email verification

For a new email, "Continue" routes straight here — no intermediate confirm screen. The OTP is sent immediately, and this step confirms ownership before account creation completes. Password is intentionally not collected until *after* verification succeeds (see [4. Set password](#4-set-password)) — no account credential is validated against an unverified email.

- **3A** [Check your inbox — empty state](https://www.figma.com/design/Yxntd0OUl1SMXtYSu41h3P/Sign-Up--Sign-In?node-id=217-1543) — 6-digit code entry split 3+3, "Verify" button disabled until filled, "Resend code" link
- **3B** [Check your inbox — filled state](https://www.figma.com/design/Yxntd0OUl1SMXtYSu41h3P/Sign-Up--Sign-In?node-id=218-1742) — same screen, code entered, "Verify" button active

This resolves the [OTP vs. magic link](#otp-vs-magic-link) decision: the design now implements OTP only. The old magic-link frame ([25:776](https://www.figma.com/design/Yxntd0OUl1SMXtYSu41h3P/Sign-Up--Sign-In?node-id=25-776), "Open Gmail" button) is legacy and should be archived/removed from the file.

### 4. Set password

Shown only after OTP verification succeeds — this is what completes account creation, not a step before it.

**3C** [Set your password](https://www.figma.com/design/Yxntd0OUl1SMXtYSu41h3P/Sign-Up--Sign-In?node-id=218-1816) — "Create a secure password to finish setting up your account", Password + Confirm password fields, CTA **"Set password & Sign In"**.

Verification success functions as the login — there's no separate login screen for a brand-new account. "Set password & Sign In" both completes signup and starts the session in one action.

### 5. SSO account creation

If a new user signs up via an SSO provider instead of email, the provider's own consent screen (e.g. Google "Choose an account") handles verification — no separate BeThere verification step.
[Frame: Account creation by choosing SSO](https://www.figma.com/design/Yxntd0OUl1SMXtYSu41h3P/Sign-Up--Sign-In?node-id=23-658)

---

## Alignment audit — spec vs. current Figma

| Principle | Figma status |
|---|---|
| One entry screen, no separate Sign In / Sign Up routes | ✅ Matches — single "Provider Portal" screen for both |
| SSO-first, email as fallback | ✅ Matches — Google/Microsoft/Apple above the email field |
| Progressive disclosure (password only appears after email is known) | ✅ Matches — password now appears even later than before: only *after* OTP verification (`3C`), not during sign-in-vs-signup branching |
| Every branch has a clear next action | ✅ Matches — `1A` (password), `2A` (social-sign-in-linked), and new-email now route straight into `3A`/`3B` verification with no dead-end intermediate screen |
| One verification mechanism for new-user email confirmation | ✅ Resolved — OTP only (`3A`/`3B`); the magic-link frame (`25:776`) is legacy and should be removed from the file |
| Consistent field labeling | ✅ Resolved — "Work email" now consistent across entry, `1A`, `2A`, and the error state |
| Password recovery path reachable from the password step | ⚠️ Unconfirmed — no "Forgot password?" link visible on the "Password input revealed" frame (current live `hotel-portal` login has one) |

---

## OTP vs. magic link

We need to decide which verification method we are shipping: a one-time passcode or a magic link.

**The recommendation is to use an OTP code.**

Magic links can fail in work-email environments because tools like Gmail, Outlook, antivirus systems, and corporate security scanners may automatically open or scan links before the user clicks them. If the magic link is single-use, that scan can accidentally use up the link. When the user later clicks it, the link may already be expired or invalid.

This creates a confusing experience: the user did nothing wrong, but verification fails.

An OTP code is more reliable because the email client can scan the message without "using" the code. The user simply copies or enters the code manually, which avoids the risk of a security system burning the verification step before the user gets there.

---

## Open Items

1. ✅ **OTP vs. magic link** — resolved, OTP code shipped (`3A`/`3B`). Magic-link frame (`25:776`) is legacy — remove from the file.
2. ✅ **"Email not found" next step** — resolved. The old intermediate confirm screen (`212:1878`) has been removed; a new email now routes straight from the entry screen into OTP verification (`3A`), no confirm/CTA step in between. Social-sign-in-linked case (`69-1168`) remains as previously finalized — "This email is linked to a Google account" / "Use the Google sign-in option above." Still requires the email-check API to return the linked provider, if any, so that copy can name it specifically rather than falling back to "This email uses social sign-in."
3. ⚠️ **Forgot password** — confirm whether it was intentionally omitted from the password-reveal frame or just not shown on that particular screenshot; current production login has this link.
4. ✅ **Label casing** — resolved. "Work email" is now consistent (sentence case) across entry, `1A`, `2A`, and the error state.
5. ⚠️ **Gap vs. current implementation** — this is a full rebuild, not a restyle, of `hotel-portal`'s auth. Today: separate `/login` and `/signup` routes, no SSO, and signup collects first/last name + password + confirm-password up front (`SignupForm.tsx`, `GlobalUserLoginForm.tsx`). Adopting this flow means removing the standalone signup route, adding SSO provider integration, and building the branching state machine described above — including moving password collection to *after* OTP verification (`3C`) instead of up front.
