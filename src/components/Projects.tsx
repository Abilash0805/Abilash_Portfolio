"use client";

import { motion, useReducedMotion } from "framer-motion";
import { projects } from "@/content/site";
import { ArrowUpRightIcon } from "@/components/icons";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { Section } from "@/components/Section";

export function Projects() {
  const reduceMotion = useReducedMotion();

  return (
    <Section id="work" eyebrow="03 / Work" title="Selected projects">
      <RevealGroup className="grid gap-5 lg:grid-cols-2">
        {projects.map((project) => (
          <RevealItem key={project.title} className="h-full">
            <motion.article
              whileHover={reduceMotion ? undefined : { y: -4 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  {project.title}
                </h3>
                <span className="shrink-0 font-mono text-xs text-muted">{project.year}</span>
              </div>

              <p className="mt-4 flex-1 leading-relaxed text-muted">{project.summary}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full bg-surface-2 px-3 py-1 font-mono text-xs text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center gap-5 border-t border-border pt-5 text-sm">
                <a
                  href={project.href}
                  className="inline-flex items-center gap-1.5 font-medium text-accent"
                >
                  Case study
                  <ArrowUpRightIcon width={16} height={16} />
                </a>
                <a
                  href={project.repo}
                  className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-foreground"
                >
                  Source
                  <ArrowUpRightIcon width={16} height={16} />
                </a>
              </div>
            </motion.article>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
