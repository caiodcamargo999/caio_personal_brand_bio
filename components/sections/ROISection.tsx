"use client";

import { CounterNumber } from "@/components/ui/counter-number";

export function ROISection() {
  return (
    <section className="w-full py-24 bg-zinc-50/40 dark:bg-zinc-900/40 backdrop-blur-md border-y border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-8">
          Illustrating <span className="text-blue-600">ROI</span> in %
        </h2>
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-black rounded-3xl shadow-xl border border-zinc-100 dark:border-zinc-800 max-w-2xl mx-auto">
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-6 font-medium">
            Average Return on Investment
          </p>
          <div className="flex items-end gap-2 text-blue-600 dark:text-blue-500">
            <CounterNumber
              value={99.99}
              duration={2500}
              decimalPlaces={2}
              size="2xl"
              className="font-extrabold tracking-tighter"
              color="default"
            />
            <span className="text-5xl font-extrabold tracking-tighter pb-1">%</span>
          </div>
          <p className="mt-8 text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
            I help businesses maximize their return by optimizing every digital touchpoint.
          </p>
        </div>
      </div>
    </section>
  );
}
