
import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-bold mb-6 gradient-text">About Palette Picker</h1>
            
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-medium mb-4">Our Mission</h2>
                <p className="text-muted-foreground mb-4">
                  Palette Picker aims to simplify the process of extracting and using color palettes from websites. 
                  Our tool helps designers and developers quickly analyze and implement existing color schemes in their own projects.
                </p>
                <p className="text-muted-foreground">
                  Whether you're looking for inspiration or trying to match a specific brand's colors, 
                  Palette Picker provides you with the exact colors in formats you can immediately use in your projects.
                </p>
              </CardContent>
            </Card>
            
            <h2 className="text-2xl font-medium mb-4">How It Works</h2>
            <div className="space-y-6 mb-12">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-medium">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Enter a URL</h3>
                  <p className="text-muted-foreground">
                    Input any website URL into our analyzer. We accept any publicly accessible website.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-medium">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Analysis Process</h3>
                  <p className="text-muted-foreground">
                    Our algorithm examines the website's CSS, extracts color information, and identifies the primary color scheme.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-medium">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Semantic Organization</h3>
                  <p className="text-muted-foreground">
                    Colors are automatically categorized into semantic roles like primary, secondary, accent, and background.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-medium">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Export & Use</h3>
                  <p className="text-muted-foreground">
                    Export the palette in your preferred format and see how it looks with common UI components.
                  </p>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-medium mb-4">Technologies Used</h2>
            <ul className="list-disc pl-6 mb-12 space-y-2 text-muted-foreground">
              <li>React with TypeScript for the frontend</li>
              <li>Tailwind CSS for styling</li>
              <li>shadcn/ui for component library</li>
              <li>TanStack Query for data fetching</li>
              <li>Color analysis algorithms</li>
            </ul>
            
            <h2 className="text-2xl font-medium mb-4">Future Features</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Account creation to save your favorite palettes</li>
              <li>Palette sharing via unique URLs</li>
              <li>Dark/light mode detection</li>
              <li>Font extraction alongside colors</li>
              <li>Advanced palette manipulation tools</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
