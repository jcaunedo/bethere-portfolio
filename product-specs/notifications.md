<!--
Created: Jun 20, 2026
Created by: Julio Caunedo
Last updated: Jul 02, 2026
-->

# Notifications — Provider Portal

**Location:** Settings → Notifications  
**Audience:** Business owner / provider  
**Description:** Choose which BeThere notifications you receive and how they're delivered.  
**Figma:** [Provider Portal — Notifications](https://www.figma.com/design/WcuVufMxyCvkEJ2BuxPpX6/Provider-Portal?node-id=342-168)

---

## Delivery Channels

Global toggles that apply across all notification types. If "Allow Notifications" is off, all other channels are suppressed regardless of their individual state.

| Channel       | Label                            |
| ------------- | -------------------------------- |
| Master switch | Allow Notifications              |
| Email         | Email notifications              |
| SMS           | SMS (text message) notifications |
| Mobile        | Push notification                |

---

## Toggle States

Each notification item has a toggle with two visual states that reflect both the user's preference and the channel availability:

| State   | Description                                                                             |
| ------- | --------------------------------------------------------------------------------------- |
| **On**  | The provider has enabled this notification. The bell icon is colored (active).          |
| **Off** | The provider has disabled this notification. The bell icon appears muted/strikethrough. |

**Master "Allow Notifications" behavior:**

- When turned **off**, delivery channel options (email, SMS, push) are **hidden from the UI** — not just disabled.
- Individual notification toggles remain visible but no notifications are sent.
- When turned **on**, delivery channels reappear and previously configured states are restored.

**Turning on an individual notification while master is off:**

- The individual item turns on.
- The master "Allow Notifications" toggle flips back to **on** automatically.
- Delivery channels reappear.

**Configuration persistence:**

The recommended behavior is that individual toggle states are always preserved independently of the master switch. When a provider turns on a single notification while the master is off, the system should:

1. Enable that specific notification item.
2. Flip the master switch to on.
3. Restore all other items to their previous configuration — items that were on before remain on, items that were off remain off.

This avoids overriding intentional per-item preferences and treats the master switch as a pause, not a reset.

---

## Notification Categories

### Bookings

> Get notified about new reservations, upcoming activity, cancellations, and schedule changes across all your listings.

- New booking received
- Upcoming booking reminder
- Availability conflict detected
- Booking cancelled by guest
- Booking cancelled by staff member
- Booking modified / rescheduled
- Guest no-show

---

### Payments

> Stay on top of incoming payments, payouts to your bank account, and any refunds processed to guests.

- Payment received
- Payout processed
- Payment failed
- Refund issued

---

### Listings

> Receive updates when your listings are reviewed, approved, rejected, or flagged by the BeThere team.

- Listing approved / rejected
- Listing flagged or taken down
- Team member added a listing
- Team member modified a listing

---

### Guest Messages

> Be notified when a guest sends you a message so you can respond promptly.

- New message from a guest
- Unanswered message reminder — follow-up if no response after 1 hour

---

### Reviews

> Get alerted when a guest leaves a review on one of your listings.

- New review received
- Guest replied to your review response

---

### Compliance Documentation

> Stay ahead of expiring documents and incomplete profile requirements that could affect your listing visibility.

- Required document expiring soon (license, insurance, etc.)

---

### Team

> Stay informed about team member activity and changes to your account.

- New team member created
- Team member profile modified

---

## Open Items

1. **Dispute / chargeback** — not yet included under Payments; worth adding given financial impact
2. **Profile incomplete / missing info** — removed from Compliance documentation; confirm if system-handled or user-facing
3. **Team member removed** — no notification for deactivated team members; relevant for access control awareness
4. **Listing goes live** — first-publish confirmation not included; low priority but a good trust-building moment
5. **Per-notification delivery preferences** — currently delivery channels are global only; future enhancement could allow per-type channel control (e.g. new booking via push + email, payment failed via SMS only)
6. **Notification frequency / digest** — no daily summary option; could reduce noise for high-volume providers
