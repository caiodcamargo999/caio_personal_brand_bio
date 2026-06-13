"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./projects-showcase.css";

type Project = {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
};

const PROJECTS: Project[] = [
  {
    id: "project-one",
    category: "TRAVEL & HOSPITALITY",
    title: "Cilex Ibiza",
    description: "Brand site for curated Ibiza travel experiences",
    image: "/images/showcase/project-one.png",
  },
  {
    id: "project-two",
    category: "FITNESS & COACHING",
    title: "EliCoach",
    description: "Personal trainer booking and coaching site",
    image: "/images/showcase/project-two.png",
  },
  {
    id: "project-three",
    category: "EVENT LANDING PAGE",
    title: "Método Start",
    description: "High-ticket event funnel for dental professionals",
    image: "/images/showcase/project-three.png",
  },
  {
    id: "project-four",
    category: "E-COMMERCE",
    title: "Metais da Terra",
    description: "Jewelry brand online store and catalog",
    image: "/images/showcase/project-four.png",
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
          Projects built{" "}
          <span className="bg-primary text-primary-foreground px-2 inline-block">end-to-end</span>
        </h2>
      </div>

      <div className="showcase-sticky-boundary">
        <div className="showcase-sticky">
          <div className="showcase-stage">
            <div className="showcase-device-wrap">
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

              <div className="showcase-phone-device" aria-hidden="true">
                <div className="showcase-phone">
                  <div className="showcase-phone-screen">
                    <div className="showcase-media" aria-label="Cilex WhatsApp Community preview">
                      <Image
                        src="/images/showcase/cilex-whatsapp-mobile.png"
                        alt="Cilex WhatsApp Community preview"
                        fill
                        sizes="20vw"
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
              {PROJECTS.map((project) => (
                <article key={project.id} className="showcase-card">
                  <div className="showcase-card-thumb">
                    <Image
                      src={project.image}
                      alt={`${project.title} preview`}
                      fill
                      sizes="280px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="showcase-card-overlay" aria-hidden="true" />
                  <div className="relative z-10">
                    <span className="showcase-card-category">{project.category}</span>
                    <h3 className="showcase-card-title">{project.title}</h3>
                    <p className="showcase-card-description">{project.description}</p>
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
