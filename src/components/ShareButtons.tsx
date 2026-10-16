import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Article } from '../types';
import { Copy, Check, Share2, MessageCircle, Send } from 'lucide-react';

interface ShareButtonsProps {
  article: Article;
  variant?: 'inline' | 'compact' | 'floating';
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ article, variant = 'inline' }) => {
  const { t, showNotification } = useApp();
  const [copied, setCopied] = useState(false);

  // Use current page URL or formatted article link
  const articleUrl = typeof window !== 'undefined' ? `${window.location.origin}#article-${article.id}` : '';
  const shareTitle = `${article.title} — Vibe Hub`;
  const shareText = `${article.title}: ${article.excerpt}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(articleUrl || window.location.href);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = articleUrl || window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      showNotification(t('linkCopied'));
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showNotification(t('linkCopied'));
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: articleUrl || window.location.href
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400',
      bgColor: 'bg-emerald-500',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle}\n\n${articleUrl}`)}`
    },
    {
      name: 'X (Twitter)',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: 'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white',
      bgColor: 'bg-slate-900',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(articleUrl)}&hashtags=VibeHub,${article.tags.join(',')}`
    },
    {
      name: 'LinkedIn',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      color: 'hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-950/40 dark:hover:text-sky-400',
      bgColor: 'bg-sky-700',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`
    },
    {
      name: 'Facebook',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
        </svg>
      ),
      color: 'hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400',
      bgColor: 'bg-blue-600',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'hover:bg-cyan-50 hover:text-cyan-600 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-400',
      bgColor: 'bg-sky-500',
      url: `https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(shareTitle)}`
    }
  ];

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleNativeShare}
          className="p-1.5 text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 rounded-md transition-colors"
          title={t('shareArticle')}
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleCopyLink}
          className="p-1.5 text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 rounded-md transition-colors"
          title={t('copyLink')}
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  return (
    <div className="py-4 border-y border-slate-200/80 dark:border-slate-800/80 my-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <Share2 className="w-4 h-4 text-sky-500" />
          <span>{t('shareArticle')}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {shareLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors ${item.color}`}
                title={`Compartilhar no ${item.name}`}
                aria-label={`Compartilhar no ${item.name}`}
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              copied
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t('linkCopied').slice(0, 12)}...</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('copyLink')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
