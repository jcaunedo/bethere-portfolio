<!--
Created: Sep 05, 2026
Created by: Julio Caunedo
Last updated: Sep 25, 2026 (updated link: business-onboarding.md → onboarding-business.md)
Scope: the New Listing creation flow for providers.
Purpose: record the design rationale for keeping Experience/Service as the two primary listing-type paths and removing the redundant category step.
-->

# New Listing Flow

## Design rationale

Keep **Experience** and **Service** as the two primary paths when a provider creates a new listing.

The provider's onboarding selection answers _what kind of business they are_, while the New Listing choice answers _what type of offering they are creating_. These are related, but they should remain separate because the same business category can support both listing types.
See [onboarding-business.md](onboarding-business.md) for the business-category taxonomy set during onboarding.

Example:

- Boats & yacht charters → Experience: yacht charter, sunset cruise, sandbar trip
- Boats & yacht charters → Service: private captain, crew service, provisioning

### Remove the current Step 2

Eliminate the generic category step that asks "What are you offering?" with options such as:

- Yacht Charter
- Water Activities
- Tours
- Nightlife
- Food & Drink
- Wellness
- Events
- Other

ℹ️ This information is already established by the provider's business category during onboarding, so asking for it again creates redundant classification and unnecessary friction.

### Updated flow

New listing → choose Experience or Service → go directly into listing-specific details.

For example:

- Boats & yacht charters + Experience → "What type of boat/yacht are you listing?" → Motor yacht / Sailing yacht / Catamaran / etc.
- Boats & yacht charters + Service → "What service are you offering?" → Private captain / Crew service / Provisioning / etc.

See [taxonomy.md](taxonomy.md) for the full business-category × Experience/Service matrix backing this step.

### Product model

- **Business category** — defines the provider's business domain.
- **Experience / Service** — defines the listing model.
- **Listing subtype/details** — defines the specific offering.

The onboarding category should therefore inform and personalize the New Listing flow, but should not replace the Experience / Service choice.
