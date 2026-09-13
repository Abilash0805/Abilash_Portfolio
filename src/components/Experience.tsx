import { experience } from "@/content/site";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";

export function Experience() {
  return (
    <Section id="experience" eyebrow="04 / Experience" title="Where I've worked">
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute left-[7px] top-2 bottom-2 w-px bg-border"
        />
        <ol className="space-y-10">
          {experience.map((job, index) => (
            <li key={`${job.company}-${job.period}`} className="relative pl-8">
              <span
                aria-hidden="true"
                className="absolute left-0 top-2 size-[15px] rounded-full border-2 border-accent bg-background"
              />
              <Reveal delay={index * 0.08}>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                  {job.period}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                  {job.role} <span className="font-normal text-accent">@ {job.company}</span>
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {job.points.map((point) => (
                    <li key={point} className="flex gap-3 leading-relaxed text-muted">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
