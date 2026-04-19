import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PainPoints from "@/components/PainPoints";
import Solutions from "@/components/Solutions";
import HowItConnects from "@/components/HowItConnects";
import OperationalNetwork from "@/components/OperationalNetwork";
import WhoWeServe from "@/components/WhoWeServe";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PainPoints />
        <Solutions />
        <HowItConnects />
        <OperationalNetwork />
        <WhoWeServe />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
