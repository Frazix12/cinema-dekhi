import { Outfit as FontOutfit, Saira as FontSaira, Playfair_Display as FontPlayfair } from "next/font/google";

// NOTE: This export is intentionally named "Poppins" and uses "--font-poppins" for
// backwards compatibility. The actual font loaded is Outfit (FontOutfit). Do not
// rename without also updating layout.tsx (Poppins.className) and globals.css (--font-poppins).
export const Poppins = FontOutfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const Saira = FontSaira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-saira",
});

export const Playfair = FontPlayfair({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});
