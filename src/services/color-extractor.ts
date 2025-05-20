
import { Color, PaletteData } from "@/components/color-palette";

interface ComputedColor {
  property: string;
  value: string;
  source: 'variable' | 'computed';
}

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

function extractCssVariables(doc: Document): Color[] | null {
  const styleSheets = Array.from(doc.styleSheets);
  const colors = new Map<string, ComputedColor>();
  const root = doc.documentElement;
  const computedStyle = getComputedStyle(root);

  try {
    // First try CSS variables
    for (const sheet of styleSheets) {
      try {
        const rules = Array.from(sheet.cssRules || []);
        for (const rule of rules) {
          if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
            const style = rule.style;
            for (let i = 0; i < style.length; i++) {
              const prop = style[i];
              if (prop.startsWith('--')) {
                const value = computedStyle.getPropertyValue(prop).trim();
                if (isValidColor(value)) {
                  const name = normalizeColorName(prop.replace('--', ''));
                  colors.set(name, {
                    property: prop,
                    value,
                    source: 'variable'
                  });
                }
              }
            }
          }
        }
      } catch (e) {
        console.warn('Could not access stylesheet rules:', e);
      }
    }

    // If we don't have enough colors, look for computed styles
    if (colors.size < 6) {
      const colorProps = [
        'color', 'background-color',
        'border-color', 'outline-color',
        '--primary-color', '--secondary-color',
        '--accent-color', '--background-color',
        '--text-color'
      ];

      for (const prop of colorProps) {
        const value = computedStyle.getPropertyValue(prop).trim();
        if (value && isValidColor(value)) {
          const name = normalizeColorName(prop.replace(/^--/, '').replace(/-color$/, ''));
          if (!colors.has(name)) {
            colors.set(name, {
              property: prop,
              value,
              source: 'computed'
            });
          }
        }
      }
    }
  } catch (e) {
    console.warn('Error accessing stylesheets:', e);
  }

  // Convert the colors map to our Color[] format
  const colorList = Array.from(colors.entries())
    .map(([name, color]) => ({
      name,
      value: color.value
    }));

  return colorList.length > 0 ? colorList : null;
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
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    if (doc.querySelector('parsererror')) {
      throw new Error('Failed to parse HTML content');
    }

    // Try to extract CSS variables and computed styles
    const cssColors = extractCssVariables(doc);

    if (!cssColors || cssColors.length === 0) {
      throw new Error('No colors found in the website');
    }

    // Ensure we have all required colors
    const requiredColors = ['primary', 'secondary', 'accent', 'background', 'text', 'neutral'];
    const missingColors = requiredColors.filter(required =>
      !cssColors.some(color => color.name === required)
    );

    // If we're missing any required colors, generate them from existing ones
    if (missingColors.length > 0) {
      const baseColor = cssColors[0].value;
      const s = new Option().style;
      s.color = baseColor;
      const fallbackColors = missingColors.map(name => ({
        name,
        value: s.color // Use browser's color parsing to normalize the format
      }));
      cssColors.push(...fallbackColors);
    }

    return {
      url,
      colors: cssColors,
      timestamp: new Date()
    };
  } catch (e) {
    console.error('Failed to fetch or parse URL:', e);
    throw new Error('Failed to extract colors from URL');
  }
}
