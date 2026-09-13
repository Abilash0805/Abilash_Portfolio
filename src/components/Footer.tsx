import { site } from "@/content/site";
import { Marquee } from "@/components/ui/Marquee";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ink-hair bg-ink">
      <div className="py-10">
        <Marquee items={site.roles} />
      </div>

      <div className="shell flex flex-col gap-3 border-t border-ink-hair py-8 text-sm text-ivory-faint sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {site.name}
        </p>
        <p>{site.tagline}</p>
      </div>
    </footer>
  );
}
