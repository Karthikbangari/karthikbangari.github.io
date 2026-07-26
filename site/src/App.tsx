import { useState } from "react";
import Preloader from "./components/Preloader";
import Header from "./components/Header";
import Hero from "./components/Hero";
import QuickNav from "./components/QuickNav";
import PaperSceneTransition from "./components/PaperSceneTransition";
import ImpactDashboard from "./components/ImpactDashboard";
import About from "./components/About";
import BestWork from "./components/BestWork";
import ChapterInterstitial from "./components/ChapterInterstitial";
import Experience from "./components/Experience";
import SplitPanelReveal from "./components/SplitPanelReveal";
import BuildLab from "./components/BuildLab";
import TechStack from "./components/TechStack";
import ResumeSection from "./components/Resume";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import StructuredData from "./components/StructuredData";
import ChapterProgress from "./components/ChapterProgress";
import Story from "./story/Story";
import { useDesktopStoryMode } from "./lib/useDesktopStoryMode";

function FallbackSite({ introDone }: { introDone: boolean }) {
  return (
    <>
      <Header />
      <main id="main">
        <Hero active={introDone} />
        <QuickNav />
        <PaperSceneTransition />
        <ImpactDashboard />
        <About />
        <BestWork />
        <ChapterInterstitial
          chapter="03"
          lines={["AUTOMATE THE REPEATABLE.", "OBSERVE THE IMPORTANT."]}
          next="Experience"
        />
        <Experience />
        <SplitPanelReveal />
        <BuildLab />
        <TechStack />
        <ResumeSection />
        <Contact />
      </main>
      <Footer />
      <ChapterProgress />
    </>
  );
}

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const storyMode = useDesktopStoryMode();

  return (
    <>
      <StructuredData />
      {!introDone && <Preloader onDone={() => setIntroDone(true)} />}
      {storyMode ? <Story active={introDone} /> : <FallbackSite introDone={introDone} />}
    </>
  );
}
