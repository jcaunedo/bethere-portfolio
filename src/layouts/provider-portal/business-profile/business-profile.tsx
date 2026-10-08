import * as React from "react";
import { Formik, Form } from "formik";

import { Button } from "@/components/buttons/button";
import { FormikInput } from "@/components/forms/input";
import { FormikSelect } from "@/components/forms/select";
import { Typography } from "@/components/typography";
import { Logo } from "@/components/data-display/logo";
import { PROTOTYPE_STORIES, openStory } from "@/layouts/shared/prototype-links";

// Business category taxonomy — provider-facing labels. See
// product-specs/onboarding-business.md "Category list" / "v1 category scope"
// for the source of truth (paired against the guest-facing Concierge tile
// taxonomy) and notes on individual entries. v1 ships exactly these 6
// categories, no "Other" fallback; the rest are deferred to v2 — see that
// doc for the full set.
const PROVIDER_TYPE_OPTIONS = [
  { value: "city-tours", label: "City tours" },
  { value: "boats-yacht-charters", label: "Boats & yacht charters" },
  { value: "food-dining", label: "Food & dining" },
  { value: "wellness-beauty", label: "Wellness & beauty" },
  { value: "entertainment-nightlife", label: "Entertainment & nightlife" },
  { value: "transport", label: "Transport" },
];

type BusinessProfileValues = {
  companyName: string;
  providerType: string;
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
 * Sign-Up/Sign-In → "Business profile" frame. No onboarding stepper (removed Oct 08, 2026).
 */
function BusinessProfile() {
  const initialValues: BusinessProfileValues = {
    companyName: "",
    providerType: "",
    website: "",
  };

  return (
    <div className="flex h-screen items-center overflow-clip bg-background p-2">
      <div className="flex h-full w-full flex-1 flex-col items-center justify-between">
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
              // Validate on mount so the buttons start disabled: they unlock once the required
              // fields (business name and what it offers) are filled.
              validateOnMount
              onSubmit={() => {
                // Prototype-only cross-layout navigation: onboarding done, open the Provider Portal.
                openStory(PROTOTYPE_STORIES.providerPortal);
              }}
            >
              {({ isValid }) => (
              <Form className="flex w-full flex-col gap-6">
                <div className="flex w-full flex-col gap-4">
                  <FormikInput
                    name="companyName"
                    label="Business name"
                    // First field of a new user's first step: ready to type on arrival.
                    autoFocus
                    size="xl"
                  />
                  <FormikSelect
                    name="providerType"
                    label="What does your business offer?"
                    placeholder="Select a category"
                    options={PROVIDER_TYPE_OPTIONS}
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
                  {/* Both CTAs move the new user forward, so both wait for the required fields. */}
                  <Button type="submit" size="xl" className="w-full" disabled={!isValid}>
                    Take me to my portal
                  </Button>
                  {/* Prototype: also opens the Provider Portal (no dedicated destination yet). */}
                  <Button
                    type="button"
                    variant="outline"
                    size="xl"
                    className="w-full"
                    disabled={!isValid}
                    onClick={() => openStory(PROTOTYPE_STORIES.providerPortal)}
                  >
                    Create my first experience
                  </Button>
                </div>
              </Form>
              )}
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

export { BusinessProfile };
