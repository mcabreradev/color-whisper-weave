import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface Color {
  name: string;
  value: {
    hex: string;
    rgb: string;
    hsl: string;
    oklch: string;
  };
}

export interface PaletteData {
  url: string;
  colors: Color[];
  timestamp: Date;
}

interface ColorPaletteProps {
  palette: PaletteData | null;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ palette }) => {
  const { toast } = useToast();
  const [colorFormat, setColorFormat] = React.useState<keyof Color["value"]>("hex");

  if (!palette || !palette.colors?.length) {
    return null;
  }

  const copyToClipboard = async (text: string | undefined, description: string) => {
    if (!text) {
      toast({
        title: "Error",
        description: "Color format not available",
        variant: "destructive",
      });
      return;
    }

    try {
      // Try the modern clipboard API first
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback to the older execCommand method
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (!successful) throw new Error('Copy command failed');
      }

      toast({
        title: "Copied!",
        description: description,
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard. Please try copying manually.",
        variant: "destructive",
      });
    }
  };

  const generateTailwindConfig = () => {
    const config = palette.colors.reduce((acc, color) => {
      const value = color.value?.[colorFormat];
      if (value) {
        acc[color.name] = value;
      }
      return acc;
    }, {} as Record<string, string>);

    return `module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(config, null, 2)}
    }
  }
}`;
  };

  const generateCSSVariables = () => {
    const variables = palette.colors
      .filter(color => color.value?.[colorFormat])
      .map((color) => `  --${color.name}: ${color.value[colorFormat]};`)
      .join("\n");

    return `:root {\n${variables}\n}`;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Color Palette</h2>
        <div className="space-x-2 flex items-center">
          <Tabs value={colorFormat} onValueChange={(v) => setColorFormat(v as keyof Color["value"])}>
            <TabsList>
              <TabsTrigger value="hex">HEX</TabsTrigger>
              <TabsTrigger value="rgb">RGB</TabsTrigger>
              <TabsTrigger value="hsl">HSL</TabsTrigger>
              <TabsTrigger value="oklch">OKLCH</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            onClick={() => copyToClipboard(generateTailwindConfig(), "Tailwind config copied to clipboard")}
          >
            Copy as Tailwind Config
          </Button>
          <Button
            variant="outline"
            onClick={() => copyToClipboard(generateCSSVariables(), "CSS variables copied to clipboard")}
          >
            Copy as CSS Variables
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {palette.colors.map((color) => (
          <div
            key={color.name}
            className="rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => copyToClipboard(
              color.value?.[colorFormat],
              `${color.name} color copied to clipboard`
            )}
          >
            <div
              className="p-6 rounded-t-lg"
              style={{ backgroundColor: color.value?.hex || "#000000" }}
            ></div>
            <div className="p-4">
              <h3 className="font-semibold">{color.name}</h3>
              <p className="text-sm text-muted-foreground break-all">
                {color.value?.[colorFormat] || "Format not available"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;
