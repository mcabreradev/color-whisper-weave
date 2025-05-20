
import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary via-accent to-secondary"></div>
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl md:text-2xl gradient-text">Palette Picker</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/gallery" className="text-muted-foreground hover:text-foreground transition-colors">
            Gallery
          </Link>
          <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
