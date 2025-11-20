'use client';

import { useState, useRef, useEffect } from 'react';
import { FiSettings } from 'react-icons/fi';
import DarkLightToggle from '@/components/param/DarkLightToggle';
import LanguageSelector from '@/components/param/LanguageSelector';

export default function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl shadow-lg bg-[color:var(--color-background)] ring-1 ring-black ring-opacity-5 p-3 z-50">
          <div className="mb-3">
            <DarkLightToggle />
          </div>
          <div>
            <LanguageSelector />
          </div>
        </div>
      )}
    </div>
  );
}
