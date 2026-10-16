import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { Cpu, Rocket, Globe, Gamepad2, Sparkles, TrendingUp, Layers } from 'lucide-react';

interface CategoriesBarProps {
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  activeTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export const CategoriesBar: React.FC<CategoriesBarProps> = ({
  selectedCategoryId,
  onSelectCategory,
  activeTag,
  onSelectTag
}) => {
  const { language, t } = useApp();

  const iconMap: Record<string, React.ElementType> = {
    Cpu,
    Rocket,
    Globe,
    Gamepad2,
    Sparkles,
    TrendingUp
  };

  const trendingTags = [
    'ComputaçãoQuântica',
    'InteligênciaArtificial',
    'Astronomia',
    'Sustentabilidade',
    'Games',
    'Produtividade',
    'Inovação',
    'RealidadeVirtual'
  ];

  return (
    <div className="py-6 border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Category Segmented Control (Interactive Filter Buttons - Allowed under zero-pill rule as functional buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => {
            onSelectCategory(null);
            onSelectTag(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
            selectedCategoryId === null && activeTag === null
              ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-white shadow-sm'
              : 'bg-white dark:bg-[#0c1425] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t('filterAll')}</span>
        </button>

        {CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.icon] || Sparkles;
          const isSelected = selectedCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                onSelectTag(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-white shadow-sm'
                  : 'bg-white dark:bg-[#0c1425] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5 opacity-80" />
              <span>{cat.name[language]}</span>
            </button>
          );
        })}
      </div>

      {/* Trending Tag Filters Strip */}
      <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar text-xs text-slate-500">
        <span className="font-semibold text-slate-400 shrink-0 text-[11px] uppercase tracking-wider">
          {t('filterTrending')}:
        </span>
        {trendingTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelectTag(activeTag === tag ? null : tag)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTag === tag
                ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300 dark:border-sky-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
};
