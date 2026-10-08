import * as React from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

import { Alert, AlertTitle, AlertDescription } from "@/components/feedback/alert";
import { Button } from "@/components/buttons/button";
import { Input } from "@/components/forms/input";
import { OtpInput } from "@/components/forms/otp-input";
import { SocialLoginOptions } from "@/components/buttons/social-login-options";
import { Typography } from "@/components/typography";
import { Logo } from "@/components/data-display/logo";
import hero01 from "./images/hero-01.webp";
import hero02 from "./images/hero-02.webp";
import hero03 from "./images/hero-03.webp";
import hero04 from "./images/hero-04.webp";

const heroImages = [hero01, hero02, hero03, hero04];
// Picked once per module load (i.e. once per page load), not per screen
// render, so every screen in this file shows the same hero for the session.
const heroImage = heroImages[Math.floor(Math.random() * heroImages.length)];

/**
 * Provider Portal sign-in screen. Figma origin: Sign-Up/Sign-In → "Social Login" frame.
 * Hero image column + logo/social/email form column.
 */
function SignUpSignIn() {
  const [email, setEmail] = React.useState("");

  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 bg-background p-6 md:grid-cols-[0.75fr_1fr]">
      <div className="relative hidden overflow-hidden rounded-2xl md:block">
        <img src={heroImage} alt="" className="absolute inset-0 size-full object-cover" />
      </div>

      <div className="flex min-w-0 flex-col items-center justify-center md:px-6">
        <div className="flex w-full min-w-0 max-w-[500px] flex-1 flex-col items-center justify-between">
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-6">
            <div className="flex items-center justify-center py-6.5">
              <Logo className="h-10 w-auto" />
            </div>

            <div className="flex w-full flex-col gap-1.5">
              <Typography as="h1" size="2xl" weight="medium">
                Provider Portal
              </Typography>
              <Typography size="base" className="text-muted-foreground">
                Sign in or join to manage your listings, bookings, and businesses.
              </Typography>
            </div>

            <SocialLoginOptions />

            <Typography size="sm" className="text-muted-foreground">
              or continue with email
            </Typography>

            <form
              className="flex w-full flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex w-full flex-col gap-2">
                <label htmlFor="email">
                  <Typography size="sm" weight="medium">
                    Work email
                  </Typography>
                </label>
                <Input
                  id="email"
                  type="email"
                  size="xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                />
              </div>
              <Button type="submit" size="xl" className="w-full" disabled={email === ""}>
                Continue
              </Button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-2 py-4 text-center">
              <Typography size="sm">Having trouble accessing your account?</Typography>
              <a href="#" className="text-sm text-primary hover:underline">
                Contact Us
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <Typography size="xs" className="text-muted-foreground">
              By continuing, you have read and agree to BeThere Group
            </Typography>
            <Typography size="xs">
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>
              <span className="text-muted-foreground"> · </span>
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Provider Portal password sign-in screen. Figma origin: Sign-Up/Sign-In →
 * "1A - Email found, password-based" frame. Same hero-image + form-column
 * shell as SignUpSignIn, with the single email step swapped for an
 * email + password form (password field has a show/hide toggle).
 */
function SignUpSignInPassword() {
  const [email, setEmail] = React.useState("lucysmith@gmail.com");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 bg-background p-6 md:grid-cols-[0.75fr_1fr]">
      <div className="relative hidden overflow-hidden rounded-2xl md:block">
        <img src={heroImage} alt="" className="absolute inset-0 size-full object-cover" />
      </div>

      <div className="flex min-w-0 flex-col items-center justify-center md:px-6">
        <div className="flex w-full min-w-0 max-w-[500px] flex-1 flex-col items-center justify-between">
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-6">
            <div className="flex items-center justify-center py-6.5">
              <Logo className="h-10 w-auto" />
            </div>

            <div className="flex w-full flex-col gap-1.5">
              <Typography as="h1" size="2xl" weight="medium">
                Provider Portal
              </Typography>
              <Typography size="base" className="text-muted-foreground">
                Sign in or join to manage your listings, bookings, and businesses.
              </Typography>
            </div>

            <SocialLoginOptions />

            <Typography size="sm" className="text-foreground-subtle">
              or continue with email
            </Typography>

            <form
              className="flex w-full flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex w-full flex-col gap-2">
                <label htmlFor="password-email">
                  <Typography size="sm" weight="medium">
                    Work email
                  </Typography>
                </label>
                <Input
                  id="password-email"
                  type="email"
                  size="xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex w-full flex-col gap-2">
                <div className="flex w-full items-center justify-between">
                  <label htmlFor="password">
                    <Typography size="sm" weight="medium">
                      Password
                    </Typography>
                  </label>
                  <a href="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    size="xl"
                    className="pr-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-[18px]" />
                    ) : (
                      <Eye className="size-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" size="xl" className="w-full" disabled={password === ""}>
                Sign In
              </Button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-2 py-4 text-center">
              <Typography size="sm">Having trouble accessing your account?</Typography>
              <a href="#" className="text-sm text-primary hover:underline">
                Contact Us
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <Typography size="xs" className="text-muted-foreground">
              By continuing, you have read and agree to BeThere Group
            </Typography>
            <Typography size="xs">
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>
              <span className="text-muted-foreground"> · </span>
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Provider Portal password sign-in screen, invalid-credentials state. Figma
 * origin: Sign-Up/Sign-In → "1A - Credentials Validation Error State" frame.
 * Same email + password form as SignUpSignInPassword, with an inline
 * destructive Alert banner between the password field and the submit
 * button once the credentials fail to validate.
 */
function SignUpSignInPasswordError() {
  const [email, setEmail] = React.useState("lucysmith@gmail.com");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 bg-background p-6 md:grid-cols-[0.75fr_1fr]">
      <div className="relative hidden overflow-hidden rounded-2xl md:block">
        <img src={heroImage} alt="" className="absolute inset-0 size-full object-cover" />
      </div>

      <div className="flex min-w-0 flex-col items-center justify-center md:px-6">
        <div className="flex w-full min-w-0 max-w-[500px] flex-1 flex-col items-center justify-between">
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-6">
            <div className="flex items-center justify-center py-6.5">
              <Logo className="h-10 w-auto" />
            </div>

            <div className="flex w-full flex-col gap-1.5">
              <Typography as="h1" size="2xl" weight="medium">
                Provider Portal
              </Typography>
              <Typography size="base" className="text-muted-foreground">
                Sign in or join to manage your listings, bookings, and businesses.
              </Typography>
            </div>

            <SocialLoginOptions />

            <Typography size="sm" className="text-foreground-subtle">
              or continue with email
            </Typography>

            <form
              className="flex w-full flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex w-full flex-col gap-2">
                <label htmlFor="password-error-email">
                  <Typography size="sm" weight="medium">
                    Work email
                  </Typography>
                </label>
                <Input
                  id="password-error-email"
                  type="email"
                  size="xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex w-full flex-col gap-2">
                <div className="flex w-full items-center justify-between">
                  <label htmlFor="password-error">
                    <Typography size="sm" weight="medium">
                      Password
                    </Typography>
                  </label>
                  <a href="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password-error"
                    type={showPassword ? "text" : "password"}
                    size="xl"
                    className="pr-9"
                    aria-invalid
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-[18px]" />
                    ) : (
                      <Eye className="size-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              <Alert variant="destructive">
                <AlertTitle>Incorrect email or password</AlertTitle>
                <AlertDescription>
                  Check your email and password, then try again.
                </AlertDescription>
              </Alert>

              <Button type="submit" size="xl" className="w-full" disabled={password === ""}>
                Sign In
              </Button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-2 py-4 text-center">
              <Typography size="sm">Having trouble accessing your account?</Typography>
              <a href="#" className="text-sm text-primary hover:underline">
                Contact Us
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <Typography size="xs" className="text-muted-foreground">
              By continuing, you have read and agree to BeThere Group
            </Typography>
            <Typography size="xs">
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>
              <span className="text-muted-foreground"> · </span>
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Provider Portal profile-completion screen. Figma origin: Sign-Up/Sign-In →
 * "3E - Complete your profile" frame. Same hero-image + form-column shell,
 * with the form reduced to Full Name + Password + Confirm password (each
 * password field has its own show/hide toggle) and no social-login or
 * "having trouble" sections.
 */
function SignUpSignInCompleteProfile() {
  const [fullName, setFullName] = React.useState("Lucy Smith");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 bg-background p-6 md:grid-cols-[0.75fr_1fr]">
      <div className="relative hidden overflow-hidden rounded-2xl md:block">
        <img src={heroImage} alt="" className="absolute inset-0 size-full object-cover" />
      </div>

      <div className="flex min-w-0 flex-col items-center justify-center md:px-6">
        <div className="flex w-full min-w-0 max-w-[500px] flex-1 flex-col items-center justify-between">
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-6">
            <div className="flex items-center justify-center py-6.5">
              <Logo className="h-10 w-auto" />
            </div>

            <div className="flex w-full flex-col gap-1.5">
              <Typography as="h1" size="2xl" weight="medium">
                Complete your profile
              </Typography>
              <Typography size="base" className="text-muted-foreground">
                Set your name and password to finish setting up your account.
              </Typography>
            </div>

            <form
              className="flex w-full flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex w-full flex-col gap-2">
                <label htmlFor="full-name">
                  <Typography size="sm" weight="medium">
                    Full Name
                  </Typography>
                </label>
                <Input
                  id="full-name"
                  type="text"
                  size="xl"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="flex w-full flex-col gap-2">
                <label htmlFor="profile-password">
                  <Typography size="sm" weight="medium">
                    Password
                  </Typography>
                </label>
                <div className="relative">
                  <Input
                    id="profile-password"
                    type={showPassword ? "text" : "password"}
                    size="xl"
                    className="pr-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-[18px]" />
                    ) : (
                      <Eye className="size-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex w-full flex-col gap-2">
                <label htmlFor="confirm-password">
                  <Typography size="sm" weight="medium">
                    Confirm password
                  </Typography>
                </label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    size="xl"
                    className="pr-9"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    aria-pressed={showConfirmPassword}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-[18px]" />
                    ) : (
                      <Eye className="size-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                size="xl"
                className="w-full"
                disabled={password === "" || confirmPassword === ""}
              >
                Set password &amp; Sign in
              </Button>
            </form>
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <Typography size="xs" className="text-muted-foreground">
              By continuing, you have read and agree to BeThere Group
            </Typography>
            <Typography size="xs">
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>
              <span className="text-muted-foreground"> · </span>
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Provider Portal OTP-verification screen. Figma origin: Sign-Up/Sign-In →
 * "3B - Email not found (new email) - OTP Sent" frame. Same hero-image +
 * form-column shell as SignUpSignIn, with the email form swapped for the
 * 6-digit code entry step.
 */
function SignUpSignInOtp() {
  const [code, setCode] = React.useState("");

  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 bg-background p-6 md:grid-cols-[0.75fr_1fr]">
      <div className="relative hidden overflow-hidden rounded-2xl md:block">
        <img src={heroImage} alt="" className="absolute inset-0 size-full object-cover" />
      </div>

      <div className="flex min-w-0 flex-col items-center justify-center md:px-6">
        <div className="flex w-full min-w-0 max-w-[500px] flex-1 flex-col items-center justify-between">
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-6">
            <div className="flex items-center justify-center py-6.5">
              <Logo className="h-10 w-auto" />
            </div>

            <div className="flex w-full flex-col gap-1.5">
              <Typography as="h1" size="2xl" weight="medium">
                Check your email
              </Typography>
              <Typography size="base" className="text-muted-foreground">
                We sent a 6-digit verification code to luc*******@email.com.
                <br />
                Open the email from Bethere, then enter the code below.
                <br />
                The code will expire in 15 minutes.
              </Typography>
            </div>

            <form
              className="flex w-full flex-col items-center gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex w-full flex-col items-center gap-2">
                <Typography size="sm" weight="medium" className="w-[368px]">
                  Verification code
                </Typography>
                <OtpInput
                  size="6xl"
                  maxLength={6}
                  value={code}
                  onChange={setCode}
                />
              </div>
              <Button type="button" variant="link" size="lg" className="font-normal">
                Change email address
              </Button>
            </form>
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <Typography size="xs" className="text-muted-foreground">
              By continuing, you have read and agree to BeThere Group
            </Typography>
            <Typography size="xs">
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>
              <span className="text-muted-foreground"> · </span>
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Provider Portal OTP-invalid-code screen. Figma origin: Sign-Up/Sign-In →
 * "OTP doesn't match invalid state" frame. Same hero-image + form-column
 * shell as SignUpSignInOtp, with the OTP field in its invalid state and an
 * Alert banner below it; the resend/change-email link reverts to "Resend
 * code" copy in this state.
 */
function SignUpSignInOtpInvalid() {
  const [code, setCode] = React.useState("524872");

  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 bg-background p-6 md:grid-cols-[0.75fr_1fr]">
      <div className="relative hidden overflow-hidden rounded-2xl md:block">
        <img src={heroImage} alt="" className="absolute inset-0 size-full object-cover" />
      </div>

      <div className="flex min-w-0 flex-col items-center justify-center md:px-6">
        <div className="flex w-full min-w-0 max-w-[500px] flex-1 flex-col items-center justify-between">
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-6">
            <div className="flex items-center justify-center py-6.5">
              <Logo className="h-10 w-auto" />
            </div>

            <div className="flex w-full flex-col gap-1.5">
              <Typography as="h1" size="2xl" weight="medium">
                Check your email
              </Typography>
              <Typography size="base" className="text-muted-foreground">
                We sent a 6-digit verification code to luc*******@email.com.
                <br />
                Open the email from Bethere, then enter the code below.
                <br />
                The code will expire in 15 minutes.
              </Typography>
            </div>

            <form
              className="flex w-full flex-col items-center gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex w-full flex-col items-center gap-2">
                <Typography size="sm" weight="medium" className="w-[368px]">
                  Verification code
                </Typography>
                <OtpInput
                  size="6xl"
                  maxLength={6}
                  value={code}
                  onChange={setCode}
                  aria-invalid
                />
              </div>

              <Alert variant="destructive">
                <AlertTitle>Invalid code</AlertTitle>
                <AlertDescription>
                  Enter the latest 6-digit code sent to your email.
                </AlertDescription>
              </Alert>

              <Button type="button" variant="link" size="lg" className="font-normal">
                Resend code
              </Button>
            </form>
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <Typography size="xs" className="text-muted-foreground">
              By continuing, you have read and agree to BeThere Group
            </Typography>
            <Typography size="xs">
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>
              <span className="text-muted-foreground"> · </span>
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Provider Portal account-setup loading screen. Figma origin: Sign-Up/Sign-In →
 * "3D - Creating account - Getting setup... loading state" frame. No hero
 * column — full-width, single-column shell with a 3-segment progress bar
 * pinned to the top, logo + spinner centered, and a copyright footer pinned
 * to the bottom (distinct from the Terms/Privacy footer on other screens).
 */
function SignUpSignInLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-background p-2">
      <div className="flex w-full items-start gap-2">
        <div className="h-1 flex-1 rounded-2xl bg-muted" />
        <div className="h-1 flex-1 rounded-2xl bg-muted" />
        <div className="h-1 flex-1 rounded-2xl bg-muted" />
      </div>

      <div className="flex flex-col items-center gap-11 pb-24">
        <Logo className="h-10 w-auto" />
        <div className="flex flex-col items-center gap-2">
          <LoaderCircle className="size-6 animate-spin text-primary" />
          <Typography size="base" className="text-muted-foreground">
            Getting setup...
          </Typography>
        </div>
      </div>

      <div className="flex flex-col items-center py-4">
        <Typography size="xs" className="text-muted-foreground">
          © 2026 Bethere Corp. All Rights Reserved
        </Typography>
      </div>
    </div>
  );
}

export {
  SignUpSignIn,
  SignUpSignInPassword,
  SignUpSignInPasswordError,
  SignUpSignInCompleteProfile,
  SignUpSignInOtp,
  SignUpSignInOtpInvalid,
  SignUpSignInLoading,
};
