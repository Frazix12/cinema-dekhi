import { heroui } from "@heroui/react";

export default heroui({
  themes: {
    light: {
      colors: {
        background: "#f2f6ee",
        foreground: "#161e10",
        primary: {
          DEFAULT: "#3d582d",
          foreground: "#f2f6ee",
        },
        secondary: {
          DEFAULT: "#8dc4bc",
          foreground: "#161e10",
        },
        //@ts-expect-error custom color
        accent: "#47758a",
        "secondary-background": "#e6ece0",
      },
    },
    dark: {
      colors: {
        background: "#0b0f08",
        foreground: "#e7efe0",
        primary: {
          DEFAULT: "#b8d2a8",
          foreground: "#0b0f08",
        },
        secondary: {
          DEFAULT: "#3b726a",
          foreground: "#e7efe0",
        },
        //@ts-expect-error custom color
        accent: "#76a3b8",
        "secondary-background": "#141c0e",
      },
    },
  },
});
