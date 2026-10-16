import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Article,
  Comment,
  Language,
  NewsletterSubscriber,
  ThemeMode,
  CustomLogoMedia,
  BackgroundAnimationConfig
} from '../types';
import { INITIAL_ARTICLES, INITIAL_COMMENTS, INITIAL_SUBSCRIBERS } from '../data/initialArticles';
import { TRANSLATIONS } from '../data/translations';

interface AppContextType {
  // State
  articles: Article[];
  comments: Comment[];
  subscribers: NewsletterSubscriber[];
  language: Language;
  theme: ThemeMode;
  bookmarks: string[];
  currentView: 'home' | 'article' | 'category' | 'admin' | 'bookmarks';
  selectedArticleId: string | null;
  selectedCategoryId: string | null;
  searchQuery: string;
  isSearchOpen: boolean;
  activeTag: string | null;
  notification: string | null;
  customLogoMedia: CustomLogoMedia | null;
  backgroundConfig: BackgroundAnimationConfig;

  // Actions
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
  setCurrentView: (view: 'home' | 'article' | 'category' | 'admin' | 'bookmarks') => void;
  openArticle: (id: string) => void;
  openCategory: (catId: string) => void;
  setSearchQuery: (query: string) => void;
  setIsSearchOpen: (open: boolean) => void;
  setActiveTag: (tag: string | null) => void;
  toggleBookmark: (articleId: string) => void;
  toggleLikeArticle: (articleId: string) => void;
  addComment: (articleId: string, content: string, authorName: string, parentId?: string | null) => void;
  likeComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;
  addArticle: (newArticleData: Omit<Article, 'id' | 'views' | 'likes' | 'shares'>) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
  subscribeNewsletter: (email: string, name?: string, frequency?: 'daily' | 'weekly' | 'breaking', topics?: string[]) => boolean;
  setCustomLogoMedia: (media: CustomLogoMedia | null) => void;
  setBackgroundConfig: (config: BackgroundAnimationConfig) => void;
  resetToDefaultData: () => void;
  showNotification: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ARTICLES_STORAGE_KEY = 'vibehub_articles_v1';
const COMMENTS_STORAGE_KEY = 'vibehub_comments_v1';
const SUBSCRIBERS_STORAGE_KEY = 'vibehub_subscribers_v1';
const BOOKMARKS_STORAGE_KEY = 'vibehub_bookmarks_v1';
const LANG_STORAGE_KEY = 'vibehub_lang_v1';
const THEME_STORAGE_KEY = 'vibehub_theme_v1';
const CUSTOM_LOGO_STORAGE_KEY = 'vibehub_custom_logo_v1';
const BG_CONFIG_STORAGE_KEY = 'vibehub_bg_config_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language State
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language;
    return saved && ['pt', 'en', 'es'].includes(saved) ? saved : 'pt';
  });

  // 2. Theme State (Dark by default)
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // 3. Articles State
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem(ARTICLES_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ARTICLES;
      }
    }
    return INITIAL_ARTICLES;
  });

  useEffect(() => {
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
  }, [articles]);

  // 4. Comments State
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem(COMMENTS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_COMMENTS;
      }
    }
    return INITIAL_COMMENTS;
  });

  useEffect(() => {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
  }, [comments]);

  // 5. Subscribers State
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => {
    const saved = localStorage.getItem(SUBSCRIBERS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_SUBSCRIBERS;
      }
    }
    return INITIAL_SUBSCRIBERS;
  });

  useEffect(() => {
    localStorage.setItem(SUBSCRIBERS_STORAGE_KEY, JSON.stringify(subscribers));
  }, [subscribers]);

  // 6. Bookmarks State
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  // 7. Custom Logo / Media State (Photo or Video in place of logo)
  const [customLogoMedia, setCustomLogoMediaState] = useState<CustomLogoMedia | null>(() => {
    const saved = localStorage.getItem(CUSTOM_LOGO_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const setCustomLogoMedia = (media: CustomLogoMedia | null) => {
    setCustomLogoMediaState(media);
    if (media) {
      localStorage.setItem(CUSTOM_LOGO_STORAGE_KEY, JSON.stringify(media));
      showNotification(media.type === 'video' ? 'Vídeo definido como logotipo!' : 'Foto definida como logotipo!');
    } else {
      localStorage.removeItem(CUSTOM_LOGO_STORAGE_KEY);
      showNotification('Logotipo original restaurado.');
    }
  };

  // 8. Background Animation Config (Video or 3D Canvas)
  const [backgroundConfig, setBackgroundConfigState] = useState<BackgroundAnimationConfig>(() => {
    const saved = localStorage.getItem(BG_CONFIG_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      enabled: true,
      videoUrl: null,
      opacity: 0.22,
      mode: 'canvas3d'
    };
  });

  const setBackgroundConfig = (config: BackgroundAnimationConfig) => {
    setBackgroundConfigState(config);
    localStorage.setItem(BG_CONFIG_STORAGE_KEY, JSON.stringify(config));
    showNotification('Animação de fundo atualizada!');
  };

  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'article' | 'category' | 'admin' | 'bookmarks'>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Helper notification toast
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Translation function
  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS['pt'];
    return langDict[key] || TRANSLATIONS['pt'][key] || key;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      const nextTheme: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;
      if (nextTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-theme', 'dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        root.setAttribute('data-theme', 'light');
        root.style.colorScheme = 'light';
      }
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      showNotification(nextTheme === 'dark' ? 'Modo Escuro ativado 🌙' : 'Modo Claro ativado ☀️');
      return nextTheme;
    });
  };

  // Open Article & record view
  const openArticle = (id: string) => {
    setSelectedArticleId(id);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Increment view count
    setArticles((prev) =>
      prev.map((art) => (art.id === id ? { ...art, views: art.views + 1 } : art))
    );
  };

  const openCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    setActiveTag(null);
    setCurrentView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleBookmark = (articleId: string) => {
    setBookmarks((prev) => {
      const exists = prev.includes(articleId);
      if (exists) {
        showNotification(t('bookmarkRemoved'));
        return prev.filter((id) => id !== articleId);
      } else {
        showNotification(t('bookmarkAdded'));
        return [...prev, articleId];
      }
    });
  };

  const toggleLikeArticle = (articleId: string) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === articleId) {
          const isLiked = art.likedByMe;
          return {
            ...art,
            likes: isLiked ? art.likes - 1 : art.likes + 1,
            likedByMe: !isLiked
          };
        }
        return art;
      })
    );
  };

  const addComment = (articleId: string, content: string, authorName: string, parentId: string | null = null) => {
    const cleanContent = content.trim();
    if (!cleanContent) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      articleId,
      parentId,
      authorName: authorName.trim() || 'Leitor Anônimo',
      authorAvatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(authorName || 'leitor')}`,
      authorRole: 'reader',
      content: cleanContent,
      createdAt: new Date().toISOString(),
      likes: 1,
      likedByMe: true
    };

    setComments((prev) => [newComment, ...prev]);
    showNotification(t('commentPosted'));
  };

  const likeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const isLiked = c.likedByMe;
          return {
            ...c,
            likes: isLiked ? c.likes - 1 : c.likes + 1,
            likedByMe: !isLiked
          };
        }
        return c;
      })
    );
  };

  const deleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId && c.parentId !== commentId));
    showNotification('Comentário removido.');
  };

  const addArticle = (newArticleData: Omit<Article, 'id' | 'views' | 'likes' | 'shares'>) => {
    const id = `vh-${Date.now().toString().slice(-4)}`;
    const newArticle: Article = {
      ...newArticleData,
      id,
      views: 1,
      likes: 0,
      shares: 0,
      likedByMe: false
    };

    setArticles((prev) => [newArticle, ...prev]);
    showNotification(t('adminArticleSaved'));
  };

  const updateArticle = (updatedArticle: Article) => {
    setArticles((prev) =>
      prev.map((art) => (art.id === updatedArticle.id ? updatedArticle : art))
    );
    showNotification(t('adminArticleSaved'));
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((art) => art.id !== id));
    setComments((prev) => prev.filter((c) => c.articleId !== id));
    setBookmarks((prev) => prev.filter((artId) => artId !== id));
    showNotification('Artigo excluído com sucesso.');
  };

  const subscribeNewsletter = (
    email: string,
    name?: string,
    frequency: 'daily' | 'weekly' | 'breaking' = 'weekly',
    topics: string[] = ['tech', 'planet', 'culture']
  ): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) return false;

    // Check if already subscribed
    const exists = subscribers.some((sub) => sub.email.toLowerCase() === cleanEmail);
    if (exists) {
      showNotification('Este e-mail já está cadastrado na newsletter!');
      return true;
    }

    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: cleanEmail,
      name: name?.trim(),
      frequency,
      topics,
      subscribedAt: new Date().toISOString()
    };

    setSubscribers((prev) => [newSub, ...prev]);
    showNotification(t('newsletterSuccess'));
    return true;
  };

  const resetToDefaultData = () => {
    setArticles(INITIAL_ARTICLES);
    setComments(INITIAL_COMMENTS);
    setSubscribers(INITIAL_SUBSCRIBERS);
    setBookmarks([]);
    setCustomLogoMediaState(null);
    setBackgroundConfigState({
      enabled: true,
      videoUrl: null,
      opacity: 0.22,
      mode: 'canvas3d'
    });
    localStorage.removeItem(ARTICLES_STORAGE_KEY);
    localStorage.removeItem(COMMENTS_STORAGE_KEY);
    localStorage.removeItem(SUBSCRIBERS_STORAGE_KEY);
    localStorage.removeItem(BOOKMARKS_STORAGE_KEY);
    localStorage.removeItem(CUSTOM_LOGO_STORAGE_KEY);
    localStorage.removeItem(BG_CONFIG_STORAGE_KEY);
    showNotification(t('adminDataReset'));
  };

  // Keyboard shortcut Ctrl+K / Cmd+K for quick search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        articles,
        comments,
        subscribers,
        language,
        theme,
        bookmarks,
        currentView,
        selectedArticleId,
        selectedCategoryId,
        searchQuery,
        isSearchOpen,
        activeTag,
        notification,
        customLogoMedia,
        backgroundConfig,
        t,
        setLanguage,
        toggleTheme,
        setCurrentView,
        openArticle,
        openCategory,
        setSearchQuery,
        setIsSearchOpen,
        setActiveTag,
        toggleBookmark,
        toggleLikeArticle,
        addComment,
        likeComment,
        deleteComment,
        addArticle,
        updateArticle,
        deleteArticle,
        subscribeNewsletter,
        setCustomLogoMedia,
        setBackgroundConfig,
        resetToDefaultData,
        showNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
