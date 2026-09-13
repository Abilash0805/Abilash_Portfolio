import { contact, site } from "@/content/site";
import { ArrowUpRightIcon, socialIcons, type SocialIconName } from "@/components/icons";
import { Reveal } from "@/components/Reveal";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28"
    >
      <Reveal>
        <div className="overflow-hidden rounded-3xl border border-border bg-surface px-6 py-14 text-center sm:px-12 sm:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            05 / Contact
          </p>
          <h2
            id="contact-title"
            className="mx-auto mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-5xl"
          >
            {contact.heading}
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted">{contact.body}</p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
            >
              {site.email}
              <ArrowUpRightIcon width={16} height={16} />
            </a>
            <a
              href={site.resumeUrl}
              className="inline-flex min-h-12 items-center rounded-full border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
            >
              Download resume
            </a>
          </div>

          <ul className="mt-10 flex items-center justify-center gap-2">
            {site.socials.map((social) => {
              const Icon = socialIcons[social.icon as SocialIconName];
              const external = social.href.startsWith("http");
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer noopener" : undefined}
                    className="grid size-11 place-items-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    <Icon />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
