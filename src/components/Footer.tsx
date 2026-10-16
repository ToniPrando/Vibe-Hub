import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { VibeHubLogo } from './VibeHubLogo';
import { ArrowUp, Heart, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { openCategory, setCurrentView, language, t } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#050914] text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Col 1: Brand & Logo Lockup */}
          <div className="md:col-span-5 space-y-4">
            <VibeHubLogo size="md" variant="horizontal" showSubtitle />
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mt-2">
              {t('brandDescription')}
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>Plataforma editorial independente e global</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t('navCategories')}
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      openCategory(cat.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-left"
                  >
                    {cat.name[language]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Links & Editorial */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Vibe Hub
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  {t('navHome')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    document.getElementById('trending-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  {t('navTrending')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    document.getElementById('newsletter-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  {t('navNewsletter')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-500 transition-colors inline-flex items-center gap-1 font-semibold"
                >
                  <Shield className="w-3 h-3 text-amber-500" />
                  <span>{t('navAdmin')}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Sub-footer bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} Vibe Hub. {t('footerRights')} {t('footerCurated')}
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-sky-500 transition-colors cursor-pointer"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
