import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import UrlForm from "@/components/url-form";
import ColorPalette, { PaletteData } from "@/components/color-palette";
import ComponentPreview from "@/components/component-preview";
import ExampleGallery from "@/components/example-gallery";
import { extractColorsFromUrl } from "@/services/color-extractor";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [palette, setPalette] = useState<PaletteData | null>(null);
  const { toast } = useToast();

  const handleUrlSubmit = async (url: string) => {
    setIsLoading(true);
    try {
      const extractedPalette = await extractColorsFromUrl(url);
      setPalette(extractedPalette);
      toast({
        title: "Extraction complete!",
        description: `Successfully extracted ${extractedPalette.colors.length} colors from ${url}`,
      });
    } catch (error) {
      console.error("Error extracting colors:", error);
      toast({
        title: "Extraction failed",
        description:
          "Could not extract colors from this URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleSelect = (examplePalette: PaletteData) => {
    setPalette(examplePalette);
    toast({
      title: "Example loaded",
      description: `Loaded palette from ${examplePalette.url}`,
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-grow">
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="font-bold mb-4 gradient-text">
                Extract Color Palettes from Any Website
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Input a URL, and we'll analyze the website to extract its color
                palette. Export to Tailwind, CSS variables, or JSON format.
              </p>
              <div className="max-w-2xl mx-auto">
                <UrlForm onSubmit={handleUrlSubmit} isLoading={isLoading} />
              </div>
            </div>

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="mt-4 text-muted-foreground">
                  Extracting colors from website...
                </p>
              </div>
            )}

            {palette && (
              <div className="max-w-4xl mx-auto fade-in">
                <ColorPalette palette={palette} />
                <ComponentPreview palette={palette} />
              </div>
            )}

            {!isLoading && !palette && (
              <div className="max-w-5xl mx-auto">
                <ExampleGallery onSelectExample={handleExampleSelect} />

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center p-6 rounded-xl border bg-card">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 4V20M4 12H20"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h3 className="font-medium text-lg mb-2">Extract Colors</h3>
                    <p className="text-muted-foreground">
                      Enter any website URL and extract its color palette
                      automatically
                    </p>
                  </div>

                  <div className="text-center p-6 rounded-xl border bg-card">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V15M21 9L13 17L9 13M21 3V9H15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h3 className="font-medium text-lg mb-2">Export Formats</h3>
                    <p className="text-muted-foreground">
                      Export to Tailwind CSS, CSS variables, or JSON with one
                      click
                    </p>
                  </div>

                  <div className="text-center p-6 rounded-xl border bg-card">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 21V8M4 8L12 3L20 8M4 8L12 13M20 21V8M20 8L12 13M12 13V21"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h3 className="font-medium text-lg mb-2">
                      Preview Components
                    </h3>
                    <p className="text-muted-foreground">
                      See how your extracted colors look with common UI
                      components
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
