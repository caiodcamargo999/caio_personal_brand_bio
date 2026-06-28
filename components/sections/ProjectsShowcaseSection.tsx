"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/lib/i18n";
import "./projects-showcase.css";

type Project = {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  mobileImage?: string;
};

const PROJECTS: Project[] = [
  {
    id: "project-one",
    category: "TRAVEL & HOSPITALITY",
    title: "Cilex Ibiza",
    description: "Brand site for curated Ibiza travel experiences",
    image: "/images/showcase/project-one.png",
    mobileImage: "/images/showcase/cilex_whatsapp_v3.jpeg",
  },
  {
    id: "project-two",
    category: "FITNESS & COACHING",
    title: "EliCoach",
    description: "Elicoach.com - Personal trainer booking and coaching site",
    image: "/images/showcase/elicoach-mobile.png",
    mobileImage: "/images/showcase/eli_coach_v3.jpeg",
  },
  {
    id: "project-three",
    category: "EVENT LANDING PAGE",
    title: "Método Start",
    description: "High-ticket event funnel for dental professionals",
    image: "/images/showcase/project-three.png",
    mobileImage: "/images/showcase/metodo_start_v3.jpeg",
  },
  {
    id: "project-four",
    category: "E-COMMERCE",
    title: "Metais da Terra",
    description: "Jewelry brand online store and catalog",
    image: "/images/showcase/project-four.png",
    mobileImage: "/images/showcase/metais_da_terra_v3.jpeg",
  },
];

const DESKTOP_CARD_POSITIONS = [
  { from: { x: -920, y: -420, rotate: -16, scale: 0.5 }, to: { x: -380, y: -160, rotate: -3 } },
  { from: { x: 920, y: -420, rotate: 16, scale: 0.5 }, to: { x: 380, y: -160, rotate: 3 } },
  { from: { x: -920, y: 480, rotate: 12, scale: 0.5 }, to: { x: -360, y: 190, rotate: 3 } },
  { from: { x: 920, y: 480, rotate: -12, scale: 0.5 }, to: { x: 360, y: 190, rotate: -3 } },
];

const MOBILE_CARD_POSITIONS = [
  { from: { x: -420, y: -260, rotate: -10, scale: 0.5 }, to: { x: -95, y: -230, rotate: -2 } },
  { from: { x: 420, y: -260, rotate: 10, scale: 0.5 }, to: { x: 95, y: -230, rotate: 2 } },
  { from: { x: -420, y: 320, rotate: 8, scale: 0.5 }, to: { x: -95, y: 260, rotate: 2 } },
  { from: { x: 420, y: 320, rotate: -8, scale: 0.5 }, to: { x: 95, y: 260, rotate: -2 } },
];

export function ProjectsShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const stickyBoundary = section.querySelector<HTMLElement>(".showcase-sticky-boundary");
    const deviceWrap = section.querySelector<HTMLElement>(".showcase-device-wrap");
    const cards = Array.from(section.querySelectorAll<HTMLElement>(".showcase-card"));
    if (!stickyBoundary || !deviceWrap || cards.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      gsap.set(deviceWrap, { scale: 0.86, rotateX: 8, rotateY: -10, transformPerspective: 1600 });
      cards.forEach((card, i) => {
        const pos = DESKTOP_CARD_POSITIONS[i];
        gsap.set(card, { xPercent: -50, yPercent: -50, autoAlpha: 0, ...pos.from });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stickyBoundary,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
        },
      });

      tl.to(deviceWrap, { scale: 1.04, rotateX: 0, rotateY: 0, duration: 0.6, ease: "none" }, 0);

      DESKTOP_CARD_POSITIONS.forEach((pos, i) => {
        const start = 0.08 + i * 0.16;
        tl.to(
          cards[i],
          { autoAlpha: 1, ...pos.to, scale: 1, duration: 0.4, ease: "none" },
          start
        );
      });

      tl.to(deviceWrap, { scale: 1, duration: 0.3, ease: "none" }, 0.7);

      return () => {
        tl.kill();
      };
    });

    mm.add("(max-width: 767px)", () => {
      ScrollTrigger.normalizeScroll(true);

      gsap.set(deviceWrap, { scale: 0.82, rotateX: 6, rotateY: 0, transformPerspective: 1200 });
      cards.forEach((card, i) => {
        const pos = MOBILE_CARD_POSITIONS[i];
        gsap.set(card, { xPercent: -50, yPercent: -50, autoAlpha: 0, ...pos.from });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stickyBoundary,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
        },
      });

      tl.to(deviceWrap, { scale: 1, rotateX: 0, duration: 0.6, ease: "none" }, 0);

      MOBILE_CARD_POSITIONS.forEach((pos, i) => {
        const start = 0.08 + i * 0.16;
        tl.to(
          cards[i],
          { autoAlpha: 1, ...pos.to, scale: 1, duration: 0.4, ease: "none" },
          start
        );
      });

      return () => {
        tl.kill();
        ScrollTrigger.normalizeScroll(false);
      };
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="showcase-section flex flex-col gap-4 mt-8 sm:mt-12 lg:mt-16 px-4 sm:px-6" id="work">
      <div className="showcase-intro">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl text-center font-semibold tracking-tight">
          {t('projects.title')}{" "}
          <span className="bg-primary text-primary-foreground px-2 inline-block">{t('projects.highlight')}</span>
        </h2>
      </div>

      <div className="showcase-sticky-boundary">
        <div className="showcase-sticky">
          <div className="showcase-stage">
            <div className="showcase-device-wrap">
              <div className="hidden md:block">
                <div className="showcase-laptop">
                  <div className="showcase-laptop-lid">
                    <div className="showcase-laptop-camera" aria-hidden="true" />
                    <div className="showcase-laptop-screen">
                      <div className="showcase-media" aria-label={`${PROJECTS[0].title} preview`}>
                        <Image
                          src={PROJECTS[0].image}
                          alt={`${PROJECTS[0].title} preview`}
                          fill
                          sizes="(min-width: 768px) 60vw, 90vw"
                          className="object-cover object-top"
                        />
                      </div>
                    </div>
                    <div className="showcase-laptop-glass" aria-hidden="true" />
                  </div>
                  <div className="showcase-laptop-hinge" aria-hidden="true" />
                  <div className="showcase-laptop-base" aria-hidden="true">
                    <span />
                  </div>
                  <div className="showcase-laptop-shadow" aria-hidden="true" />
                </div>
              </div>

              <div className="md:hidden w-[55vw] max-w-[220px] mx-auto relative z-10">
                <div className="showcase-phone">
                  <div className="showcase-phone-screen">
                    <div className="showcase-media" aria-label="Mobile preview">
                      <Image
                        src="/images/showcase/cilex_whatsapp_v3.jpeg"
                        alt="Mobile preview"
                        fill
                        sizes="60vw"
                        className="object-cover object-top"
                      />
                    </div>
                  </div>
                  <div className="showcase-dynamic-island" />
                  <div className="showcase-phone-glass" />
                  <div className="showcase-home-indicator" />
                </div>
              </div>
            </div>

            <div className="showcase-cards">
              {PROJECTS.map((project, i) => (
                <article key={project.id} className="showcase-card flex flex-col items-center text-center">
                  <div className="showcase-phone shadow-2xl mb-4">
                    <div className="showcase-phone-screen">
                      <div className="showcase-media" aria-label={`${project.title} preview`}>
                        <Image
                          src={project.mobileImage ? project.mobileImage : project.image}
                          alt={`${project.title} preview`}
                          fill
                          sizes="(max-width: 768px) 160px, 220px"
                          className="object-cover object-top"
                        />
                      </div>
                    </div>
                    <div className="showcase-dynamic-island" />
                    <div className="showcase-phone-glass" />
                    <div className="showcase-home-indicator" />
                  </div>
                  <div className="relative z-10 w-full">
                    <span className="showcase-card-category text-[10px] sm:text-xs text-muted-foreground font-bold tracking-[0.18em] mb-2 block">{t(`projects.items.${i}.category`)}</span>
                    <h3 className="showcase-card-title text-base sm:text-lg font-semibold text-foreground">{project.title}</h3>
                    <p className="showcase-card-description text-xs sm:text-sm font-light text-muted-foreground mt-1">{t(`projects.items.${i}.description`)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
