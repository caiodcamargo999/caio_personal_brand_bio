import React from "react";
import { TrendingUp, Code, Paintbrush, LineChart, Target, Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function ServicesSection() {
  const { t } = useI18n();

  // We map the icons separately since they are React components
  const icons = [
    <Target key="target" className="w-6 h-6" />,
    <TrendingUp key="trending" className="w-6 h-6" />,
    <Users key="users" className="w-6 h-6" />,
    <LineChart key="linechart" className="w-6 h-6" />
  ];

  const services = t('services.items') as Array<{ title: string, description: string }>;

  return (
    <section className="flex flex-col gap-4 mt-20 sm:mt-24 lg:mt-32 px-4 sm:px-6" id="services">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl text-center font-semibold tracking-tight">
        {/* Render highlight based on language */}
        {t('services.title').includes('Unfair Advantage') ? (
          <>
            {t('services.title').split('Unfair Advantage')[0]}
            <span className="bg-primary text-primary-foreground px-2 inline-block">Unfair Advantage</span>
            {t('services.title').split('Unfair Advantage')[1]}
          </>
        ) : t('services.title').includes('Vantagem Injusta') ? (
          <>
            {t('services.title').split('Vantagem Injusta')[0]}
            <span className="bg-primary text-primary-foreground px-2 inline-block">Vantagem Injusta</span>
            {t('services.title').split('Vantagem Injusta')[1]}
          </>
        ) : t('services.title').includes('Ventaja Injusta') ? (
          <>
            {t('services.title').split('Ventaja Injusta')[0]}
            <span className="bg-primary text-primary-foreground px-2 inline-block">Ventaja Injusta</span>
            {t('services.title').split('Ventaja Injusta')[1]}
          </>
        ) : (
          t('services.title')
        )}
      </h2>
      <p className="text-muted-foreground text-center text-lg sm:text-xl font-light max-w-3xl mx-auto mt-4 sm:mt-6">
        {t('services.subtitle')}
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 max-w-5xl items-start justify-center mx-auto mt-10 sm:mt-16 md:mt-20">
        {services.map((service, index) => (
          <div key={index} className="relative overflow-hidden p-4 sm:p-6 group h-full">
            {/* Grid Pattern Background */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+")`,
                backgroundSize: '40px 40px',
                maskImage: 'radial-gradient(ellipse at top right, white, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(ellipse at top right, white, transparent 70%)',
              }}
            ></div>
            
            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-semibold text-white tracking-wide">{service.title}</h3>
              <p className="text-muted-foreground mt-4 text-sm font-light leading-relaxed max-w-sm">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
