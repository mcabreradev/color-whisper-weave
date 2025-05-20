
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaletteData } from "./color-palette";

interface ComponentPreviewProps {
  palette: PaletteData | null;
}

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ palette }) => {
  if (!palette || palette.colors.length === 0) {
    return null;
  }

  // Find colors by semantic names or use defaults
  const findColor = (name: string) => {
    const color = palette.colors.find(c => c.name.toLowerCase().includes(name.toLowerCase()));
    return color ? color.value : undefined;
  };

  const primary = findColor('primary') || '#4F46E5';
  const secondary = findColor('secondary') || '#8B5CF6';
  const accent = findColor('accent') || '#EC4899';
  const background = findColor('background') || '#F9FAFB';
  const text = findColor('text') || findColor('font') || '#111827';

  // Generate custom styles for preview
  const customStyles = `
    .preview-primary { background-color: ${primary}; color: white; }
    .preview-secondary { background-color: ${secondary}; color: white; }
    .preview-accent { background-color: ${accent}; color: white; }
    .preview-bg { background-color: ${background}; color: ${text}; }
    .preview-text { color: ${text}; }
    .preview-border { border-color: ${primary}; }
  `;
  
  return (
    <div className="mt-12 mb-8 w-full">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <h2 className="font-bold text-2xl mb-4">Component Preview</h2>
      <p className="text-muted-foreground mb-6">
        See how your extracted colors look with common UI components
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="preview-bg preview-border border-2">
          <CardHeader>
            <CardTitle className="preview-text">Card Title</CardTitle>
            <CardDescription>Card description with extracted colors</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="preview-text">This card is using your extracted color palette.</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button className="preview-primary">Primary Button</Button>
            <Button variant="outline" className="preview-border preview-text">Outline</Button>
          </CardFooter>
        </Card>
        
        <div className="space-y-4">
          <Tabs defaultValue="buttons" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="buttons">Buttons</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
            </TabsList>
            <TabsContent value="buttons" className="p-4 space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button className="preview-primary">Primary</Button>
                <Button className="preview-secondary">Secondary</Button>
                <Button className="preview-accent">Accent</Button>
                <Button variant="outline" className="preview-border preview-text">Outline</Button>
                <Button variant="ghost" className="preview-text">Ghost</Button>
              </div>
            </TabsContent>
            <TabsContent value="colors" className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {palette.colors.map((color) => (
                  <div key={color.name} className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-full" 
                      style={{ backgroundColor: color.value }}
                    ></div>
                    <span className="text-sm font-medium">{color.name}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="p-4 rounded-lg border preview-bg">
            <h3 className="font-medium mb-2 preview-text">Typography Example</h3>
            <p className="text-sm preview-text">
              This text uses your extracted colors to demonstrate how typography would look with your palette.
            </p>
            <div className="mt-3 flex gap-2">
              <div className="w-3 h-3 rounded-full preview-primary"></div>
              <div className="w-3 h-3 rounded-full preview-secondary"></div>
              <div className="w-3 h-3 rounded-full preview-accent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentPreview;
