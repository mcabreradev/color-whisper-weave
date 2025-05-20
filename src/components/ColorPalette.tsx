
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface Color {
  name: string;
  value: string;
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

  if (!palette || palette.colors.length === 0) {
    return null;
  }

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied!",
          description: description,
        });
      },
      (err) => {
        toast({
          title: "Failed to copy",
          description: "Could not copy to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  const generateTailwindConfig = () => {
    const colorConfig = palette.colors.reduce((acc, color) => {
      acc[color.name] = color.value;
      return acc;
    }, {} as Record<string, string>);

    return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(colorConfig, null, 2)}
    }
  }
}`;
  };

  const generateCssVariables = () => {
    return `:root {
${palette.colors.map((color) => `  --color-${color.name}: ${color.value};`).join("\n")}
}`;
  };

  const generateJsonFormat = () => {
    return JSON.stringify(
      {
        source: palette.url,
        colors: palette.colors.reduce((acc, color) => {
          acc[color.name] = color.value;
          return acc;
        }, {} as Record<string, string>),
        timestamp: palette.timestamp.toISOString()
      },
      null,
      2
    );
  };

  return (
    <div className="mt-8 w-full">
      <h2 className="font-bold text-2xl mb-4">Extracted Color Palette</h2>
      <p className="text-muted-foreground mb-6">
        From URL: <span className="font-medium text-foreground">{palette.url}</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {palette.colors.map((color) => (
          <div
            key={color.name}
            className="color-card bg-card"
            onClick={() => copyToClipboard(color.value, `Copied ${color.value}`)}
          >
            <div className="flex items-center gap-3">
              <div 
                className="color-swatch" 
                style={{ backgroundColor: color.value }}
              ></div>
              <div>
                <p className="font-medium">{color.name}</p>
                <p className="text-sm text-muted-foreground">{color.value}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Copy
            </Button>
          </div>
        ))}
      </div>

      <Tabs defaultValue="tailwind" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="tailwind">Tailwind CSS</TabsTrigger>
          <TabsTrigger value="css">CSS Variables</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>
        <TabsContent value="tailwind" className="relative">
          <pre className="p-4 rounded-lg bg-muted/50 overflow-auto max-h-64">
            <code>{generateTailwindConfig()}</code>
          </pre>
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-3 right-3"
            onClick={() => copyToClipboard(generateTailwindConfig(), "Tailwind config copied to clipboard")}
          >
            Copy
          </Button>
        </TabsContent>
        <TabsContent value="css" className="relative">
          <pre className="p-4 rounded-lg bg-muted/50 overflow-auto max-h-64">
            <code>{generateCssVariables()}</code>
          </pre>
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-3 right-3"
            onClick={() => copyToClipboard(generateCssVariables(), "CSS variables copied to clipboard")}
          >
            Copy
          </Button>
        </TabsContent>
        <TabsContent value="json" className="relative">
          <pre className="p-4 rounded-lg bg-muted/50 overflow-auto max-h-64">
            <code>{generateJsonFormat()}</code>
          </pre>
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-3 right-3"
            onClick={() => copyToClipboard(generateJsonFormat(), "JSON format copied to clipboard")}
          >
            Copy
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ColorPalette;
