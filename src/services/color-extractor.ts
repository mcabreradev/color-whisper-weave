import { Color, PaletteData } from "@/components/color-palette";

function isValidColor(color: string): boolean {
  const s = new Option().style;
  s.color = color;
  return s.color !== "";
}

function normalizeColorName(name: string): string {
  // Remove -- prefix and -foreground suffix
  const baseName = name.replace(/^--/, "").replace(/-foreground$/, "");

  // Map shadcn/ui variables to our color names
  switch (baseName) {
    case "primary":
    case "secondary":
    case "accent":
      return baseName;
    case "background":
    case "card":
    case "popover":
      return "background";
    case "foreground":
      return "text";
    case "muted":
    case "border":
    case "input":
    case "ring":
      return "neutral";
    default:
      return baseName;
  }
}

function extractColorsFromStyles(styles: string[]): Color[] {
  const colors = new Map<string, string>();
  const cssVarRegex =
    /--([^:]+)\s*:\s*((?:hsl|rgb)a?\([^)]+\)|#[a-f0-9]{3,8})/gi;

  for (const style of styles) {
    let match;
    while ((match = cssVarRegex.exec(style)) !== null) {
      const [, name, value] = match;
      if (isValidColor(value)) {
        const normalizedName = normalizeColorName(name.trim());
        if (!colors.has(normalizedName)) {
          colors.set(normalizedName, value.trim());
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
          if (!colors.has(normalizedName)) {
            colors.set(normalizedName, value.trim());
          }
        }
      }
    }
  }

  // Ensure we have all required colors
  const requiredColors = [
    "primary",
    "secondary",
    "accent",
    "background",
    "text",
    "neutral",
  ];
  const result: Color[] = [];

  // Default colors if not found
  const defaultColors = new Map([
    ["background", "#ffffff"],
    ["text", "#000000"],
    ["primary", "#3b82f6"],
    ["secondary", "#6b7280"],
    ["accent", "#f59e0b"],
    ["neutral", "#9ca3af"],
  ]);

  for (const name of requiredColors) {
    result.push({
      name,
      value: colors.get(name) || defaultColors.get(name)!,
    });
  }

  return result;
}

export async function extractColorsFromUrl(url: string): Promise<PaletteData> {
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

    return {
      url,
      colors,
      timestamp: new Date(),
    };
  } catch (e) {
    console.error("Failed to extract colors:", e);
    throw new Error("Failed to extract colors from URL");
  }
}
