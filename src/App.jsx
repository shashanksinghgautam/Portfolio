import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Experience from './components/Experience.jsx';
import Projects from './components/Projects.jsx';
import Achievements from './components/Achievements.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import BackgroundDecor from './components/BackgroundDecor.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import SectionDivider from './components/SectionDivider.jsx';
import FloatingContact from './components/FloatingContact.jsx';

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <CustomCursor />
      <BackgroundDecor />
      <ScrollProgress />
      <FloatingContact />
      <Navbar />
      <main>
        <Hero />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Experience />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Achievements />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
