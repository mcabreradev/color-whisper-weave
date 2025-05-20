
import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ColorPalette, { PaletteData } from "@/components/color-palette";
import ComponentPreview from "@/components/component-preview";

const Gallery = () => {
  const [selectedPalette, setSelectedPalette] = useState<PaletteData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const palettes: PaletteData[] = [
    {
      url: "github.com",
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
      url: "twitter.com",
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
      url: "netflix.com",
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
    {
      url: "spotify.com",
      colors: [
        { name: "primary", value: "#1DB954" },
        { name: "secondary", value: "#191414" },
        { name: "accent", value: "#FFFFFF" },
        { name: "background", value: "#121212" },
        { name: "text", value: "#FFFFFF" },
        { name: "muted", value: "#B3B3B3" },
      ],
      timestamp: new Date(),
    },
    {
      url: "slack.com",
      colors: [
        { name: "primary", value: "#4A154B" },
        { name: "secondary", value: "#36C5F0" },
        { name: "accent", value: "#ECB22E" },
        { name: "background", value: "#FFFFFF" },
        { name: "text", value: "#1D1C1D" },
        { name: "muted", value: "#616061" },
      ],
      timestamp: new Date(),
    },
    {
      url: "airbnb.com",
      colors: [
        { name: "primary", value: "#FF5A5F" },
        { name: "secondary", value: "#00A699" },
        { name: "accent", value: "#FC642D" },
        { name: "background", value: "#FFFFFF" },
        { name: "text", value: "#484848" },
        { name: "muted", value: "#767676" },
      ],
      timestamp: new Date(),
    },
  ];
  
  const filteredPalettes = palettes.filter(palette => 
    palette.url.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handlePaletteSelect = (palette: PaletteData) => {
    setSelectedPalette(palette);
    // Scroll to the top smoothly when selecting a palette
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container py-16">
          <h1 className="font-bold mb-6 gradient-text">Color Palette Gallery</h1>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Browse our collection of pre-extracted color palettes from popular websites. 
            Select any palette to view details and component previews.
          </p>
          
          {selectedPalette && (
            <div className="mb-12">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-medium">Selected Palette</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedPalette(null)}
                >
                  Close Preview
                </Button>
              </div>
              <ColorPalette palette={selectedPalette} />
              <ComponentPreview palette={selectedPalette} />
            </div>
          )}
          
          <div className="mb-8 max-w-md">
            <Label htmlFor="search">Search Palettes</Label>
            <Input 
              id="search"
              type="text"
              placeholder="Search by website name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-2"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredPalettes.map((palette, index) => (
              <div 
                key={index} 
                className="rounded-xl overflow-hidden border bg-card shadow-sm hover:shadow-md transition-shadow"
                onClick={() => handlePaletteSelect(palette)}
              >
                <div className="h-32 flex">
                  {palette.colors.map((color, i) => (
                    <div 
                      key={i} 
                      className="h-full flex-1" 
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">{palette.url}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {palette.colors.length} colors
                  </p>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredPalettes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No palettes found matching '{searchTerm}'</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Gallery;
