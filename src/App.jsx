import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Experience from './components/Experience.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import BackgroundDecor from './components/BackgroundDecor.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import FloatingContact from './components/FloatingContact.jsx';

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <BackgroundDecor />
      <ScrollProgress />
      <Navbar />
      <FloatingContact />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
