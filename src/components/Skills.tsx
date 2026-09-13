import { skills } from "@/content/site";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { Section } from "@/components/Section";

export function Skills() {
  return (
    <Section id="skills" eyebrow="02 / Skills" title="What I work with">
      <RevealGroup className="grid gap-5 sm:grid-cols-2">
        {skills.map((group) => (
          <RevealItem
            key={group.group}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              {group.group}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm text-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
