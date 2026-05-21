import EmailSection from "@/components/main/EmailSection";
import Hero from "@/components/main/Hero";
import Playground from "@/components/main/Playground";
import Projects from "@/components/main/Projects";
import Skills from "@/components/main/Skills";

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="flex flex-col gap-20">
        <Hero />
        <Skills />
        <Projects />
        <Playground />
        <EmailSection />
      </div>
    </main>
  );
}
