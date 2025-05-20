
import React from "react";
import { Button } from "@/components/ui/button";
import { PaletteData } from "./color-palette";

interface ExampleGalleryProps {
  onSelectExample: (palette: PaletteData) => void;
}

const ExampleGallery: React.FC<ExampleGalleryProps> = ({ onSelectExample }) => {
  const examples: PaletteData[] = [
    {
      url: "example.com/github",
      colors: [
        { name: "primary", value: "#0366D6" },
        { name: "secondary", value: "#24292E" },
        { name: "accent", value: "#2EA44F" },
        { name: "background", value: "#F6F8FA" },
        { name: "text", value: "#24292E" },
        { name: "muted", value: "#6A737D" },
      ],
      timestamp: new Date(),
    },
    {
      url: "example.com/twitter",
      colors: [
        { name: "primary", value: "#1DA1F2" },
        { name: "secondary", value: "#14171A" },
        { name: "accent", value: "#794BC4" },
        { name: "background", value: "#FFFFFF" },
        { name: "text", value: "#14171A" },
        { name: "muted", value: "#657786" },
      ],
      timestamp: new Date(),
    },
    {
      url: "example.com/netflix",
      colors: [
        { name: "primary", value: "#E50914" },
        { name: "secondary", value: "#221F1F" },
        { name: "accent", value: "#F5F5F1" },
        { name: "background", value: "#000000" },
        { name: "text", value: "#FFFFFF" },
        { name: "muted", value: "#B3B3B3" },
      ],
      timestamp: new Date(),
    },
  ];

  return (
    <div className="mt-8 mb-12">
      <h2 className="font-bold text-2xl mb-2">Example Palettes</h2>
      <p className="text-muted-foreground mb-6">
        Try out these pre-extracted color palettes from popular websites
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {examples.map((example, index) => (
          <div key={index} className="rounded-xl overflow-hidden border bg-card shadow-sm">
            <div className="h-32 flex">
              {example.colors.map((color, i) => (
                <div
                  key={i}
                  className="h-full flex-1"
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-1">{example.url.replace('example.com/', '')}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {example.colors.length} colors
              </p>
              <Button
                onClick={() => onSelectExample(example)}
                variant="outline"
                className="w-full"
              >
                Use This Palette
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExampleGallery;
