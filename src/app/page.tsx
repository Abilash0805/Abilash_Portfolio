import { About } from "@/components/About";
import { Approach } from "@/components/Approach";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { WorkRail } from "@/components/WorkRail";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <WorkRail />
        <Approach />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
