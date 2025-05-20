
import { Color, PaletteData } from "@/components/ColorPalette";

// In a real implementation, this would be an API call or use a server-side service
// For the demo, we'll use mock data with a fake delay
export async function extractColorsFromUrl(url: string): Promise<PaletteData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate a pseudo-random palette based on the URL string to simulate different results
  const seed = Array.from(url).reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = (n: number) => ((seed * (n + 1)) % 255).toString(16).padStart(2, '0');
  
  // Select one of several pre-defined palettes for the demo
  const palettes = [
    // Blue-focused palette
    [
      { name: "primary", value: `#3366${rand(1)}` },
      { name: "secondary", value: `#6699${rand(2)}` },
      { name: "accent", value: `#ff66${rand(3)}` },
      { name: "background", value: `#f8f${rand(4)}f` },
      { name: "text", value: `#33${rand(5)}6` },
      { name: "neutral", value: `#${rand(6)}${rand(7)}${rand(8)}` },
    ],
    // Green-focused palette
    [
      { name: "primary", value: `#33${rand(9)}5` },
      { name: "secondary", value: `#66${rand(10)}8` },
      { name: "accent", value: `#ffcc${rand(11)}` },
      { name: "background", value: `#f${rand(12)}ff` },
      { name: "text", value: `#2${rand(13)}33` },
      { name: "neutral", value: `#${rand(14)}${rand(15)}${rand(16)}` },
    ],
    // Purple-focused palette
    [
      { name: "primary", value: `#66${rand(17)}cc` },
      { name: "secondary", value: `#99${rand(18)}ff` },
      { name: "accent", value: `#ff${rand(19)}66` },
      { name: "background", value: `#f${rand(20)}ff` },
      { name: "text", value: `#${rand(21)}33${rand(22)}` },
      { name: "neutral", value: `#${rand(23)}${rand(24)}${rand(25)}` },
    ],
  ];
  
  // Choose a palette based on the URL
  const paletteIndex = seed % palettes.length;
  const colors = palettes[paletteIndex];
  
  return {
    url,
    colors,
    timestamp: new Date(),
  };
}
