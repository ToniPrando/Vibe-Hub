import React from 'react';
import { useApp } from '../context/AppContext';
import { Article } from '../types';
import { CATEGORIES } from '../data/categories';
import { Clock, Eye, Heart, Bookmark, ArrowUpRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  variant?: 'featured' | 'standard' | 'horizontal' | 'compact';
  onTagClick?: (tag: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'standard',
  onTagClick
}) => {
  const { openArticle, toggleBookmark, toggleLikeArticle, bookmarks, language, t } = useApp();

  const isBookmarked = bookmarks.includes(article.id);
  const cat = CATEGORIES.find((c) => c.id === article.categoryId);

  // Localized text
  const localized = article.translations?.[language];
  const title = localized?.title || article.title;
  const subtitle = localized?.subtitle || article.subtitle;
  const excerpt = localized?.excerpt || article.excerpt;

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  // 1. Featured Hero Layout
  if (variant === 'featured') {
    return (
      <article className="group relative rounded-3xl overflow-hidden bg-white dark:bg-[#0c1425] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
          {/* Visual Column */}
          <div
            className="lg:col-span-7 relative overflow-hidden min-h-[320px] lg:min-h-[460px] cursor-pointer"
            onClick={() => openArticle(article.id)}
          >
            <img
              src={article.coverImage}
              alt={title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Ambient vignette gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent lg:hidden" />

            {/* Mobile Title Overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-white lg:hidden">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                {cat?.name[language]}
              </span>
              <h2 className="text-xl font-bold font-display line-clamp-2 mt-1">
                {title}
              </h2>
            </div>
          </div>

          {/* Editorial Content Column */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Zero-Pill Metadata */}
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                <span className="font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                  {cat?.name[language]}
                </span>
                <span aria-hidden="true">·</span>
                <span>{formatDate(article.publishedAt)}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="tabular-nums">{article.readTime} {t('readTime')}</span>
                </span>
              </div>

              {/* Headline */}
              <h2
                onClick={() => openArticle(article.id)}
                className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white leading-tight cursor-pointer group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors"
                style={{ textWrap: 'balance' }}
              >
                {title}
              </h2>

              {/* Subtitle / Excerpt */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3.5 leading-relaxed line-clamp-3">
                {subtitle || excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {article.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagClick?.(tag)}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 font-medium transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Author Footer & Actions */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-10 h-10 rounded-full object-cover bg-slate-200 dark:bg-slate-700"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {article.author.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {article.author.role[language]}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleLikeArticle(article.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    article.likedByMe
                      ? 'text-red-500 bg-red-50 dark:bg-red-950/30'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                  title={t('likesCount')}
                >
                  <Heart className={`w-4 h-4 ${article.likedByMe ? 'fill-red-500' : ''}`} />
                </button>

                <button
                  onClick={() => toggleBookmark(article.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    isBookmarked
                      ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                  title={isBookmarked ? 'Salvo' : 'Salvar'}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                </button>

                <button
                  onClick={() => openArticle(article.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-sky-500 dark:hover:bg-sky-600 text-white text-xs font-semibold rounded-lg transition-colors ml-1"
                >
                  <span>Ler</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // 2. Standard Grid Card
  if (variant === 'standard') {
    return (
      <article className="group flex flex-col justify-between rounded-2xl overflow-hidden bg-white dark:bg-[#0c1425] border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-lg transition-all duration-300">
        <div>
          {/* Card Image */}
          <div
            className="relative aspect-16/9 overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer"
            onClick={() => openArticle(article.id)}
          >
            <img
              src={article.coverImage}
              alt={title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="p-5">
            {/* Zero-Pill Unboxed Metadata */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-bold text-sky-600 dark:text-sky-400">
                {cat?.name[language]}
              </span>
              <span aria-hidden="true">·</span>
              <span>{formatDate(article.publishedAt)}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{article.readTime} min</span>
            </div>

            {/* Title */}
            <h3
              onClick={() => openArticle(article.id)}
              className="text-lg font-bold font-display text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
              style={{ textWrap: 'balance' }}
            >
              {title}
            </h3>

            {/* Excerpt */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
              {excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              {article.tags.slice(0, 3).map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagClick?.(tag)}
                  className="text-[11px] text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[110px]">
              {article.author.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 tabular-nums text-slate-400">
              <Eye className="w-3.5 h-3.5" />
              {article.views}
            </span>

            <button
              onClick={() => toggleBookmark(article.id)}
              className={`hover:text-amber-500 transition-colors ${
                isBookmarked ? 'text-amber-500' : 'text-slate-400'
              }`}
              title="Salvar"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>
      </article>
    );
  }

  // 3. Compact Horizontal Row
  return (
    <article
      onClick={() => openArticle(article.id)}
      className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white dark:hover:bg-[#0c1425] border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all cursor-pointer"
    >
      <img
        src={article.coverImage}
        alt={title}
        referrerPolicy="no-referrer"
        className="w-20 h-20 rounded-lg object-cover bg-slate-100 dark:bg-slate-900 shrink-0 group-hover:scale-102 transition-transform"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-semibold text-sky-600 dark:text-sky-400">
            {cat?.name[language]}
          </span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{article.readTime} min</span>
        </div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
          {title}
        </h4>
        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
          <span>{formatDate(article.publishedAt)}</span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Heart className="w-3 h-3" />
            {article.likes}
          </span>
        </div>
      </div>
    </article>
  );
};
