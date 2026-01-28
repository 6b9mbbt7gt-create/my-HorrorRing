'use client';

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { Button } from './Button';
import { Select } from './Select';
import { locales, type Locale } from '@/lib/i18n/config';

type LanguageSwitcherProps = {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
};

export function LanguageSwitcher({
  currentLocale,
  onLocaleChange,
}: LanguageSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-400" />
      <Select
        value={currentLocale}
        onChange={(e) => onLocaleChange(e.target.value as Locale)}
        className="w-auto"
      >
        <option value="ja">日本語</option>
        <option value="en">English</option>
      </Select>
    </div>
  );
}
