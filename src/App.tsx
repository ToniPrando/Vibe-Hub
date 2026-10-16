import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ArticleCard } from './components/ArticleCard';
import { ArticleView } from './components/ArticleView';
import { AdminPanel } from './components/AdminPanel';
import { BookmarksView } from './components/BookmarksView';
import { SearchBarModal } from './components/SearchBarModal';
import { CategoriesBar } from './components/CategoriesBar';
import { TrendingSection } from './components/TrendingSection';
import { NewsletterSection } from './components/NewsletterSection';
import { CATEGORIES } from './data/categories';
import { AnimatedVibeBackground } from './components/AnimatedVibeBackground';
import { Sparkles, ArrowRight, Filter, AlertCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    articles,
    selectedCategoryId,
    openCategory,
    activeTag,
    setActiveTag,
    notification,
    language,
    t
  } = useApp();

  const [sortBy, setSortBy] = useState<'newest' | 'views' | 'likes'>('newest');

  // Featured article (manchete principal)
  const featuredArticle = articles.find((a) => a.isFeatured) || articles[0];

  // Filtering articles
  let displayedArticles = articles.filter((a) => a.status === 'published');

  if (selectedCategoryId) {
    displayedArticles = displayedArticles.filter((a) => a.categoryId === selectedCategoryId);
  }

  if (activeTag) {
    displayedArticles = displayedArticles.filter((a) =>
      a.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase())
    );
  }

  // Sorting
  displayedArticles.sort((a, b) => {
    if (sortBy === 'views') return b.views - a.views;
    if (sortBy === 'likes') return b.likes - a.likes;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  // Current category metadata
  const currentCategoryObj = CATEGORIES.find((c) => c.id === selectedCategoryId);

  return (
    <div className="relative flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-[#070b14] dark:text-slate-100 transition-colors overflow-x-hidden">
      {/* Animated 3D / Video Background */}
      <AnimatedVibeBackground />

      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-sky-500 dark:text-white shadow-2xl border border-sky-400/30 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar />

      {/* Search Modal */}
      <SearchBarModal />

      {/* View Switcher */}
      <main className="flex-1 relative z-10">
        {currentView === 'article' && <ArticleView />}

        {currentView === 'admin' && <AdminPanel />}

        {currentView === 'bookmarks' && <BookmarksView />}

        {(currentView === 'home' || currentView === 'category') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Category View Header if in category filter */}
            {selectedCategoryId && currentCategoryObj && (
              <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-500/10 via-amber-500/5 to-emerald-500/10 border border-slate-200 dark:border-slate-800">
                <span className="text-xs uppercase font-extrabold tracking-widest text-sky-600 dark:text-sky-400">
                  {t('navCategories')}
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white mt-1">
                  {currentCategoryObj.name[language]}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
                  {currentCategoryObj.description[language]}
                </p>
              </div>
            )}

            {/* Featured Lead Story (shown on home when no tag or category is selected) */}
            {currentView === 'home' && !selectedCategoryId && !activeTag && featuredArticle && (
              <section className="mb-12">
                <ArticleCard
                  article={featuredArticle}
                  variant="featured"
                  onTagClick={(tag) => setActiveTag(tag)}
                />
              </section>
            )}

            {/* Interactive Category & Tag Filter Switcher */}
            <CategoriesBar
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={(id) => {
                if (id) {
                  openCategory(id);
                } else {
                  openCategory('');
                  setCurrentView('home');
                }
              }}
              activeTag={activeTag}
              onSelectTag={(tag) => setActiveTag(tag)}
            />

            {/* Trending Rail */}
            {currentView === 'home' && !selectedCategoryId && !activeTag && (
              <TrendingSection />
            )}

            {/* Latest Articles Feed Section */}
            <section className="my-10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
                    {selectedCategoryId
                      ? currentCategoryObj?.name[language]
                      : activeTag
                      ? `Notícias sobre #${activeTag}`
                      : 'Todas as Publicações'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {displayedArticles.length} notícias disponíveis
                  </p>
                </div>

                {/* Sort control */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-medium hidden sm:inline">{t('sortBy')}:</span>
                  <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <button
                      onClick={() => setSortBy('newest')}
                      className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                        sortBy === 'newest'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {t('sortNewest')}
                    </button>
                    <button
                      onClick={() => setSortBy('views')}
                      className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                        sortBy === 'views'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {t('sortViews')}
                    </button>
                    <button
                      onClick={() => setSortBy('likes')}
                      className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                        sortBy === 'likes'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {t('sortLikes')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid of Articles */}
              {displayedArticles.length === 0 ? (
                <div className="py-16 text-center text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                  <AlertCircle className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm font-semibold">Nenhuma notícia encontrada para este filtro.</p>
                  <button
                    onClick={() => {
                      openCategory('');
                      setActiveTag(null);
                      setCurrentView('home');
                    }}
                    className="mt-4 px-4 py-2 bg-sky-500 text-white text-xs font-bold rounded-xl"
                  >
                    Ver todas as notícias
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="standard"
                      onTagClick={(tag) => setActiveTag(tag)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Newsletter Subscription Box */}
            <NewsletterSection />
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
