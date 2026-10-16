import React from 'react';
import { useApp } from '../context/AppContext';
import { VibeHubLogo } from './VibeHubLogo';
import { Search, Sun, Moon, Globe2, Bookmark } from 'lucide-react';
import { Language } from '../types';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    language,
    setLanguage,
    theme,
    toggleTheme,
    setIsSearchOpen,
    bookmarks,
    t
  } = useApp();

  const handleNavClick = (view: 'home' | 'category' | 'bookmarks', e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'pt', label: 'PT', flag: '🇧🇷' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'es', label: 'ES', flag: '🇪🇸' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#070d1a]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark Element */}
          <div className="flex items-center shrink-0">
            <VibeHubLogo
              size="sm"
              variant="horizontal"
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={(e) => handleNavClick('home', e)}
              className={`hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentView === 'home'
                  ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-500'
                  : ''
              }`}
            >
              {t('navHome')}
            </button>

            <button
              onClick={(e) => handleNavClick('category', e)}
              className={`hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentView === 'category'
                  ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-500'
                  : ''
              }`}
            >
              {t('navCategories')}
            </button>

            <button
              onClick={() => {
                setCurrentView('home');
                setTimeout(() => {
                  const trendingEl = document.getElementById('trending-section');
                  if (trendingEl) {
                    trendingEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 50);
              }}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              {t('navTrending')}
            </button>

            <button
              onClick={() => {
                const newsEl = document.getElementById('newsletter-section');
                if (newsEl) {
                  newsEl.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setCurrentView('home');
                  setTimeout(() => {
                    document.getElementById('newsletter-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              {t('navNewsletter')}
            </button>

            {bookmarks.length > 0 && (
              <button
                onClick={(e) => handleNavClick('bookmarks', e)}
                className={`hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 py-1 inline-flex items-center gap-1.5 ${
                  currentView === 'bookmarks'
                    ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-500'
                    : ''
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{t('navBookmarks')}</span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">({bookmarks.length})</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Interactive Affordances (Search, Language, Theme) - Header Admin button removed as requested */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Quick Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title={`${t('searchTitle')} (Ctrl+K)`}
              aria-label="Abrir busca"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">{t('searchPlaceholder').slice(0, 16)}...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700/60">
              <Globe2 className="w-3.5 h-3.5 ml-2 text-slate-400 shrink-0 hidden sm:block" />
              <div className="flex items-center gap-0.5 px-1">
                {languages.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => setLanguage(item.code)}
                    className={`px-1.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                      language === item.code
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title={item.label}
                  >
                    {item.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-lg transition-colors shrink-0 cursor-pointer"
              title={theme === 'dark' ? t('themeLight') : t('themeDark')}
              aria-label="Alternar modo escuro e claro"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-sky-600 transition-transform hover:-rotate-12" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
