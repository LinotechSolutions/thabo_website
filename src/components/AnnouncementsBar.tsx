import React, { useState, useEffect } from 'react';
import { Bell, ChevronRight, X, Volume2, ArrowRight } from 'lucide-react';
import { ANNOUNCEMENTS, Announcement } from '../data/announcementsData';

interface AnnouncementsBarProps {
  onOpenAll?: () => void;
}

export const AnnouncementsBar: React.FC<AnnouncementsBarProps> = ({ onOpenAll }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const urgentList = ANNOUNCEMENTS.slice(0, 3);

  useEffect(() => {
    if (isPaused || urgentList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % urgentList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, urgentList.length]);

  if (!isVisible || urgentList.length === 0) return null;

  const current = urgentList[currentIndex];

  const handleScrollToAnnouncements = () => {
    const el = document.getElementById('announcements-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onOpenAll) {
      onOpenAll();
    }
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-[#002554] text-white border-b border-white/10 text-xs py-2 px-4 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Badge & Notice */}
        <div className="flex items-center space-x-3 overflow-hidden flex-1">
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#E4002B] animate-pulse" />
            <span className="font-extrabold uppercase tracking-wider text-[11px] text-white bg-white/15 px-2 py-0.5 rounded">
              Official Notice
            </span>
          </div>

          <div className="flex items-center space-x-2 truncate">
            <span className="text-white/60 text-xs hidden sm:inline">
              [{current.date}]
            </span>
            <button
              onClick={handleScrollToAnnouncements}
              className="text-white hover:text-red-300 font-semibold truncate text-left transition-colors cursor-pointer"
            >
              {current.title}
            </button>
          </div>
        </div>

        {/* Right: Quick CTA & Dismiss */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <button
            onClick={handleScrollToAnnouncements}
            className="hidden md:inline-flex items-center space-x-1 text-red-300 hover:text-white font-bold transition-colors cursor-pointer text-xs"
          >
            <span>View All Notices</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center space-x-1">
            {urgentList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex ? 'bg-[#E4002B] w-3' : 'bg-white/30'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="text-white/60 hover:text-white p-1 rounded cursor-pointer"
            aria-label="Dismiss notice bar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
