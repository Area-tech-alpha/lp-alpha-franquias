import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Learn } from "@/components/Learn";
import { Pillars } from "@/components/Pillars";
import { Signup } from "@/components/Signup";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Pillars />
        <Learn />
        <Signup />
      </main>
      <Footer />
    </>
  );
}
