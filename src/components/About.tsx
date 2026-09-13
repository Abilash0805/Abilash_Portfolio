import { about } from "@/content/site";
import { MaskLines, Rise, SplitChars } from "@/components/ui/SplitReveal";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative bg-ink py-28 sm:py-36"
    >
      <div className="shell">
        <p className="eyebrow">{about.eyebrow}</p>

        <SplitChars
          as="h2"
          className="display-lg mt-6 max-w-4xl font-display font-semibold text-ivory"
        >
          {about.heading}
        </SplitChars>

        <div className="mt-14 grid gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-24">
          <div className="space-y-6">
            {about.paragraphs.map((paragraph) => (
              <MaskLines
                key={paragraph}
                className="max-w-2xl text-lg leading-relaxed text-ivory-dim"
              >
                {paragraph}
              </MaskLines>
            ))}
          </div>

          <Rise className="hairline">
            <dl>
              {about.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex flex-col gap-1 border-b border-ink-hair py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                >
                  <dt className="eyebrow">{fact.label}</dt>
                  <dd className="text-right text-ivory sm:max-w-[60%]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Rise>
        </div>
      </div>
    </section>
  );
}
