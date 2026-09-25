<!--
Created: Sep 05, 2026
Created by: Julio Caunedo
Last updated: Sep 25, 2026 (updated links: business-onboarding.md → onboarding-business.md; services/ and experiences/ master-flow.md → master-flow-services.md / master-flow-experiences.md)
Scope: single source of truth for the business-category × Experience/Service listing taxonomy — what Experience subtypes and Service subtypes exist under each provider business category.
Purpose: support the [new-listing-flow.md](new-listing-flow.md) product model (Business category → Experience/Service → Listing subtype) by documenting, per business category, the concrete subtypes a provider can list. Referenced by new-listing-flow.md, onboarding-business.md, experiences/master-flow-experiences.md, and services/master-flow-services.md.
-->

# Listing Taxonomy — Business Category × Experience/Service

| Listing type | Definition                                                          |
| ------------ | ------------------------------------------------------------------- |
| Experience   | The guest attends or participates in a defined entertainment event. |
| Service      | The guest hires a professional to perform or support an event.      |

Each row is one business category from [onboarding-business.md](onboarding-business.md)'s onboarding dropdown. The columns list the concrete listing subtypes a provider in that category can create, split by [new-listing-flow.md](new-listing-flow.md)'s Experience/Service model.

| Business category         | Experience                                                                                                                                                   | Service                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Boats & yacht charters    | Yacht charter, sunset cruise, sandbar trip                                                                                                                   | Private captain, crew service, provisioning                                                  |
| City tours                | Walking tour, bike tour, food tour, neighborhood tour, history tour, architecture tour, private city tour, themed tour                                       | N/A                                                                                          |
| Food & dining             | Restaurant dining, tasting menu, chef's table, brunch, cooking class, food tasting, wine tasting, cocktail tasting                                           | Private chef, bartender, catering, sommelier service                                         |
| Wellness & beauty         | Spa day, wellness retreat, yoga class, meditation session, sound bath, fitness class, beauty workshop                                                        | Massage, facial, makeup artist, hairstylist, nail service, personal trainer, yoga instructor |
| Entertainment & nightlife | Nightclub entry, live music, comedy show, rooftop experience, bar crawl, dance experience, karaoke, live performance, themed party, VIP nightlife experience | DJ service, live musician, performer, entertainer, event host / MC, dancer, photographer     |
| Transport                 | Scenic drive, sightseeing drive, luxury ride experience, city transfer experience                                                                           | Private driver, airport transfer, chauffeur service, hourly car service, group transportation, shuttle service |

ℹ️ City tours has no Service branch — a City tours provider only ever lists Experiences, per the confirmed subtype set above.

ℹ️ v2-deferred business categories (Activities & recreation, Shopping experiences, Family experiences, Art/culture/entertainment, Professional services — see onboarding-business.md's "v1 category scope") are intentionally left out of this table until they ship in onboarding.

## Relationship to the old category-based flow files

[experiences/master-flow-experiences.md](experiences/master-flow-experiences.md) and [services/master-flow-services.md](services/master-flow-services.md) currently organize subtypes by the old generic "what are you offering?" categories (Yacht Charter, Water Activities, Tours, Nightlife, Restaurant, Wellness, Events, Other for Experience; individual service roles for Service) — the same Step 2 that [new-listing-flow.md](new-listing-flow.md) calls to remove. Those per-category flow files (e.g. [experiences/yacht-charter.md](experiences/yacht-charter.md)) still hold the useful step-by-step detail for building a listing of that subtype; this file's job is only to map business category → which subtypes apply, not to redefine those flows.

⚠️ **Gap:** reconciling the old generic categories against the new business-category rows above (e.g. does "Boats & yacht charters" pull its Experience subtypes only from the old "Yacht Charter" flow file, or also from "Water Activities"?) is not yet resolved.
