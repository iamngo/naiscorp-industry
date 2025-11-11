'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Globe2 } from 'lucide-react';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 ${className}`}
      aria-label={language === 'vi' ? 'Chuyển sang tiếng Anh' : 'Switch to Vietnamese'}
    >
      <Globe2 className="h-4 w-4 text-blue-600" />
      <span>{language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
    </button>
  );
}


