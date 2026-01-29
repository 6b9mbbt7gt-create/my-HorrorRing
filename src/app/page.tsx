'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/marketing/Header';
import { HeroSection } from '@/components/marketing/HeroSection';
import { FeaturesSection } from '@/components/marketing/FeaturesSection';
import { PricingSection } from '@/components/marketing/PricingSection';
import { CTASection } from '@/components/marketing/CTASection';
import { Footer } from '@/components/marketing/Footer';
import { AgeWarningModal } from '@/components/marketing/AgeWarningModal';

export default function HomePage() {
  const [showAgeWarning, setShowAgeWarning] = useState(false);

  useEffect(() => {
    const ageVerified = sessionStorage.getItem('ageVerified');
    if (!ageVerified) {
      setShowAgeWarning(true);
    }
  }, []);

  const handleAgeConfirm = (isAdult: boolean) => {
    if (isAdult) {
      sessionStorage.setItem('ageVerified', 'true');
      setShowAgeWarning(false);
    } else {
      window.location.href = 'https://www.google.com';
    }
  };

  return (
    <>
      {showAgeWarning && <AgeWarningModal onConfirm={handleAgeConfirm} />}
      <Header />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </>
  );
}
