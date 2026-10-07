import React, { useState } from 'react';
import { Country } from './types';
import { useScreenRoute } from './lib/routes';
import { COUNTRIES } from './data/cbzData';
import { TopUtilityBar } from './components/TopUtilityBar';
import { Navbar } from './components/Navbar';
import { AnnouncementsBar } from './components/AnnouncementsBar';
import { HeroSection } from './components/HeroSection';
import { AnnouncementsSection } from './components/AnnouncementsSection';
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
import { OpenAccountModal } from './components/OpenAccountModal';
import { ContactChannelsModal } from './components/ContactChannelsModal';
import { Footer } from './components/Footer';
import ChatWidget from './components/ChatWidget';

export default function App() {
  // URL-backed screen state (see src/lib/routes.ts). navigate() pushes history and scrolls to top.
  const [currentScreen, setCurrentScreen] = useScreenRoute();
  const [currentCountry, setCurrentCountry] = useState<Country>(COUNTRIES[0]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginPortal, setLoginPortal] = useState<PortalType>('personal');
  const [isOpenAccountOpen, setIsOpenAccountOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">

      {/* Top Utility Bar (Rotating Indicative FX, Toll-Free, WhatsApp, Channels Trigger) */}
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
        onOpenContact={() => setIsContactModalOpen(true)}
      />

      {/* Main Navigation Bar (With Prominent Open Account button) */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onOpenLogin={(portal?: PortalType) => {
          if (portal) setLoginPortal(portal);
          setIsLoginOpen(true);
        }}
        onOpenAccount={() => setIsOpenAccountOpen(true)}
        onOpenContact={() => setIsContactModalOpen(true)}
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
            {/* Urgent Corporate Notice Ticker */}
            <AnnouncementsBar
              onOpenAll={() => {
                const el = document.getElementById('announcements-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Clean Authoritative Hero (No AI gradients, no AI pills, Open Account CTA) */}
            <HeroSection
              country={currentCountry}
              onNavigate={setCurrentScreen}
              onOpenAccount={() => setIsOpenAccountOpen(true)}
              onOpenContact={() => setIsContactModalOpen(true)}
            />

            {/* Dedicated Announcements & Press Room Section */}
            <AnnouncementsSection />

            {/* Life Stage Framework */}
            <LifeStageSection onNavigate={setCurrentScreen} />

            {/* Group Subsidiaries (Showcasing Official Logos instead of card repetition) */}
            <EcosystemGrid onNavigate={setCurrentScreen} />

            {/* Solutions Section */}
            <SolutionsSection onNavigate={setCurrentScreen} />

            {/* Ziki Bill Payments */}
            <BillPaymentSection country={currentCountry} />

            {/* Omnichannel Support & Contact Directory */}
            <NewsAndSupport
              country={currentCountry}
              onOpenContact={() => setIsContactModalOpen(true)}
            />
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

      {/* Persistent Comprehensive Footer (With Verified Social Media & Toll-Free Links) */}
      <Footer
        country={currentCountry}
        onNavigate={setCurrentScreen}
        onOpenAccount={() => setIsOpenAccountOpen(true)}
        onOpenContact={() => setIsContactModalOpen(true)}
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

      {/* Interactive Open Account Modal */}
      <OpenAccountModal
        isOpen={isOpenAccountOpen}
        onClose={() => setIsOpenAccountOpen(false)}
        onNavigate={setCurrentScreen}
      />

      {/* Interactive All Contact Channels Modal */}
      <ContactChannelsModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* Full-site AI Concierge — persists across all screen changes */}
      <ChatWidget />

    </div>
  );
}
