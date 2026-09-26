import * as React from "react";
import { Formik, Form } from "formik";

import { Button } from "@/components/buttons/button";
import { FormikInput } from "@/components/forms/input";
import { Typography } from "@/components/typography";
import { StepperOnboarding } from "@/components/stepper/stepper-onboarding";
import { Logo } from "@/components/data-display/logo";

type BusinessVerificationValues = {
  legalBusinessName: string;
  businessAddress: string;
  einTaxId: string;
  ownerName: string;
  phoneNumber: string;
};

function validate(values: BusinessVerificationValues) {
  const errors: Partial<Record<keyof BusinessVerificationValues, string>> = {};
  if (!values.legalBusinessName.trim()) {
    errors.legalBusinessName = "This is required";
  }
  if (!values.businessAddress.trim()) {
    errors.businessAddress = "This is required";
  }
  if (!values.ownerName.trim()) {
    errors.ownerName = "This is required";
  }
  if (!values.phoneNumber.trim()) {
    errors.phoneNumber = "This is required";
  }
  return errors;
}

/**
 * Business onboarding — "Business verification" step. Figma origin:
 * Sign-Up/Sign-In → "Business verification" frame. Step 2 of 3 in the onboarding stepper.
 * EIN/Tax ID is optional (Figma shows it placeholder-only, no required marker); every
 * other field is required.
 */
function BusinessVerification() {
  const initialValues: BusinessVerificationValues = {
    legalBusinessName: "",
    businessAddress: "",
    einTaxId: "",
    ownerName: "",
    phoneNumber: "",
  };

  return (
    <div className="flex h-screen items-center overflow-clip bg-background p-2">
      <div className="flex h-full w-full flex-1 flex-col items-center justify-between">
        <StepperOnboarding
          steps={3}
          currentStep={2}
          onStepClick={(step) => {
            // Prototype-only cross-layout navigation: jump to the other step's
            // Storybook story so the flow can be clicked through end to end.
            // The story renders inside Storybook's preview iframe, so the manager
            // window (window.top) — not this frame's own location — is what
            // understands the "?path=/story/..." route. The path must be built as
            // an absolute URL off window.top's own origin: a bare "?path=..."
            // resolves relative to whatever sub-path the manager happens to be on
            // and can bounce to the wrong route.
            if (step === 1) {
              const top = window.top && window.top !== window ? window.top : window;
              top.location.href = `${top.location.origin}/?path=/story/layouts-businessprofile--default`;
            }
          }}
        />

        <div className="flex w-full max-w-[464px] flex-1 flex-col items-center justify-center gap-6">
          <div className="flex items-center justify-center py-6.5">
            <Logo className="h-10 w-auto" />
          </div>

          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-1.5">
              <Typography as="h1" size="2xl" weight="medium">
                Business verification
              </Typography>
              <Typography size="base" className="text-muted-foreground">
                We use this information to verify your business and maintain a
                trusted platform.
              </Typography>
            </div>

            <Formik
              initialValues={initialValues}
              validate={validate}
              onSubmit={() => undefined}
            >
              <Form className="flex w-full flex-col gap-6">
                <div className="flex w-full flex-col gap-4">
                  <FormikInput
                    name="legalBusinessName"
                    label="Legal business name"
                    placeholder="Blue Yachts Miami LLC"
                    size="xl"
                    required
                  />
                  <FormikInput
                    name="businessAddress"
                    label="Business Address"
                    placeholder="888 MacArthur Causeway Miami, FL 33132"
                    size="xl"
                    required
                  />
                  <FormikInput
                    name="einTaxId"
                    label="EIN / Tax ID"
                    placeholder="e.g. 12-3456789"
                    size="xl"
                  />
                  <FormikInput
                    name="ownerName"
                    label="Owner / Representative name"
                    size="xl"
                    required
                  />
                  <FormikInput
                    name="phoneNumber"
                    label="Phone number"
                    type="tel"
                    size="xl"
                    required
                  />
                </div>
                <Button type="submit" size="xl" className="w-full">
                  Confirm and Continue
                </Button>
              </Form>
            </Formik>
          </div>
        </div>

        <div className="flex flex-col items-center py-4 text-center">
          <Typography size="xs" className="text-muted-foreground">
            © 2026 Bethere Corp. All Rights Reserved
          </Typography>
        </div>
      </div>
    </div>
  );
}

export { BusinessVerification };
