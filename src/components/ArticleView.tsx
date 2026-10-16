import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { ShareButtons } from './ShareButtons';
import { CommentsSection } from './CommentsSection';
import { ArticleCard } from './ArticleCard';
import {
  Clock,
  Eye,
  Heart,
  Bookmark,
  ArrowLeft,
  Volume2,
  VolumeX,
  Type,
  Calendar,
  Share2
} from 'lucide-react';

export const ArticleView: React.FC = () => {
  const {
    selectedArticleId,
    articles,
    openArticle,
    setCurrentView,
    toggleBookmark,
    toggleLikeArticle,
    bookmarks,
    language,
    t,
    showNotification
  } = useApp();

  const [fontSizeLevel, setFontSizeLevel] = useState<number>(0); // -1 (small), 0 (normal), 1 (large)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const article = articles.find((a) => a.id === selectedArticleId) || articles[0];

  // Track scroll progress for reading depth indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Web Speech API for "Ouvir Artigo"
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article.id]);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      showNotification('Leitura por voz não suportada neste navegador.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const localized = article.translations?.[language];
      const textToRead = `${localized?.title || article.title}. ${localized?.subtitle || article.subtitle}. ${localized?.content || article.content}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR';
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      showNotification(t('listening'));
    }
  };

  if (!article) return null;

  const isBookmarked = bookmarks.includes(article.id);
  const cat = CATEGORIES.find((c) => c.id === article.categoryId);

  // Localized text
  const localized = article.translations?.[language];
  const title = localized?.title || article.title;
  const subtitle = localized?.subtitle || article.subtitle;
  const content = localized?.content || article.content;

  // Format date
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  // Font size class mapping
  const bodySizeClass =
    fontSizeLevel === -1
      ? 'text-base leading-relaxed'
      : fontSizeLevel === 1
      ? 'text-xl leading-loose'
      : 'text-lg leading-relaxed';

  // Adjacent articles for bottom navigation
  const currentIndex = articles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  // Related articles from same category or trending
  const relatedArticles = articles
    .filter((a) => a.id !== article.id && a.categoryId === article.categoryId)
    .slice(0, 3);

  return (
    <article className="min-h-screen pb-20">
      {/* Reading Progress Bar */}
      <div className="fixed top-16 left-0 right-0 z-30 h-1 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-sky-500 to-blue-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Utility Bar */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-[#070d1a]/60 backdrop-blur-xs py-3 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backToArticles')}</span>
          </button>

          {/* Reader Controls: Font Size, Audio, Bookmark, Like */}
          <div className="flex items-center gap-2">
            {/* Audio Listen Button */}
            <button
              onClick={toggleSpeech}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isSpeaking
                  ? 'bg-sky-500 text-white border-sky-500 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
              title={isSpeaking ? t('stopListening') : t('listenArticle')}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {isSpeaking ? t('stopListening') : t('listenArticle')}
              </span>
            </button>

            {/* Font Size Adjuster */}
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setFontSizeLevel((prev) => Math.max(-1, prev - 1))}
                className={`px-2 py-1 rounded transition-colors ${
                  fontSizeLevel === -1
                    ? 'bg-white dark:bg-slate-900 font-bold text-sky-500 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={t('decreaseFont')}
              >
                A-
              </button>
              <button
                onClick={() => setFontSizeLevel(0)}
                className={`px-2 py-1 rounded transition-colors ${
                  fontSizeLevel === 0
                    ? 'bg-white dark:bg-slate-900 font-bold text-sky-500 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Type className="w-3 h-3" />
              </button>
              <button
                onClick={() => setFontSizeLevel((prev) => Math.min(1, prev + 1))}
                className={`px-2 py-1 rounded transition-colors ${
                  fontSizeLevel === 1
                    ? 'bg-white dark:bg-slate-900 font-bold text-sky-500 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={t('increaseFont')}
              >
                A+
              </button>
            </div>

            {/* Like */}
            <button
              onClick={() => toggleLikeArticle(article.id)}
              className={`p-2 rounded-lg border transition-colors ${
                article.likedByMe
                  ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:text-red-500'
              }`}
              title="Curtir notícia"
            >
              <Heart className={`w-4 h-4 ${article.likedByMe ? 'fill-red-500' : ''}`} />
            </button>

            {/* Bookmark */}
            <button
              onClick={() => toggleBookmark(article.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:text-amber-500'
              }`}
              title="Salvar artigo"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Reading Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        {/* Category & Metadata: Zero-Pill Header */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">
          <span className="font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            {cat?.name[language]}
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(article.publishedAt)}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="tabular-nums">{article.readTime} {t('readTime')}</span>
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-[1.15]"
          style={{ textWrap: 'balance' }}
        >
          {title}
        </h1>

        {/* Subtitle / Deck */}
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal mt-5 leading-relaxed">
          {subtitle}
        </p>

        {/* Author Byline & Stats Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 my-6 border-y border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800"
            />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {article.author.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {article.author.role[language]}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Eye className="w-4 h-4 text-slate-400" />
              <span>{article.views} {t('viewsCount')}</span>
            </span>
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Heart className="w-4 h-4 text-slate-400" />
              <span>{article.likes} {t('likesCount')}</span>
            </span>
          </div>
        </div>

        {/* Main Cover Image */}
        <figure className="my-8">
          <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-lg">
            <img
              src={article.coverImage}
              alt={title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[540px] object-cover"
            />
          </div>
          {article.coverImageCaption && (
            <figcaption className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 text-center italic">
              {article.coverImageCaption}
            </figcaption>
          )}
        </figure>

        {/* Editorial Body Prose with First-Letter Drop Cap */}
        <div
          className={`max-w-prose mx-auto font-sans text-slate-800 dark:text-slate-200 ${bodySizeClass} space-y-6 pt-4`}
        >
          {content.split('\n\n').map((paragraph, idx) => {
            // Heading detection
            if (paragraph.startsWith('### ')) {
              return (
                <h3
                  key={idx}
                  className="text-2xl font-bold font-display text-slate-900 dark:text-white pt-6 pb-2 tracking-tight"
                >
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('## ')) {
              return (
                <h2
                  key={idx}
                  className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white pt-8 pb-3 tracking-tight"
                >
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }

            // Ordered list detection
            if (/^\d+\.\s/.test(paragraph)) {
              const lines = paragraph.split('\n');
              return (
                <ol key={idx} className="list-decimal pl-6 space-y-2.5 text-slate-700 dark:text-slate-300">
                  {lines.map((line, lIdx) => (
                    <li key={lIdx} className="leading-relaxed">
                      {line.replace(/^\d+\.\s/, '')}
                    </li>
                  ))}
                </ol>
              );
            }

            // Regular paragraph - first paragraph gets elegant drop cap
            if (idx === 0) {
              return (
                <p
                  key={idx}
                  className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-sky-600 dark:first-letter:text-sky-400"
                >
                  {paragraph}
                </p>
              );
            }

            return <p key={idx}>{paragraph}</p>;
          })}
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 mr-2">Tags:</span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Social Share Ribbon */}
        <ShareButtons article={article} />

        {/* Author Bio Box */}
        <div className="my-10 p-6 rounded-2xl bg-slate-50 dark:bg-[#0c1425] border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-4">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-16 h-16 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
          />
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {article.author.name}
            </h4>
            <p className="text-xs font-medium text-sky-600 dark:text-sky-400 mb-2">
              {article.author.role[language]}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {article.author.bio[language]}
            </p>
          </div>
        </div>

        {/* Previous & Next Articles Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10 pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
          {prevArticle ? (
            <div
              onClick={() => openArticle(prevArticle.id)}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/40 cursor-pointer transition-colors"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                ← {t('previousArticle')}
              </span>
              <h5 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                {prevArticle.translations?.[language]?.title || prevArticle.title}
              </h5>
            </div>
          ) : <div />}

          {nextArticle ? (
            <div
              onClick={() => openArticle(nextArticle.id)}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/40 cursor-pointer transition-colors text-right"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {t('nextArticle')} →
              </span>
              <h5 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                {nextArticle.translations?.[language]?.title || nextArticle.title}
              </h5>
            </div>
          ) : <div />}
        </div>

        {/* Related Articles Strip */}
        {relatedArticles.length > 0 && (
          <section className="my-12">
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-6">
              {t('relatedArticles')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <ArticleCard key={rel.id} article={rel} variant="standard" />
              ))}
            </div>
          </section>
        )}

        {/* Interactive Comments Section */}
        <CommentsSection articleId={article.id} />
      </div>
    </article>
  );
};
