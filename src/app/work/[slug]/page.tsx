import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { CaseHero } from "@/components/case/CaseHero";
import { CaseChapters } from "@/components/case/CaseChapters";
import { ArrowUpRightIcon } from "@/components/icons";
import { MaskLines, Rise, SplitChars } from "@/components/ui/SplitReveal";
import { projectBySlug, projects } from "@/content/work";
import { coverFor } from "@/lib/covers";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const withCover = { ...project, cover: coverFor(project.cover) };
  const order = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(order + 1) % projects.length];

  return (
    <>
      <Nav />

      <main id="main">
        <CaseHero project={withCover} />

        <section aria-labelledby="brief-title" className="shell py-24 sm:py-32">
          <h2 id="brief-title" className="sr-only">
            The brief
          </h2>

          <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-24">
            <div>
              <p className="eyebrow">The challenge</p>
              <MaskLines className="mt-6 text-xl leading-relaxed text-ivory sm:text-2xl">
                {project.challenge}
              </MaskLines>
            </div>

            <Rise className="flex flex-col gap-10">
              <div>
                <p className="eyebrow">My role</p>
                <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-lg text-ivory">
                  {project.role.map((role, index) => (
                    <li key={role} className="flex items-center gap-3">
                      {index > 0 && <span className="text-ivory-faint">·</span>}
                      {role}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="eyebrow">What I built</p>
                <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                  {project.built.map((item) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-3 border-b border-ink-hair py-2 text-ivory-dim"
                    >
                      <span className="size-1 shrink-0 rounded-full bg-ember" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="eyebrow">Tools &amp; technologies</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <li
                      key={tool}
                      className="rounded-full border border-ink-hair px-3 py-1.5 font-sans text-sm text-ivory-dim"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            </Rise>
          </div>
        </section>

        <CaseChapters project={project} />

        <section aria-labelledby="outcome-title" className="shell py-24 sm:py-32">
          <p className="eyebrow">Outcome</p>
          <SplitChars
            as="h2"
            className="display-md mt-6 max-w-4xl font-display font-semibold text-ivory"
          >
            {project.outcome.statement}
          </SplitChars>

          <Rise className="mt-14 grid gap-px overflow-hidden border border-ink-hair bg-ink-hair sm:grid-cols-3">
            {project.outcome.metrics.map((metric) => (
              <div key={metric.label} className="bg-ink p-7">
                <p className="font-display text-4xl font-semibold text-ember sm:text-5xl">
                  {metric.value}
                </p>
                <p className="mt-3 text-sm text-ivory-dim">{metric.label}</p>
              </div>
            ))}
          </Rise>

          {project.href && (
            <Rise className="mt-12">
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-12 items-center gap-3 rounded-full bg-ember px-7 text-sm font-medium uppercase tracking-[0.16em] text-ink transition-opacity hover:opacity-90"
              >
                Visit the live site
                <ArrowUpRightIcon width={16} height={16} />
              </a>
            </Rise>
          )}
        </section>

        <section
          aria-label="Next project"
          className="border-t border-ink-hair bg-ink py-20 sm:py-28"
        >
          <Link href={`/work/${next.slug}`} className="group block">
            <div className="shell flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">Next case study</p>
                <p className="display-md mt-5 font-display font-semibold text-ivory transition-colors group-hover:text-ember">
                  <span className="text-ivory-faint">{next.index}</span> {next.title}
                </p>
              </div>
              <span className="text-ivory-faint transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                <ArrowUpRightIcon width={40} height={40} />
              </span>
            </div>
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
