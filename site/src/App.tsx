import { useState } from "react";
import TerminalIntro from "./components/TerminalIntro";
import Header from "./components/Header";
import Hero from "./components/Hero";
import QuickNav from "./components/QuickNav";
import ImpactDashboard from "./components/ImpactDashboard";
import About from "./components/About";
import BestWork from "./components/BestWork";
import Experience from "./components/Experience";
import BuildLab from "./components/BuildLab";
import TechStack from "./components/TechStack";
import ResumeSection from "./components/Resume";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import StructuredData from "./components/StructuredData";

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <StructuredData />
      {!introDone && <TerminalIntro onDone={() => setIntroDone(true)} />}
      <Header />
      <main id="main">
        <Hero />
        <QuickNav />
        <ImpactDashboard />
        <About />
        <BestWork />
        <Experience />
        <BuildLab />
        <TechStack />
        <ResumeSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
