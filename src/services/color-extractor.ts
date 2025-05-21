import { Color, PaletteData } from "@/components/color-palette";

interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
  oklch: string;
}

function parseColor(color: string): ColorFormats {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  // Convert to RGB first
  ctx.fillStyle = color;
  const rgbColor = ctx.fillStyle;

  // Create a temporary div to use for conversions
  const div = document.createElement('div');
  div.style.color = rgbColor;

  // Get RGB values
  const rgbMatch = rgbColor.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!rgbMatch) {
    throw new Error('Invalid color format');
  }

  const r = parseInt(rgbMatch[1], 16);
  const g = parseInt(rgbMatch[2], 16);
  const b = parseInt(rgbMatch[3], 16);

  // Convert to HSL
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const l = (max + min) / 2;

  let h, s;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r / 255:
        h = ((g - b) / 255) / d + (g < b ? 6 : 0);
        break;
      case g / 255:
        h = ((b - r) / 255) / d + 2;
        break;
      default:
        h = ((r - g) / 255) / d + 4;
    }
    h *= 60;
  }

  // Convert to OKLCH (approximation)
  // Note: This is a simplified conversion, for accurate OKLCH you'd need a color space library
  const l_oklch = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const c = Math.sqrt(
    Math.pow(0.2126729 * r + 0.7151522 * g + 0.0721750 * b, 2) +
    Math.pow(0.2126729 * r - 0.0721750 * b, 2)
  );

  return {
    hex: rgbColor,
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
    oklch: `oklch(${(l_oklch/255).toFixed(2)} ${(c/255).toFixed(2)} ${Math.round(h)})`
  };
}

function isValidColor(color: string): boolean {
  const s = new Option().style;
  s.color = color;
  return s.color !== "";
}

const ALLOWED_VARIABLES = new Set([
  'radius',
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring'
]);

function normalizeColorName(name: string): string | null {
  // Remove -- prefix
  const baseName = name.replace(/^--/, "");

  // Only return the name if it's in our allowed list
  return ALLOWED_VARIABLES.has(baseName) ? baseName : null;
}

function extractColorsFromStyles(styles: string[]): Color[] | null {
  const colors = new Map<string, ColorFormats>();
  const cssVarRegex =
    /--([^:]+)\s*:\s*((?:hsl|rgb)a?\([^)]+\)|#[a-f0-9]{3,8})/gi;

  for (const style of styles) {
    let match;
    while ((match = cssVarRegex.exec(style)) !== null) {
      const [, name, value] = match;
      if (isValidColor(value)) {
        const normalizedName = normalizeColorName(name.trim());
        if (normalizedName && !colors.has(normalizedName)) {
          try {
            colors.set(normalizedName, parseColor(value.trim()));
          } catch (e) {
            console.warn('Failed to parse color:', value);
          }
        }
      }
    }
  }

  // If we don't have enough colors, look for regular color declarations
  if (colors.size < 6) {
    const colorDeclRegex =
      /([a-z-]+)(?:\s*:\s*|\s+)(#[a-f0-9]{3,8}|(?:hsl|rgb)a?\([^)]+\))/gi;
    for (const style of styles) {
      let match;
      while ((match = colorDeclRegex.exec(style)) !== null) {
        const [, name, value] = match;
        if (isValidColor(value)) {
          const normalizedName = normalizeColorName(name.trim());
          if (normalizedName && !colors.has(normalizedName)) {
            try {
              colors.set(normalizedName, parseColor(value.trim()));
            } catch (e) {
              console.warn('Failed to parse color:', value);
            }
          }
        }
      }
    }
  }

  // Convert the extracted colors to array format
  const result: Color[] = Array.from(colors.entries()).map(([name, value]) => ({
    name,
    value
  }));

  // If we didn't find any colors, return null
  if (result.length === 0) {
    return null;
  }

  return result;
}

export async function extractColorsFromUrl(url: string): Promise<PaletteData | null> {
  if (!url) {
    console.error("No URL provided");
    return null;
  }

  try {
    const response = await fetch(url, {
      mode: "cors",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const styleSheets: string[] = [];

    // Extract <style> tags content
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let match;
    while ((match = styleRegex.exec(html)) !== null) {
      styleSheets.push(match[1]);
    }

    // Extract and fetch external stylesheets
    const linkRegex = /<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/gi;
    while ((match = linkRegex.exec(html)) !== null) {
      try {
        const cssUrl = new URL(match[1], url).toString();
        const cssResponse = await fetch(cssUrl, { mode: "cors" });
        if (cssResponse.ok) {
          const cssText = await cssResponse.text();
          styleSheets.push(cssText);
        }
      } catch (e) {
        console.warn("Failed to fetch external stylesheet:", e);
      }
    }

    // Extract colors from all collected styles
    const colors = extractColorsFromStyles(styleSheets);

    // If no colors were found, return null
    if (!colors) {
      return null;
    }

    return {
      url,
      colors,
      timestamp: new Date(),
    };
  } catch (e) {
    console.error("Failed to extract colors:", e);
    if (e instanceof Error && e.message.includes('CORS')) {
      throw new Error("Cannot access this website due to CORS restrictions. Try a different URL or a website that allows external access.");
    }
    throw new Error("Failed to extract colors from URL. Please check if the URL is valid and accessible.");
  }
}
