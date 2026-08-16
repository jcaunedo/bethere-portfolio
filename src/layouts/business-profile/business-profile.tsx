import * as React from "react";
import { Formik, Form } from "formik";

import { Button } from "@/components/buttons/button";
import { FormikInput } from "@/components/forms/input";
import { FormikSelect } from "@/components/forms/select";
import { Typography } from "@/components/typography";
import { StepperOnboarding } from "@/components/stepper/stepper-onboarding";
import { Logo } from "@/components/data-display/logo";

const PROVIDER_TYPE_OPTIONS = [
  { value: "experience-company", label: "Experience Company" },
  { value: "independent-host", label: "Independent Host" },
  { value: "tour-operator", label: "Tour Operator" },
  { value: "venue-location", label: "Venue / Location" },
  { value: "event-organizer", label: "Event Organizer" },
  { value: "rental-provider", label: "Rental Provider" },
  { value: "instructor-guide", label: "Instructor / Guide" },
  { value: "hospitality-service", label: "Hospitality Service" },
  { value: "agency-broker", label: "Agency / Broker" },
  { value: "other", label: "Other" },
];

type BusinessProfileValues = {
  companyName: string;
  providerType: string;
  phoneNumber: string;
  website: string;
};

function validate(values: BusinessProfileValues) {
  const errors: Partial<Record<keyof BusinessProfileValues, string>> = {};
  if (!values.companyName.trim()) {
    errors.companyName = "Company name is required.";
  }
  if (!values.providerType) {
    errors.providerType = "Please select a provider type.";
  }
  return errors;
}

/**
 * Business onboarding — "Tell us about your business" step. Figma origin:
 * Sign-Up/Sign-In → "Business profile" frame. Step 1 of 3 in the onboarding stepper.
 */
function BusinessProfile() {
  const initialValues: BusinessProfileValues = {
    companyName: "",
    providerType: "",
    phoneNumber: "",
    website: "",
  };

  return (
    <div className="flex h-screen items-center overflow-clip bg-background p-2">
      <div className="flex h-full w-full flex-1 flex-col items-center justify-between">
        <StepperOnboarding steps={3} currentStep={1} />

        <div className="flex w-full max-w-[464px] flex-1 flex-col items-center justify-center gap-6">
          <div className="flex items-center justify-center py-6.5">
            <Logo className="h-10 w-auto" />
          </div>

          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-1.5">
              <Typography as="h1" size="2xl" weight="medium">
                Tell us about your business
              </Typography>
              <Typography size="base" className="text-muted-foreground">
                Help us verify your business and personalize your experience.
              </Typography>
            </div>

            <Formik
              initialValues={initialValues}
              validate={validate}
              onSubmit={() => {
                // Prototype-only cross-layout navigation: jump to the next step's
                // Storybook story so the flow can be clicked through end to end.
                // The story renders inside Storybook's preview iframe, so the
                // manager window (window.top) — not this frame's own location —
                // is what understands the "?path=/story/..." route. The path must
                // be built as an absolute URL off window.top's own origin: a bare
                // "?path=..." resolves relative to whatever sub-path the manager
                // happens to be on and can bounce to the wrong route.
                const top = window.top && window.top !== window ? window.top : window;
                top.location.href = `${top.location.origin}/?path=/story/layouts-businessverification--default`;
              }}
            >
              <Form className="flex w-full flex-col gap-6">
                <div className="flex w-full flex-col gap-4">
                  <FormikInput
                    name="companyName"
                    label="Company name"
                    placeholder="Blue Yachts Miami"
                    size="xl"
                    required
                  />
                  <FormikSelect
                    name="providerType"
                    label="Provider type"
                    placeholder="Select provider type"
                    options={PROVIDER_TYPE_OPTIONS}
                    size="xl"
                    required
                  />
                  <FormikInput
                    name="phoneNumber"
                    label="Phone number"
                    type="tel"
                    size="xl"
                  />
                  <FormikInput
                    name="website"
                    label="Website"
                    placeholder="https://"
                    size="xl"
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Button type="submit" size="xl" className="w-full">
                    Take me to my portal
                  </Button>
                  {/* Figma has no defined destination for this CTA yet — visual-only stub. */}
                  <Button type="button" variant="outline" size="xl" className="w-full">
                    Create my first experience
                  </Button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>

        <div className="flex flex-col items-center py-4 text-center">
          <Typography size="xs" className="text-muted-foreground">
            © 2026 BeThere Corp. All Rights Reserved
          </Typography>
        </div>
      </div>
    </div>
  );
}

export { BusinessProfile };
