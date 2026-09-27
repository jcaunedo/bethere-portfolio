import type { Preview } from "@storybook/react-vite";
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    options: {
      // Keep Storybook's default (file) order everywhere, except New Listing: its steps
      // read in wizard order, after the Flow and Shell entries. Storybook serializes this
      // function and evals it as plain JS: keep it self-contained and free of TS syntax.
      storySort: (a, b) => {
        const newListingOrder = [
          "Flow",
          "Shell",
          "Type",
          "Category",
          "Search",
          "Matches",
          "Attributes",
          "Expectations",
          "Availability",
        ];
        const rank = (title) => {
          const match = /^Layouts\/NewListing\/(.+)$/.exec(title);
          return match ? newListingOrder.indexOf(match[1]) : -1;
        };
        const rankA = rank(a.title);
        const rankB = rank(b.title);
        return rankA >= 0 && rankB >= 0 ? rankA - rankB : 0;
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
