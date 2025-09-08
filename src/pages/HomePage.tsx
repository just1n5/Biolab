import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import QuickAccess from '@/components/QuickAccess';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import SstSection from '@/components/SstSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <QuickAccess />
      <AboutSection />
      <ServicesSection />
      <SstSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default HomePage;