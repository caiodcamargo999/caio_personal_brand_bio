"use client";

import React from "react";
import { Mail, MapPin, Twitter, Instagram, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactFooter() {
  return (
    <div className="relative flex w-full items-center justify-center p-4 my-20">
      <div className="mx-auto max-w-7xl w-full">
        <div className="bg-card/40 backdrop-blur-md border border-border relative grid h-full w-full md:grid-cols-2 lg:grid-cols-3">
          
          <div className="flex flex-col justify-between lg:col-span-2">
            <div className="relative h-full space-y-8 px-6 py-10 md:p-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl tracking-tight">Get in touch</h2>
                <p className="text-muted-foreground max-w-xl text-base md:text-lg leading-relaxed">
                  If you have any questions regarding my Services or need help, please fill out the form here. I do my best to respond within 1 business day.
                </p>
              </div>
              
              <div className="grid gap-8 md:grid-cols-2 pt-4">
                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 mt-1 text-muted-foreground" />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Email</span>
                    <span className="text-base font-medium">contact@caiodcamargo.com</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 mt-1 text-muted-foreground" />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Location</span>
                    <span className="text-base font-medium">
                      Dubai • Bali • Brazil
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row flex-wrap gap-6 pt-8">
                <a target="_blank" rel="noopener noreferrer" href="https://x.com/caiodcamargo" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/caiodcamargo/" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/caiodecamargo/" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 flex h-full w-full items-center border-t border-border p-6 md:col-span-1 md:border-t-0 md:border-l md:p-10">
            <form className="w-full space-y-6" onSubmit={(e) => { e.preventDefault(); window.open('https://calendly.com/connect-heyfabrika/30min', '_blank'); }}>
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="name">Name</label>
                <input 
                  className="flex h-12 w-full rounded-none border border-border bg-background px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                  placeholder="Enter your name" 
                  id="name" 
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <input 
                  type="email"
                  className="flex h-12 w-full rounded-none border border-border bg-background px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                  placeholder="Enter your email" 
                  id="email" 
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="message">Message</label>
                <textarea 
                  className="flex min-h-[120px] w-full rounded-none border border-border bg-background px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y" 
                  placeholder="Enter your message" 
                  id="message" 
                  required
                ></textarea>
              </div>
              <Button type="submit" size="lg" className="w-full rounded-none h-14 text-base font-medium mt-4 group">
                Send Message
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
