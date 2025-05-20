import { Color, PaletteData } from "@/components/color-palette";

function isValidColor(color: string): boolean {
  const s = new Option().style;
  s.color = color;
  return s.color !== '';
}

function normalizeColorName(name: string): string {
  // Map common color property names to our palette names
  const nameMap: { [key: string]: string } = {
    'primary': ['primary', 'main', 'brand'].join('|'),
    'secondary': ['secondary', 'accent-1'].join('|'),
    'accent': ['accent', 'highlight', 'accent-2'].join('|'),
    'background': ['background', 'bg', 'surface'].join('|'),
    'text': ['text', 'font', 'foreground', 'fg'].join('|'),
    'neutral': ['neutral', 'gray', 'grey'].join('|')
  };

  for (const [key, patterns] of Object.entries(nameMap)) {
    if (new RegExp(patterns, 'i').test(name)) {
      return key;
    }
  }
  return name;
}

function extractColorsFromStyles(styles: string[]): Color[] {
  const colors = new Map<string, string>();
  const colorRegex = /(#[a-f0-9]{3,8}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\))/gi;
  const variableRegex = /--([^:]+):\s*(#[a-f0-9]{3,8}|rgb[a-z]?\([^)]+\)|hsl[a-z]?\([^)]+\))/gi;

  // First try to find CSS variables
  for (const style of styles) {
    let match;
    while ((match = variableRegex.exec(style)) !== null) {
      const name = match[1].trim();
      const value = match[2].trim();
      if (isValidColor(value)) {
        const normalizedName = normalizeColorName(name);
        colors.set(normalizedName, value);
      }
    }
  }

  // If we don't have enough colors, look for any color values with context
  if (colors.size < 6) {
    for (const style of styles) {
      let match;
      const styleText = style.toLowerCase();
      while ((match = colorRegex.exec(style)) !== null) {
        const value = match[1].trim();
        if (isValidColor(value)) {
          // Look at context before the color
          const beforeContext = style.substring(Math.max(0, match.index - 30), match.index).toLowerCase();
          let name;

          if (beforeContext.includes('primary') || beforeContext.includes('brand')) {
            name = 'primary';
          } else if (beforeContext.includes('secondary')) {
            name = 'secondary';
          } else if (beforeContext.includes('accent') || beforeContext.includes('highlight')) {
            name = 'accent';
          } else if (beforeContext.includes('background') || beforeContext.includes('bg')) {
            name = 'background';
          } else if (beforeContext.includes('text') || beforeContext.includes('font')) {
            name = 'text';
          } else if (beforeContext.includes('neutral') || beforeContext.includes('gray') || beforeContext.includes('grey')) {
            name = 'neutral';
          }

          if (name && !colors.has(name)) {
            colors.set(name, value);
          }
        }
      }

      // Try to extract background-color and color properties
      const bgColorMatch = style.match(/background(?:-color)?:\s*([^;}"']+)/i);
      const textColorMatch = style.match(/(?:^|[^-])color:\s*([^;}"']+)/i);

      if (bgColorMatch && isValidColor(bgColorMatch[1]) && !colors.has('background')) {
        colors.set('background', bgColorMatch[1].trim());
      }
      if (textColorMatch && isValidColor(textColorMatch[1]) && !colors.has('text')) {
        colors.set('text', textColorMatch[1].trim());
      }
    }
  }

  // Convert to Color array and handle missing colors
  const colorList: Color[] = [];
  const requiredColors = ['primary', 'secondary', 'accent', 'background', 'text', 'neutral'];

  // Ensure we have background and text colors
  if (!colors.has('background')) colors.set('background', '#ffffff');
  if (!colors.has('text')) colors.set('text', '#000000');

  // Generate missing colors with good contrast
  for (const name of requiredColors) {
    if (colors.has(name)) {
      colorList.push({ name, value: colors.get(name)! });
    } else {
      // For missing colors, generate them based on existing ones
      const baseColor = colors.get('primary') || '#000000';
      const s = new Option().style;
      s.color = baseColor;
      const value = name === 'background' ? '#ffffff' :
                   name === 'text' ? '#000000' :
                   s.color;
      colorList.push({ name, value });
    }
  }

  return colorList;
}

export async function extractColorsFromUrl(url: string): Promise<PaletteData> {
  try {
    // Validate URL
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Only HTTP and HTTPS URLs are supported');
    }

    // Attempt to fetch with CORS mode
    const response = await fetch(url, {
      mode: 'cors',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Extract all <style> tags content
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    const styleSheets: string[] = [];
    let styleMatch;
    while ((styleMatch = styleRegex.exec(html)) !== null) {
      styleSheets.push(styleMatch[1]);
    }

    // Extract all <link rel="stylesheet"> contents
    const linkRegex = /<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/gi;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(html)) !== null) {
      try {
        const cssUrl = new URL(linkMatch[1], url).toString();
        const cssResponse = await fetch(cssUrl, { mode: 'cors' });
        if (cssResponse.ok) {
          const cssText = await cssResponse.text();
          styleSheets.push(cssText);
        }
      } catch (e) {
        console.warn('Failed to fetch external stylesheet:', e);
      }
    }

    // Add any inline styles from elements
    const inlineStyleRegex = /style="[^"]*color[^"]*"/gi;
    const inlineStyles = html.match(inlineStyleRegex) || [];
    styleSheets.push(...inlineStyles);

    // Try to extract colors from all collected styles
    const colors = extractColorsFromStyles(styleSheets);

    if (!colors || colors.length === 0) {
      // Fallback to default theme colors
      const colors = [
        { name: 'primary', value: '#3b82f6' },    // Blue
        { name: 'secondary', value: '#6b7280' },  // Gray
        { name: 'accent', value: '#f59e0b' },     // Amber
        { name: 'background', value: '#ffffff' },  // White
        { name: 'text', value: '#111827' },       // Dark Gray
        { name: 'neutral', value: '#9ca3af' }     // Medium Gray
      ];

      return {
        url,
        colors,
        timestamp: new Date()
      };
    }

    return {
      url,
      colors,
      timestamp: new Date()
    };
  } catch (e) {
    console.error('Failed to fetch or parse URL:', e);
    throw new Error('Failed to extract colors from URL');
  }
}
