<!--
Created: Oct 08, 2026
Created by: Julio Caunedo
Last updated: Oct 09, 2026 (prototype "Reset prototype" item). Previously: Oct 08, 2026 (Profile / Account naming: menu "My profile" + "Account settings", page title "Settings", rail groups Profile / Account, "Business profiles" label; notifications confirmed per user)
-->

# Account Menu & Settings Architecture — Provider Portal

**Location:** Sidebar footer → account menu (opened from `SelectAccountInfo`), and the settings sections it opens
**Audience:** Every signed-in provider (business owner, admin, staff)
**Description:** How personal account settings and business-wide settings are split, and how the account menu leads into each.
**Source:** `src/components/navigation/sidebar/sidebar.tsx` (account menu), `src/layouts/provider-portal/account-settings/account-settings.tsx` (settings sections)

---

## Account Menu & Settings Architecture

### Overview

Separate personal account settings from business-wide configurations to establish a clear, scalable information architecture across the Bethere Provider Portal.

### Account Menu

- **My profile:** Personal settings for the logged-in user. Opens Settings on My profile (Profile group).
- **Account settings:** Settings for the business account — its business profiles, team, billing, promo codes and integrations. Opens Settings on Business profiles (Account group).
- **Theme:** Personal interface appearance preference (Light, Dark, Auto).
- **Language:** Personal interface language preference.
- **Log out:** End the current user session.

### Settings organization

The settings page is titled **Settings** and holds two groups.

**Profile** (the person)

- My profile
- Notifications
- Security (personal authentication, password, MFA)

**Account** (the business account the person works in)

- Business profile (one business) / Business profiles (several)
- Team members
- Billing
- Promo codes
- Integrations
- Business-wide security and access controls (if applicable)

### UX principles

- **Clear ownership:** Profile settings affect only the logged-in user. Account settings affect the business account and potentially other team members.
- **Direct navigation:** Account Menu entries open their respective settings sections without introducing unnecessary navigation layers.
- **Consistent terminology:** "Profile" is the person and "Account" is the business account, everywhere. Each account menu entry is named after the group it opens: "My profile" → Profile, "Account settings" → Account. One account can own several business profiles, so "Business profiles" reads correctly with any number of businesses.
- **Notification preferences:** Although notifications may relate to business activity, delivery preferences belong to individual users.
- **Language distinction:** Interface language (Account Menu) and preferred communication language (My profile) are separate preferences.
- **Scalability:** The architecture must accommodate additional personal and business-level settings without changing the primary navigation model.

---

## Current implementation status

ℹ️ Status of the UCL reference implementation as of Oct 08, 2026, against the architecture above.

- ✅ **Resolved (Oct 08, 2026):** the account menu lists My profile, Account settings (gear icon), Theme (Auto), Language (English), then Log out after a divider (Figma `Account Menu`, 511:2314). "My profile" opens Settings on My profile; "Account settings" opens it on Business profiles.
- ✅ **Resolved (Oct 08, 2026):** the settings page is titled "Settings" (was "Account Settings"), on desktop and mobile, since it holds both the person's and the account's settings.
- ✅ **Resolved (Oct 08, 2026):** the settings rail and the mobile settings menu are grouped **Profile** (My profile, Notifications, Security) and **Account** (Business profiles, Team members, Billing, Promo codes, Integrations), split by a divider (Figma `Sidebar Settings`, 369:471; Provider-Portal `Account Settings Menu`, 570:3326).
- ✅ **Resolved (Oct 08, 2026):** the businesses row reads "**Business profile**" when the account has one business (the default) and "**Business profiles**" when it has several, in the rail and the mobile menu (`businessProfilesLabel`, set once with `AccountSettingsProvider`).
- ✅ **Confirmed (Oct 08, 2026):** notification preferences are per user (see `notifications.md`).
- ✅ **Copy fix (Oct 08, 2026):** the last item reads "Log out" (sentence case), in the spec and the code. ⚠️ Figma `Account Menu` (511:2314) still reads "Log Out" and needs the same change.
- ✅ **Resolved (Oct 08, 2026):** a single business is the default. "Account settings" → Business profiles opens that business's details directly; the list of businesses only appears with several (see `business-profiles.md`).
- ℹ️ **Prototype scenario links:** in the Storybook prototype (Provider Portal story), the account menu lists prototype-only links below Log out, after a divider, each jumping to a scenario that isn't the default — today "Multiple businesses" (switches the account to several businesses and opens the list). The last item is always "Reset prototype" (`undo-2` icon), which reloads the portal in its initial state (home, one business, nothing open). They're not part of the product's account menu; add new scenario links above "Reset prototype".
- ⚠️ **Risk:** in consumer apps "account" often means the person's own login. Security sitting under Profile signals that Account is the business side; if users still look for their password under Account, add a one-line description to the Account pages.
- ⚠️ **Decision needed:** business-wide security and access controls ("if applicable") have no section yet. Security sits under Profile and covers personal authentication only.
