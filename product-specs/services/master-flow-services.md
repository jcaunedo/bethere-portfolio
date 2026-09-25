<!--
Created: Jun 19, 2026
Created by: Julio Caunedo
Last updated: Jul 02, 2026
-->

# Service — Category Flow

> See [../master-flow.md](../master-flow.md) for Step 1 (Listing Type) and the master flow principles. See [../experience/yacht-charter.md](../experience/yacht-charter.md) as a reference for how a fully-designed category flow is structured (the Service branch should follow an analogous pattern, adapted per the differences below).

**Status:** Undesigned beyond Step 1. The Figma file ([link](https://www.figma.com/design/WcuVufMxyCvkEJ2BuxPpX6/Provider-Portal?node-id=72-832)) currently only shows the "Service" option on Step 1 — no Step 2 (service type picker) or later steps exist yet.

## How Service differs from Experience

| Aspect          | Experience                              | Service                                        |
| ---------------- | ----------------------------------------- | ------------------------------------------------ |
| Scheduling       | Scheduled, duration-based                | May be hourly or fixed-fee                     |
| Group            | Often group-oriented; guests book a time slot | Often customized to a single client            |
| Location         | Happens at a location (the asset's location, e.g. marina/venue) | Can happen at the customer's location          |
| Provider's role  | Hosts/operates the experience            | Provider performs the work directly            |

These differences likely mean:

- The "asset" steps (Steps 4–6 in the yacht flow) become **provider/skillset attributes** rather than vehicle/venue attributes (e.g., certifications, equipment carried, years of experience, languages spoken).
- The "Availability" step (Step 8) likely needs an **hourly-rate vs. fixed-fee** toggle per service, rather than (or in addition to) duration-based pricing rows.
- The "Location" question (Step 7 in the yacht flow) needs a **"at my location" vs. "at customer's location" vs. "either"** option, since services can travel to the client.
- "What's included" / add-ons (Steps 7 & 9) likely map to **service packages/tiers** (e.g., a Photographer might offer "1 hour shoot" vs. "Full day coverage" as distinct packages rather than duration multipliers).

## Step 2 (proposed): Service Type

**Title:** What service are you offering? _(working title — not yet in Figma)_

**Description:** Choose the service that best describes what you provide.

| Service Type      | Description (placeholder)                                  | Flow file |
| ------------------ | -------------------------------------------------------------- | ----------- |
| Private Driver     | Chauffeured transportation for guests or clients.            | [private-driver.md](private-driver.md) |
| Concierge          | On-demand assistance, bookings, errands, and local arrangements. | [concierge.md](concierge.md) |
| Photographer       | Professional photography for events, portraits, or experiences. | [photographer.md](photographer.md) |
| Massage Therapist  | In-room or on-location massage and bodywork.                  | [massage-therapist.md](massage-therapist.md) |
| Makeup Artist      | On-location makeup and beauty services.                       | [makeup-artist.md](makeup-artist.md) |
| Chef               | Private cooking, meal prep, or dining experiences at a client's location. | [chef.md](chef.md) |
| Security           | Personal or event security services.                          | [security.md](security.md) |
| Event Planner      | Planning and coordination services for private events.        | [event-planner.md](event-planner.md) |

> TODO: This list and these descriptions are placeholders based on the user-provided examples — confirm against Figma once the Service branch is designed (no Step 2 frame currently exists for Service).

## Steps 3+

> TODO: Entirely undesigned. Once a Step 2 (service type) exists, each service type likely needs its own follow-up (Step 3) and attribute set, mirroring the per-category config pattern in [../master-flow.md](../master-flow.md) Master Flow Principles #2.
