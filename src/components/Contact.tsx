import { contact, site } from "@/content/site";
import { ArrowUpRightIcon, socialIcons, type SocialIconName } from "@/components/icons";
import { Magnetic } from "@/components/ui/Magnetic";
import { MaskLines, Rise, SplitChars } from "@/components/ui/SplitReveal";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden bg-ink pb-24 pt-28 sm:pb-32 sm:pt-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60vh]"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 100%, rgba(255,92,43,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="shell relative">
        <p className="eyebrow">{contact.eyebrow}</p>

        <SplitChars
          as="h2"
          className="display-lg mt-6 max-w-4xl font-display font-semibold text-ivory"
        >
          {contact.heading}
        </SplitChars>

        <MaskLines className="mt-8 max-w-xl text-lg leading-relaxed text-ivory-dim">
          {contact.body}
        </MaskLines>

        <Rise className="mt-12 flex flex-col gap-10">
          <Magnetic strength={0.18} className="w-fit max-w-full">
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex w-fit max-w-full items-center gap-4 border-b border-ink-hair pb-3 font-display text-[7vw] font-semibold leading-none tracking-tight text-ivory transition-colors hover:text-ember sm:text-[3.5vw]"
            >
              <span className="truncate">{site.email}</span>
              <ArrowUpRightIcon
                width={28}
                height={28}
                className="shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </a>
          </Magnetic>

          <ul className="flex flex-wrap items-center gap-3">
            {site.socials.map((social) => {
              const Icon = socialIcons[social.icon as SocialIconName];
              const external = social.href.startsWith("http");
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer noopener" : undefined}
                    className="inline-flex min-h-12 items-center gap-3 rounded-full border border-ink-hair px-5 text-sm text-ivory-dim transition-colors hover:border-ember hover:text-ivory"
                  >
                    <Icon width={18} height={18} />
                    {social.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </Rise>
      </div>
    </section>
  );
}
