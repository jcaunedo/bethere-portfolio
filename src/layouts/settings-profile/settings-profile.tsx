import * as React from "react";

import { SettingsLayout } from "@/layouts/settings/settings";
import { ProfileHeader } from "@/components/navigation/profile-header";
import { SettingsDetailRow } from "@/components/forms/settings-detail-row";
import { Input } from "@/components/forms/input";

/** A single editable field's local state: current value + whether its row is expanded. */
type FieldState = { value: string; editing: boolean };

const FIELD_KEYS = [
  "name",
  "title",
  "email",
  "phone",
  "whatsapp",
  "timeZone",
  "language",
] as const;
type FieldKey = (typeof FIELD_KEYS)[number];

const initialFields: Record<FieldKey, FieldState> = {
  name: { value: "Jenny Wilson", editing: false },
  title: { value: "", editing: false },
  email: { value: "jennywilson@email.com", editing: false },
  phone: { value: "(305) 555-5732", editing: false },
  whatsapp: { value: "", editing: false },
  timeZone: {
    value: "Eastern Standard Time (EST) · UTC−05:00",
    editing: false,
  },
  language: { value: "English", editing: false },
};

/**
 * Provider Portal "My Profile" settings sub-page. Figma origin: Provider
 * Portal → "Profile" frame. Renders inside `SettingsLayout`'s content
 * column: a `ProfileHeader` summary, then a divided stack of
 * `SettingsDetailRow`s for each profile field — each row expands in place
 * to edit its own value.
 */
function SettingsProfileLayout() {
  const [fields, setFields] =
    React.useState<Record<FieldKey, FieldState>>(initialFields);
  const [drafts, setDrafts] = React.useState<Record<FieldKey, string>>(
    Object.fromEntries(
      FIELD_KEYS.map((key) => [key, initialFields[key].value]),
    ) as Record<FieldKey, string>,
  );
  // Rows can be opened in any order and several can be open at once;
  // this tracks that order so Escape/Enter act on the most recently opened
  // one first (LIFO), rather than an arbitrary or every open row.
  const [openOrder, setOpenOrder] = React.useState<FieldKey[]>([]);

  // The keydown handler below is only re-bound when `openOrder` changes, so
  // it would otherwise close over a stale `drafts` from whenever the row
  // was opened — a ref keeps `save` reading the latest keystroke instead.
  const draftsRef = React.useRef(drafts);
  draftsRef.current = drafts;

  function startEditing(key: FieldKey) {
    setDrafts((prev) => ({ ...prev, [key]: fields[key].value }));
    setFields((prev) => ({
      ...prev,
      [key]: { ...prev[key], editing: true },
    }));
    setOpenOrder((prev) => [...prev.filter((k) => k !== key), key]);
  }

  function cancelEditing(key: FieldKey) {
    setFields((prev) => ({
      ...prev,
      [key]: { ...prev[key], editing: false },
    }));
    setOpenOrder((prev) => prev.filter((k) => k !== key));
  }

  function save(key: FieldKey) {
    setFields((prev) => ({
      ...prev,
      [key]: { value: draftsRef.current[key], editing: false },
    }));
    setOpenOrder((prev) => prev.filter((k) => k !== key));
  }

  // Esc cancels / Enter saves the most recently opened row — same as
  // clicking that row's own Cancel/Save. Repeated presses walk the stack
  // backwards. Enter is skipped while focus is on a button (native
  // click-activation already handles it there) so it doesn't double-fire.
  React.useEffect(() => {
    if (openOrder.length === 0) return;

    function handleKeyDown(event: KeyboardEvent) {
      const activeKey = openOrder[openOrder.length - 1];
      if (event.key === "Escape") {
        cancelEditing(activeKey);
      } else if (
        event.key === "Enter" &&
        (event.target as HTMLElement | null)?.tagName !== "BUTTON"
      ) {
        event.preventDefault();
        save(activeKey);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openOrder]);

  return (
    <SettingsLayout activeItem="My profile">
      <div className="flex flex-col gap-6 pb-24">
        <ProfileHeader
          name="Johanna Wilson"
          role="Owner"
          email="jennywilson@email.com"
        />

        <div className="flex flex-col divide-y divide-border">
          <div className="py-6">
            <SettingsDetailRow
              title="Your Name"
              value={fields.name.value}
              emptyPlaceholder="No name yet"
              editDescription="Use your real name so your teammates can recognize you."
              editing={fields.name.editing}
              onEditStart={() => startEditing("name")}
              onCancel={() => cancelEditing("name")}
              onSave={() => save("name")}
            >
              <Input
                value={drafts.name}
                onChange={(e) =>
                  setDrafts((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </SettingsDetailRow>
          </div>

          <div className="py-6">
            <SettingsDetailRow
              title="Title"
              value={fields.title.value}
              emptyPlaceholder="No title yet"
              addLabel="Add Title"
              editDescription="Placeholder copy — update with real guidance."
              editing={fields.title.editing}
              onEditStart={() => startEditing("title")}
              onCancel={() => cancelEditing("title")}
              onSave={() => save("title")}
            >
              <Input
                value={drafts.title}
                onChange={(e) =>
                  setDrafts((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </SettingsDetailRow>
          </div>

          <div className="py-6">
            <SettingsDetailRow
              title="Email"
              value={fields.email.value}
              emptyPlaceholder="No email yet"
              editDescription="Placeholder copy — update with real guidance."
              editing={fields.email.editing}
              onEditStart={() => startEditing("email")}
              onCancel={() => cancelEditing("email")}
              onSave={() => save("email")}
            >
              <Input
                type="email"
                value={drafts.email}
                onChange={(e) =>
                  setDrafts((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </SettingsDetailRow>
          </div>

          <div className="py-6">
            <SettingsDetailRow
              title="Phone number"
              value={fields.phone.value}
              emptyPlaceholder="No phone number yet"
              editDescription="Placeholder copy — update with real guidance."
              editing={fields.phone.editing}
              onEditStart={() => startEditing("phone")}
              onCancel={() => cancelEditing("phone")}
              onSave={() => save("phone")}
            >
              <Input
                type="tel"
                value={drafts.phone}
                onChange={(e) =>
                  setDrafts((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </SettingsDetailRow>
          </div>

          <div className="py-6">
            <SettingsDetailRow
              title="WhatsApp number"
              value={fields.whatsapp.value}
              emptyPlaceholder="No WhatsApp number yet"
              addLabel="Add WhatsApp"
              addDescription="Placeholder copy — update with real guidance."
              editDescription="Placeholder copy — update with real guidance."
              editing={fields.whatsapp.editing}
              onEditStart={() => startEditing("whatsapp")}
              onCancel={() => cancelEditing("whatsapp")}
              onSave={() => save("whatsapp")}
            >
              <Input
                type="tel"
                value={drafts.whatsapp}
                onChange={(e) =>
                  setDrafts((prev) => ({ ...prev, whatsapp: e.target.value }))
                }
              />
            </SettingsDetailRow>
          </div>

          <div className="py-6">
            <SettingsDetailRow
              title="Time zone"
              value={fields.timeZone.value}
              emptyPlaceholder="No time zone yet"
              editDescription="Placeholder copy — update with real guidance."
              editing={fields.timeZone.editing}
              onEditStart={() => startEditing("timeZone")}
              onCancel={() => cancelEditing("timeZone")}
              onSave={() => save("timeZone")}
            >
              <Input
                value={drafts.timeZone}
                onChange={(e) =>
                  setDrafts((prev) => ({ ...prev, timeZone: e.target.value }))
                }
              />
            </SettingsDetailRow>
          </div>

          <div className="py-6">
            <SettingsDetailRow
              title="Preferred language"
              value={fields.language.value}
              emptyPlaceholder="No preferred language yet"
              editDescription="Placeholder copy — update with real guidance."
              note={
                <>
                  <span className="text-muted-foreground">Other:</span>{" "}
                  Spanish, Italian
                </>
              }
              editing={fields.language.editing}
              onEditStart={() => startEditing("language")}
              onCancel={() => cancelEditing("language")}
              onSave={() => save("language")}
            >
              <Input
                value={drafts.language}
                onChange={(e) =>
                  setDrafts((prev) => ({ ...prev, language: e.target.value }))
                }
              />
            </SettingsDetailRow>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}

export { SettingsProfileLayout };
