<!--
Created: Jun 20, 2026
Created by: Julio Caunedo
Last updated: Jul 02, 2026
-->

# Inbox — Provider Portal

> **Status: In Progress**

## Overview

The Inbox is the single communication and activity hub for business owners in the Provider Portal. It surfaces all relevant events in one place: guest messages, booking activity, payment updates, listing status changes, and account alerts.

**Audience:** Provider / business owner  
**Nav location:** Primary sidebar, below Dashboard — persistent badge shows unread count

---

## Feed Behavior

- **Order:** Reverse chronological — newest item at the top
- **Scope:** All notification types in a single unified feed (no tabs or category splits)
- **Pagination:** Infinite scroll; load next page when user reaches the bottom
- **Real-time:** New items appear at the top without requiring a page refresh
- **Grouping:** No grouping — flat list only

---

## Notification Item Anatomy

Each item in the feed has the following structure:

| Element | Description |
|---------|-------------|
| **Type icon** | Visual indicator of the notification category (e.g. calendar for bookings, chat bubble for messages) |
| **Title** | Short, scannable headline |
| **Body preview** | 1–2 line summary; truncated with ellipsis if longer |
| **Timestamp** | Relative (e.g. "2 min ago", "Yesterday") — full date on hover |
| **Read/unread state** | Unread items have a colored left border and bold title |
| **CTA link** | Tapping the item navigates to the relevant detail page |

---

## Notification Type Catalog

### Bookings

| Type | Trigger | Title | Body | CTA destination |
|------|---------|-------|------|-----------------|
| New booking received | Guest completes checkout | "New booking: {Experience/Service name}" | "{Guest name} booked {date} at {time}" | Booking detail page |
| Booking cancelled by guest | Guest cancels booking | "Booking cancelled: {Experience/Service name}" | "{Guest name} cancelled their booking for {date}" | Booking detail page |
| Booking modified | Guest requests reschedule | "Booking updated: {Experience/Service name}" | "{Guest name} changed their booking to {new date}" | Booking detail page |

### Payments

| Type | Trigger | Title | Body | CTA destination |
|------|---------|-------|------|-----------------|
| Payment received | Guest payment clears | "Payment received: {amount}" | "Payment for {Experience/Service name} on {date}" | Booking detail page |
| Payout processed | Payout transferred to bank | "Payout sent: {amount}" | "Your payout has been transferred to your account" | Payouts page |
| Refund issued | Refund processed to guest | "Refund issued: {amount}" | "A refund was issued to {Guest name} for {Experience/Service name}" | Booking detail page |

### Listings

| Type | Trigger | Title | Body | CTA destination |
|------|---------|-------|------|-----------------|
| Listing approved | Admin approves a new or updated listing | "Listing approved: {listing name}" | "Your listing is now live and visible to guests" | Listing detail page |
| Listing rejected | Admin rejects a listing | "Listing needs changes: {listing name}" | "{Reason summary}" | Listing edit page |
| Listing flagged / taken down | Admin flags or removes a listing | "Listing removed: {listing name}" | "Your listing has been taken down. {Reason summary}" | Listing detail page |

### Guest Messages

| Type | Trigger | Title | Body | CTA destination |
|------|---------|-------|------|-----------------|
| New message from guest | Guest sends a message | "{Guest name}" | "{Message preview}" | Message thread |

### Account / Compliance

| Type | Trigger | Title | Body | CTA destination |
|------|---------|-------|------|-----------------|
| Required document expiring | Document expiry within 30 days | "Document expiring soon" | "{Document name} expires on {date}. Update it to keep your listing active." | Account documents page |
| Profile incomplete | Required field missing at publish time | "Complete your profile" | "{Field name} is required to publish your listing." | Profile settings page |

### Operational

| Type | Trigger | Title | Body | CTA destination |
|------|---------|-------|------|-----------------|
| Upcoming booking reminder | 24 hours before a booking | "Reminder: booking tomorrow" | "{Guest name} — {Experience/Service name} at {time}" | Booking detail page |
| Availability conflict | Two bookings overlap | "Availability conflict detected" | "Two bookings overlap on {date}. Review and resolve." | Calendar / booking list |

---

## Read / Unread Rules

- **Mark as read:** Tapping an item marks it as read immediately
- **Mark all as read:** Available via a "Mark all as read" action at the top of the feed
- **Nav badge:** Shows the total count of unread items; disappears when count reaches 0
- **Persistence:** Read state is stored server-side — consistent across devices

---

## Empty State

Shown when the feed has no items.

**Illustration:** Inbox icon or similar neutral visual  
**Title:** "You're all caught up"  
**Body:** "New bookings, messages, and updates will appear here."

---

## Open Items

1. **Push / email mirroring** — which notification types also trigger a push notification or email? Needs definition per type.
2. **Filter by type** — future enhancement: allow providers to filter the feed by category (bookings, messages, payments, etc.)
3. **Search** — not in scope for v1
4. **Notification preferences** — per-type opt-out (e.g. disable operational reminders) — not in scope for v1
5. **Message threads** — inline chat experience within the Inbox is not yet designed; CTA currently navigates to a standalone thread view
