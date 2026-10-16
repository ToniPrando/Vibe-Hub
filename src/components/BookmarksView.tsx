import React from 'react';
import { useApp } from '../context/AppContext';
import { ArticleCard } from './ArticleCard';
import { Bookmark, ArrowLeft } from 'lucide-react';

export const BookmarksView: React.FC = () => {
  const { bookmarks, articles, setCurrentView, t } = useApp();

  const bookmarkedArticles = articles.filter((a) => bookmarks.includes(a.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 mb-8">
        <div>
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-500 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('backToHome')}</span>
          </button>
          <div className="flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-amber-500 fill-amber-500" />
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              {t('navBookmarks')}
            </h1>
            <span className="text-sm font-mono text-slate-400">({bookmarkedArticles.length})</span>
          </div>
        </div>
      </div>

      {bookmarkedArticles.length === 0 ? (
        <div className="py-20 text-center text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl mx-auto">
          <Bookmark className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Nenhum artigo salvo ainda
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Clique no ícone de marcador nos artigos para guardá-los e ler confortavelmente quando quiser.
          </p>
          <button
            onClick={() => setCurrentView('home')}
            className="mt-6 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Explorar Notícias
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="standard" />
          ))}
        </div>
      )}
    </div>
  );
};
