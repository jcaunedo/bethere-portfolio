import { PortalPageHeader } from "../provider-portal";

/**
 * Provider Portal — Home (dashboard): for now, the welcome header only.
 * Figma: Provider Portal "Dashboard (Home)" (node 886:10115).
 */
function HomePage({ firstName }: { firstName: string }) {
  return <PortalPageHeader title={`Welcome ${firstName}`} />;
}

export { HomePage };
