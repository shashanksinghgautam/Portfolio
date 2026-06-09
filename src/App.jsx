import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import BackgroundDecor from './components/BackgroundDecor.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import SectionDivider from './components/SectionDivider.jsx';

// Lazy-load below-the-fold sections for faster initial paint
const About = lazy(() => import('./components/About.jsx'));
const Skills = lazy(() => import('./components/Skills.jsx'));
const Experience = lazy(() => import('./components/Experience.jsx'));
const Projects = lazy(() => import('./components/Projects.jsx'));
const Achievements = lazy(() => import('./components/Achievements.jsx'));
const Contact = lazy(() => import('./components/Contact.jsx'));
const Footer = lazy(() => import('./components/Footer.jsx'));
const FloatingContact = lazy(() => import('./components/FloatingContact.jsx'));

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <CustomCursor />
      <BackgroundDecor />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={null}>
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
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <FloatingContact />
        <Footer />
      </Suspense>
    </div>
  );
}
