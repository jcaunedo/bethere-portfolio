import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

function ColorSwatch({ name, cssVar, className }: { name: string; cssVar: string; className: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`size-12 rounded-md border border-border ${className}`} />
      <div>
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-muted-foreground font-mono">{cssVar}</div>
      </div>
    </div>
  );
}

function ColorGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">{children}</div>
    </div>
  );
}

function BrandScale() {
  const steps = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold tracking-tight">Brand</h3>
      <div className="flex gap-1">
        {steps.map((step) => (
          <div key={step} className="flex-1 space-y-1.5 text-center">
            <div
              className="h-12 rounded-md border border-border"
              style={{ backgroundColor: `var(--color-brand-${step})` }}
            />
            <div className="text-xs text-muted-foreground font-mono">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AllColors() {
  return (
    <div className="space-y-8 p-6">
      <ColorGroup title="Base">
        <ColorSwatch name="Background" cssVar="--background" className="bg-background" />
        <ColorSwatch name="Foreground" cssVar="--foreground" className="bg-foreground" />
      </ColorGroup>

      <ColorGroup title="Primary">
        <ColorSwatch name="Primary" cssVar="--primary" className="bg-primary" />
        <ColorSwatch name="Primary Foreground" cssVar="--primary-foreground" className="bg-primary-foreground" />
      </ColorGroup>

      <ColorGroup title="Secondary">
        <ColorSwatch name="Secondary" cssVar="--secondary" className="bg-secondary" />
        <ColorSwatch name="Secondary Foreground" cssVar="--secondary-foreground" className="bg-secondary-foreground" />
      </ColorGroup>

      <ColorGroup title="Muted">
        <ColorSwatch name="Muted" cssVar="--muted" className="bg-muted" />
        <ColorSwatch name="Muted Foreground" cssVar="--muted-foreground" className="bg-muted-foreground" />
      </ColorGroup>

      <ColorGroup title="Accent">
        <ColorSwatch name="Accent" cssVar="--accent" className="bg-accent" />
        <ColorSwatch name="Accent Foreground" cssVar="--accent-foreground" className="bg-accent-foreground" />
      </ColorGroup>

      <ColorGroup title="Destructive">
        <ColorSwatch name="Destructive" cssVar="--destructive" className="bg-destructive" />
        <ColorSwatch name="Destructive Foreground" cssVar="--destructive-foreground" className="bg-destructive-foreground" />
      </ColorGroup>

      <ColorGroup title="Card">
        <ColorSwatch name="Card" cssVar="--card" className="bg-card" />
        <ColorSwatch name="Card Foreground" cssVar="--card-foreground" className="bg-card-foreground" />
      </ColorGroup>

      <ColorGroup title="Popover">
        <ColorSwatch name="Popover" cssVar="--popover" className="bg-popover" />
        <ColorSwatch name="Popover Foreground" cssVar="--popover-foreground" className="bg-popover-foreground" />
      </ColorGroup>

      <ColorGroup title="Border / Input / Ring">
        <ColorSwatch name="Border" cssVar="--border" className="bg-border" />
        <ColorSwatch name="Input" cssVar="--input" className="bg-input" />
        <ColorSwatch name="Ring" cssVar="--ring" className="bg-ring" />
      </ColorGroup>

      <ColorGroup title="Sidebar">
        <ColorSwatch name="Background" cssVar="--sidebar-background" className="bg-sidebar-background" />
        <ColorSwatch name="Foreground" cssVar="--sidebar-foreground" className="bg-sidebar-foreground" />
        <ColorSwatch name="Primary" cssVar="--sidebar-primary" className="bg-sidebar-primary" />
        <ColorSwatch name="Primary Foreground" cssVar="--sidebar-primary-foreground" className="bg-sidebar-primary-foreground" />
        <ColorSwatch name="Accent" cssVar="--sidebar-accent" className="bg-sidebar-accent" />
        <ColorSwatch name="Accent Foreground" cssVar="--sidebar-accent-foreground" className="bg-sidebar-accent-foreground" />
        <ColorSwatch name="Border" cssVar="--sidebar-border" className="bg-sidebar-border" />
        <ColorSwatch name="Ring" cssVar="--sidebar-ring" className="bg-sidebar-ring" />
      </ColorGroup>

      <BrandScale />
    </div>
  );
}

const meta: Meta = {
  title: "Theme/Colors",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const LightMode: Story = {
  render: () => <AllColors />,
};

export const DarkMode: Story = {
  render: () => (
    <div className="dark bg-background text-foreground rounded-lg">
      <AllColors />
    </div>
  ),
};
