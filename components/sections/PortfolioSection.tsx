import React from "react";
import { BackgroundImageTexture } from "@/components/ui/bg-image-texture";

export function PortfolioSection() {
  return (
    <section className="w-full" id="work">
      <BackgroundImageTexture variant="fabric-of-squares" opacity={0.3} className="flex flex-col gap-4 mt-32 lg:mt-48 py-12 lg:py-24 px-4 mb-20">
      <div className="flex flex-col lg:flex-row gap-2 items-center justify-center">
        <span className="text-3xl lg:text-6xl font-semibold">Products Built With</span>
        <span className="flex flex-wrap whitespace-pre-wrap relative px-2 sm:px-2 md:px-3 bg-primary text-primary-foreground text-3xl lg:text-6xl overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center">
          <span className="sr-only">Love</span>
          <span aria-hidden="true">Love</span>
        </span>
      </div>
      
      <span className="text-muted-foreground text-center text-lg mt-4 max-w-2xl mx-auto">
        I make sure to ship products that are not only <span className="bg-primary text-primary-foreground px-2 inline-block">functional</span> but also <span className="bg-primary text-primary-foreground px-2 inline-block">beautiful</span> and <span className="bg-primary text-primary-foreground px-2 inline-block">easy to use</span>.
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mt-16 w-full">
        {/* Placeholder cards for portfolio items */}
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="aspect-video bg-muted/30 border border-border flex items-center justify-center hover:border-primary transition-colors cursor-pointer group overflow-hidden">
            <span className="text-muted-foreground group-hover:text-foreground transition-colors font-mono tracking-widest text-sm uppercase">Project {item}</span>
          </div>
        ))}
      </div>
      </BackgroundImageTexture>
    </section>
  );
}
