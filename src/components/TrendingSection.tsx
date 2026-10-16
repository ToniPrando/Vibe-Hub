import React from 'react';
import { useApp } from '../context/AppContext';
import { ArticleCard } from './ArticleCard';
import { Flame, ArrowRight } from 'lucide-react';

export const TrendingSection: React.FC = () => {
  const { articles, openCategory, language, t } = useApp();

  const trendingArticles = articles.filter((a) => a.isTrending || a.views > 7000).slice(0, 3);

  if (trendingArticles.length === 0) return null;

  return (
    <section id="trending-section" className="my-14 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500 dark:text-orange-400">
            <Flame className="w-5 h-5 fill-orange-500" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
              Assuntos do Momento
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              O que está movimentando o debate global hoje
            </p>
          </div>
        </div>

        <button
          onClick={() => openCategory('tech')}
          className="hidden sm:flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 transition-colors"
        >
          <span>Ver mais novidades</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trendingArticles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="standard" />
        ))}
      </div>
    </section>
  );
};
