import { About } from "@/components/About";
import { Approach } from "@/components/Approach";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { WorkRail } from "@/components/WorkRail";
import { projects } from "@/content/work";
import { withCovers } from "@/lib/covers";

export default function Home() {
  // Resolved here, on the server, so the rail never asks for an image that
  // has not been exported yet.
  const work = withCovers(projects);

  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <WorkRail projects={work} />
        <Approach />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
