"use client";

import {
  ClaudeAIWordmark,
  CursorWordmark,
  GithubWordmark,
  GoogleWordmark,
  OpenAIWordmark,
} from "@aliimam/logos";

import { Marquee } from "@/components/ui/marquee";
import { SiGoogleads, SiMeta } from "react-icons/si";
import { IoLogoTiktok } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";

export function StackSection() {
  return (
    <section className="flex flex-col h-full w-full items-center justify-center overflow-hidden py-24 bg-white/40 dark:bg-black/40 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <main className="w-full">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
          My <span className="text-blue-600">Tech & Growth</span> Stack
        </h2>
        <Marquee gap={"80px"} speed={30} fade={true} pauseOnHover={true}>
          <div className="flex items-center text-zinc-800 dark:text-zinc-200">
            <OpenAIWordmark size={100} />
          </div>
          <div className="flex items-center text-zinc-800 dark:text-zinc-200">
            <ClaudeAIWordmark size={100} />
          </div>
          <div className="flex items-center text-zinc-800 dark:text-zinc-200">
            <CursorWordmark size={100} />
          </div>
          <div className="flex items-center text-zinc-800 dark:text-zinc-200">
            <GithubWordmark size={100} />
          </div>
          <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 mr-10">
            <FcGoogle size={45} />
            <span className="text-3xl font-bold tracking-tight">Google Antigravity</span>
          </div>

          <div className="flex items-center gap-3 text-zinc-800 dark:text-zinc-200">
            <SiMeta size={45} className="text-[#0668E1]" />
            <span className="text-2xl font-bold tracking-tight">Meta Ads</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-800 dark:text-zinc-200">
            <svg width="0" height="0">
              <linearGradient id="googleAdsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F4B400" />
                <stop offset="50%" stopColor="#4285F4" />
                <stop offset="100%" stopColor="#0F9D58" />
              </linearGradient>
            </svg>
            <SiGoogleads size={45} style={{ fill: "url(#googleAdsGradient)" }} />
            <span className="text-2xl font-bold tracking-tight">Google Ads</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-800 dark:text-zinc-200">
            <IoLogoTiktok 
              size={40} 
              className="text-black dark:text-white"
              style={{ filter: "drop-shadow(2px 2px 0px #FE2C55) drop-shadow(-2px -2px 0px #00f2fe)" }}
            />
            <span className="text-2xl font-bold tracking-tight">TikTok Ads</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-800 dark:text-zinc-200 mr-20">
            <IoLogoTiktok 
              size={40} 
              className="text-black dark:text-white"
              style={{ filter: "drop-shadow(2px 2px 0px #FE2C55) drop-shadow(-2px -2px 0px #00f2fe)" }}
            />
            <span className="text-2xl font-bold tracking-tight">TikTok Shop</span>
          </div>
        </Marquee>
      </main>
    </section>
  );
}
