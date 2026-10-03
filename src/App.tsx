import React, { useState, useEffect } from 'react';
import { ScreenType, Country } from './types';
import { COUNTRIES } from './data/cbzData';
import { TopUtilityBar } from './components/TopUtilityBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LifeStageSection } from './components/LifeStageSection';
import { EcosystemGrid } from './components/EcosystemGrid';
import { SolutionsSection } from './components/SolutionsSection';
import { BillPaymentSection } from './components/BillPaymentSection';
import { NewsAndSupport } from './components/NewsAndSupport';
import { CustomerJourney } from './components/CustomerJourney';
import { SbuInsuranceView } from './components/SbuInsuranceView';
import { CrossEntityHandover } from './components/CrossEntityHandover';
import { SbuAgribusinessView } from './components/SbuAgribusinessView';
import { SbuInvestmentsView } from './components/SbuInvestmentsView';
import { SbuPropertiesView } from './components/SbuPropertiesView';
import { SbuBankingView } from './components/SbuBankingView';
import { LoginModal, PortalType } from './components/LoginModal';
import { Footer } from './components/Footer';
import ChatWidget from './components/ChatWidget';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [currentCountry, setCurrentCountry] = useState<Country>(COUNTRIES[0]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginPortal, setLoginPortal] = useState<PortalType>('personal');

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">

      {/* Top Utility Bar */}
      <TopUtilityBar
        currentCountry={currentCountry}
        onSelectCountry={setCurrentCountry}
        activeEntityName={
          currentScreen === 'bank'
            ? 'CBZ Bank'
            : currentScreen === 'sbu'
            ? 'CBZ Insurance'
            : currentScreen === 'agro'
            ? 'CBZ Agro-Yield'
            : currentScreen === 'invest'
            ? 'Datvest Investments'
            : currentScreen === 'properties'
            ? 'CBZ Properties'
            : currentScreen === 'group'
            ? 'Connected Group Journey'
            : undefined
        }
        onGoHome={() => setCurrentScreen('home')}
      />

      {/* Main Navigation Bar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onOpenLogin={(portal?: PortalType) => {
          if (portal) setLoginPortal(portal);
          setIsLoginOpen(true);
        }}
        entityName={
          currentScreen === 'bank'
            ? 'Bank'
            : currentScreen === 'sbu'
            ? 'Insurance'
            : currentScreen === 'agro'
            ? 'Agro-Yield'
            : currentScreen === 'invest'
            ? 'Datvest'
            : currentScreen === 'properties'
            ? 'Properties'
            : currentScreen === 'group'
            ? 'Holdings'
            : 'Holdings'
        }
      />

      {/* Screen Views */}
      <main className="flex-grow">
        {currentScreen === 'home' && (
          <div>
            <HeroSection country={currentCountry} onNavigate={setCurrentScreen} />
            <LifeStageSection onNavigate={setCurrentScreen} />
            <EcosystemGrid onNavigate={setCurrentScreen} />
            <SolutionsSection onNavigate={setCurrentScreen} />
            <BillPaymentSection country={currentCountry} />
            <NewsAndSupport country={currentCountry} />
          </div>
        )}

        {currentScreen === 'journey' && (
          <CustomerJourney country={currentCountry} onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'bank' && (
          <SbuBankingView country={currentCountry} onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'sbu' && (
          <SbuInsuranceView country={currentCountry} onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'agro' && (
          <SbuAgribusinessView country={currentCountry} onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'invest' && (
          <SbuInvestmentsView country={currentCountry} onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'properties' && (
          <SbuPropertiesView country={currentCountry} onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'group' && (
          <CrossEntityHandover country={currentCountry} onNavigate={setCurrentScreen} />
        )}
      </main>

      {/* Persistent Comprehensive Footer */}
      <Footer
        country={currentCountry}
        onNavigate={setCurrentScreen}
        activeEntity={
          currentScreen === 'bank'
            ? 'Bank'
            : currentScreen === 'sbu'
            ? 'Insurance'
            : currentScreen === 'agro'
            ? 'Agro-Yield'
            : currentScreen === 'invest'
            ? 'Datvest'
            : currentScreen === 'properties'
            ? 'Properties'
            : undefined
        }
      />

      {/* Interactive Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onNavigate={setCurrentScreen}
        initialPortal={loginPortal}
      />

      {/* Full-site AI Concierge — persists across all screen changes */}
      <ChatWidget />

    </div>
  );
}
