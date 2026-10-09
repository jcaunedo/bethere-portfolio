/**
 * Prototype navigation between Storybook stories — how the reference layouts link to each other
 * (e.g. signing in from Sign-Up/Sign-In opens the Provider Portal; logging out returns to it). Story-only: not exported from
 * the package, and not how a consuming app navigates.
 */

/** Story ids the prototype links to. */
const PROTOTYPE_STORIES = {
  providerPortal: "layouts-providerportal-portal--default",
  /** The portal on Listings with the New Listing flow already open (onboarding's "Create my first listing"). */
  providerPortalNewListing: "layouts-providerportal-portal--new-listing",
  signIn: "layouts-shared-signupsignin--default",
  /** New users' first step after signing in: "Tell us about your business". */
  onboardingBusinessProfile: "layouts-providerportal-businessprofile--default",
} as const;

/**
 * Opens a story by id. Inside the Storybook UI it switches the whole manager to that story (so the
 * sidebar selection and URL follow); opened on its own (`iframe.html`) it loads the story's iframe.
 */
function openStory(id: string) {
  const inManager = window.top !== null && window.top !== window.self;
  if (inManager) {
    window.top!.location.href = `${window.top!.location.pathname}?path=/story/${id}`;
  } else {
    window.location.href = `iframe.html?id=${id}&viewMode=story`;
  }
}

export { PROTOTYPE_STORIES, openStory };
