import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { Search, X, Clock, ArrowRight, Tag } from 'lucide-react';

export const SearchBarModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    articles,
    openArticle,
    language,
    t
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedCategoryFilter(null);
    }
  }, [isSearchOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  // Filter articles
  const cleanQuery = query.trim().toLowerCase();

  const filteredArticles = articles.filter((article) => {
    // Category check
    if (selectedCategoryFilter && article.categoryId !== selectedCategoryFilter) {
      return false;
    }

    if (!cleanQuery) return true;

    // Translated fields support
    const localized = article.translations?.[language];
    const titleMatch = (localized?.title || article.title).toLowerCase().includes(cleanQuery);
    const excerptMatch = (localized?.excerpt || article.excerpt).toLowerCase().includes(cleanQuery);
    const contentMatch = (localized?.content || article.content).toLowerCase().includes(cleanQuery);
    const tagMatch = article.tags.some((tag) => tag.toLowerCase().includes(cleanQuery));
    const authorMatch = article.author.name.toLowerCase().includes(cleanQuery);

    return titleMatch || excerptMatch || contentMatch || tagMatch || authorMatch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0c1425] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-sky-500 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-transparent border-none outline-none text-base text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2"
              title="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Quick Category Filters */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategoryFilter(null)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCategoryFilter === null
                ? 'bg-sky-500 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {t('filterAll')}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === cat.id ? null : cat.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategoryFilter === cat.id
                  ? 'bg-sky-500 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat.name[language]}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredArticles.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold">{t('searchNoResults')} "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">{t('searchTryDifferent')}</p>
            </div>
          ) : (
            filteredArticles.map((article) => {
              const cat = CATEGORIES.find((c) => c.id === article.categoryId);
              const localized = article.translations?.[language];
              const title = localized?.title || article.title;
              const excerpt = localized?.excerpt || article.excerpt;

              return (
                <div
                  key={article.id}
                  onClick={() => {
                    openArticle(article.id);
                    setIsSearchOpen(false);
                  }}
                  className="py-3 px-3 hover:bg-slate-50 dark:hover:bg-slate-900/60 rounded-xl cursor-pointer transition-colors group flex items-start gap-4"
                >
                  <img
                    src={article.coverImage}
                    alt={title}
                    className="w-16 h-16 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-800"
                  />
                  <div className="flex-1 min-w-0">
                    {/* Zero-pill metadata */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span className="font-semibold text-sky-600 dark:text-sky-400">
                        {cat?.name[language]}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="tabular-nums">{article.readTime} {t('readTime')}</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                      {title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {excerpt}
                    </p>

                    {/* Tag list */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-sky-500 inline-flex items-center gap-0.5"
                        >
                          <Tag className="w-2.5 h-2.5 opacity-60" />
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-sky-500 shrink-0 self-center transition-colors" />
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer info */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>{filteredArticles.length} {t('searchResultsFound')}</span>
          <span>Dica: Pressione ESC para fechar</span>
        </div>
      </div>
    </div>
  );
};
