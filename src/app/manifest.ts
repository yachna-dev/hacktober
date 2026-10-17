import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Deluxe Saloon · डीलक्स सैलून",
    short_name: "Deluxe Saloon",
    description:
      "A nostalgic Indian barbershop radio — 90s Hindi favourites and vintage vinyl crackle.",
    start_url: "/",
    display: "standalone",
    background_color: "#3a1710",
    theme_color: "#3a1710",
    icons: [
      {
        src: "/saloon-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
