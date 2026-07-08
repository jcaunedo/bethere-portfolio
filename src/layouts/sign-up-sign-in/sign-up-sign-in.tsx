import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialLoginOptions } from "@/components/ui/social-login-options";
import { Typography } from "@/components/typography";
import heroImage from "./images/hero.png";
import logo from "./images/logo.png";

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
              <img src={logo} alt="BeThere" className="h-16 w-auto" />
            </div>

            <div className="flex w-full flex-col gap-1.5">
              <Typography as="h1" size="3xl" weight="medium">
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

export { SignUpSignIn };
