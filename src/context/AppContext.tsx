import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User
} from 'firebase/auth';
import {
  db,
  auth,
  googleProvider,
  handleFirestoreError,
  OperationType
} from '../firebase';
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
import {
  safeLocalStorageGet,
  safeLocalStorageSet,
  safeLocalStorageRemove
} from '../utils/storage';
import {
  saveMediaItem,
  getMediaItem,
  removeMediaItem
} from '../utils/mediaStorage';

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

  // Firebase Auth & Cloud Sync
  currentUser: User | null;
  isAuthLoading: boolean;
  isFirebaseConnected: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;

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
  addComment: (articleId: string, content: string, authorName: string, parentId?: string | null) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  addArticle: (newArticleData: Omit<Article, 'id' | 'views' | 'likes' | 'shares'>) => Promise<void>;
  updateArticle: (article: Article) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  subscribeNewsletter: (email: string, name?: string, frequency?: 'daily' | 'weekly' | 'breaking', topics?: string[]) => Promise<boolean>;
  setCustomLogoMedia: (media: CustomLogoMedia | null) => Promise<void>;
  setBackgroundConfig: (config: BackgroundAnimationConfig) => Promise<void>;
  resetToDefaultData: () => Promise<void>;
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
    const saved = safeLocalStorageGet(LANG_STORAGE_KEY) as Language;
    return saved && ['pt', 'en', 'es'].includes(saved) ? saved : 'pt';
  });

  // 2. Theme State (Dark by default)
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = safeLocalStorageGet(THEME_STORAGE_KEY) as ThemeMode;
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
    safeLocalStorageSet(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // 3. Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showNotification('Conectado com o Google com sucesso! 🎉');
    } catch (error) {
      console.error('Login error:', error);
      showNotification('Não foi possível autenticar com o Google.');
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      showNotification('Sessão encerrada com sucesso.');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 4. Articles State (Local fallback + Cloud Firestore)
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = safeLocalStorageGet(ARTICLES_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ARTICLES;
      }
    }
    return INITIAL_ARTICLES;
  });

  // Seed / Sync Articles with Firestore
  const hasSeededArticles = useRef(false);
  useEffect(() => {
    const articlesCol = collection(db, 'articles');
    const unsubscribe = onSnapshot(
      articlesCol,
      async (snapshot) => {
        setIsFirebaseConnected(true);
        if (snapshot.empty && !hasSeededArticles.current) {
          hasSeededArticles.current = true;
          // Seed database with initial rich articles
          try {
            const batch = writeBatch(db);
            INITIAL_ARTICLES.forEach((art) => {
              const artRef = doc(db, 'articles', art.id);
              batch.set(artRef, art);
            });
            await batch.commit();
            console.log('Firestore seeded with INITIAL_ARTICLES');
          } catch (seedErr) {
            console.warn('Initial seeding fallback:', seedErr);
          }
        } else if (!snapshot.empty) {
          const remoteArticles: Article[] = [];
          snapshot.forEach((docSnap) => {
            remoteArticles.push(docSnap.data() as Article);
          });
          // Sort by published date descending
          remoteArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
          setArticles(remoteArticles);
          safeLocalStorageSet(ARTICLES_STORAGE_KEY, JSON.stringify(remoteArticles));
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'articles');
      }
    );

    return () => unsubscribe();
  }, []);

  // 5. Comments State
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = safeLocalStorageGet(COMMENTS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_COMMENTS;
      }
    }
    return INITIAL_COMMENTS;
  });

  const hasSeededComments = useRef(false);
  useEffect(() => {
    const commentsCol = collection(db, 'comments');
    const unsubscribe = onSnapshot(
      commentsCol,
      async (snapshot) => {
        if (snapshot.empty && !hasSeededComments.current) {
          hasSeededComments.current = true;
          try {
            const batch = writeBatch(db);
            INITIAL_COMMENTS.forEach((c) => {
              const cRef = doc(db, 'comments', c.id);
              batch.set(cRef, c);
            });
            await batch.commit();
          } catch (err) {
            console.warn('Seeding comments fallback:', err);
          }
        } else if (!snapshot.empty) {
          const remoteComments: Comment[] = [];
          snapshot.forEach((docSnap) => {
            remoteComments.push(docSnap.data() as Comment);
          });
          remoteComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setComments(remoteComments);
          safeLocalStorageSet(COMMENTS_STORAGE_KEY, JSON.stringify(remoteComments));
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'comments');
      }
    );

    return () => unsubscribe();
  }, []);

  // 6. Subscribers State
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => {
    const saved = safeLocalStorageGet(SUBSCRIBERS_STORAGE_KEY);
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
    // Only subscribe listener if current user is admin to respect PII isolation
    if (!currentUser || currentUser.email !== 'antonioestefanoprando@gmail.com') return;

    const subCol = collection(db, 'subscribers');
    const unsubscribe = onSnapshot(
      subCol,
      (snapshot) => {
        const remoteSubs: NewsletterSubscriber[] = [];
        snapshot.forEach((d) => remoteSubs.push(d.data() as NewsletterSubscriber));
        if (remoteSubs.length > 0) {
          setSubscribers(remoteSubs);
          safeLocalStorageSet(SUBSCRIBERS_STORAGE_KEY, JSON.stringify(remoteSubs));
        }
      },
      (error) => {
        // Silently handle if non-admin or permission restricted
        console.warn('Subscribers sync info:', error);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // 7. Bookmarks State
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = safeLocalStorageGet(BOOKMARKS_STORAGE_KEY);
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
    safeLocalStorageSet(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  // 8. Custom Logo & Media State
  const [customLogoMedia, setCustomLogoMediaState] = useState<CustomLogoMedia | null>(() => {
    const saved = safeLocalStorageGet(CUSTOM_LOGO_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // 9. Background Animation Config
  const [backgroundConfig, setBackgroundConfigState] = useState<BackgroundAnimationConfig>(() => {
    const saved = safeLocalStorageGet(BG_CONFIG_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      enabled: true,
      videoUrl: null,
      opacity: 0.22,
      mode: 'canvas3d'
    };
  });

  // Restore persistent large media from IndexedDB on startup
  useEffect(() => {
    getMediaItem('vibehub_bg_video').then((videoData) => {
      if (videoData) {
        setBackgroundConfigState((prev) => {
          if (!prev.videoUrl || prev.videoUrl === 'indexeddb:vibehub_bg_video') {
            return {
              ...prev,
              videoUrl: videoData,
              mode: 'video'
            };
          }
          return prev;
        });
      }
    });

    getMediaItem('vibehub_custom_logo').then((logoData) => {
      if (logoData) {
        setCustomLogoMediaState((prev) => {
          if (prev && (!prev.url || prev.url === 'indexeddb:vibehub_custom_logo')) {
            return {
              ...prev,
              url: logoData
            };
          }
          return prev;
        });
      }
    });
  }, []);

  // Sync Settings from Firestore
  useEffect(() => {
    const settingsDoc = doc(db, 'settings', 'branding');
    const unsubscribe = onSnapshot(
      settingsDoc,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.customLogoMedia !== undefined) {
            const logo = data.customLogoMedia as CustomLogoMedia | null;
            if (logo && logo.url === 'indexeddb:vibehub_custom_logo') {
              getMediaItem('vibehub_custom_logo').then((localLogo) => {
                if (localLogo) {
                  setCustomLogoMediaState({ ...logo, url: localLogo });
                }
              });
            } else {
              setCustomLogoMediaState(logo);
            }
            if (logo) {
              safeLocalStorageSet(CUSTOM_LOGO_STORAGE_KEY, JSON.stringify(logo));
            } else {
              safeLocalStorageRemove(CUSTOM_LOGO_STORAGE_KEY);
            }
          }
          if (data.backgroundConfig) {
            const bg = data.backgroundConfig as BackgroundAnimationConfig;
            if (bg.videoUrl === 'indexeddb:vibehub_bg_video') {
              getMediaItem('vibehub_bg_video').then((localVideo) => {
                if (localVideo) {
                  setBackgroundConfigState({ ...bg, videoUrl: localVideo });
                }
              });
            } else {
              setBackgroundConfigState(bg);
            }
            safeLocalStorageSet(BG_CONFIG_STORAGE_KEY, JSON.stringify(bg));
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/branding');
      }
    );

    return () => unsubscribe();
  }, []);

  const setCustomLogoMedia = async (media: CustomLogoMedia | null) => {
    // 1. Immediately update local state
    setCustomLogoMediaState(media);

    if (media) {
      let sanitizedMedia = { ...media };
      // If large data URL, save to IndexedDB and keep lightweight pointer in localStorage
      if (media.url && media.url.startsWith('data:') && media.url.length > 50000) {
        await saveMediaItem('vibehub_custom_logo', media.url);
        sanitizedMedia = { ...media, url: 'indexeddb:vibehub_custom_logo' };
      }
      safeLocalStorageSet(CUSTOM_LOGO_STORAGE_KEY, JSON.stringify(sanitizedMedia));
      showNotification(media.type === 'video' ? 'Vídeo definido como logotipo!' : 'Foto definida como logotipo!');

      try {
        await setDoc(doc(db, 'settings', 'branding'), {
          id: 'branding',
          customLogoMedia: sanitizedMedia,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Could not save branding to cloud:', err);
      }
    } else {
      await removeMediaItem('vibehub_custom_logo');
      safeLocalStorageRemove(CUSTOM_LOGO_STORAGE_KEY);
      showNotification('Logotipo original restaurado.');

      try {
        await setDoc(doc(db, 'settings', 'branding'), {
          id: 'branding',
          customLogoMedia: null,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Could not reset branding in cloud:', err);
      }
    }
  };

  const setBackgroundConfig = async (config: BackgroundAnimationConfig) => {
    // 1. Immediately update React state for instant responsiveness and playback
    setBackgroundConfigState(config);

    // 2. Prepare lightweight sanitized copy for localStorage and Firestore
    let sanitizedConfig: BackgroundAnimationConfig = { ...config };

    if (config.videoUrl && config.videoUrl.startsWith('data:') && config.videoUrl.length > 50000) {
      // Store large media in IndexedDB (avoiding localStorage 5MB quota)
      await saveMediaItem('vibehub_bg_video', config.videoUrl);
      sanitizedConfig = {
        ...config,
        videoUrl: 'indexeddb:vibehub_bg_video'
      };
    } else if (!config.videoUrl) {
      await removeMediaItem('vibehub_bg_video');
    }

    // 3. Save lightweight payload safely
    safeLocalStorageSet(BG_CONFIG_STORAGE_KEY, JSON.stringify(sanitizedConfig));

    showNotification('Animação de fundo atualizada!');

    // 4. Save to Firestore
    try {
      await setDoc(doc(db, 'settings', 'branding'), {
        id: 'branding',
        backgroundConfig: sanitizedConfig,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Could not save background settings to cloud:', err);
    }
  };

  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'article' | 'category' | 'admin' | 'bookmarks'>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS['pt'];
    return langDict[key] || TRANSLATIONS['pt'][key] || key;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    safeLocalStorageSet(LANG_STORAGE_KEY, lang);
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
      safeLocalStorageSet(THEME_STORAGE_KEY, nextTheme);
      showNotification(nextTheme === 'dark' ? 'Modo Escuro ativado 🌙' : 'Modo Claro ativado ☀️');
      return nextTheme;
    });
  };

  const openArticle = async (id: string) => {
    setSelectedArticleId(id);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Optimistic local update
    const target = articles.find((a) => a.id === id);
    const newViews = (target?.views || 0) + 1;
    setArticles((prev) =>
      prev.map((art) => (art.id === id ? { ...art, views: newViews } : art))
    );

    // Persist view increment to Firestore
    try {
      await setDoc(doc(db, 'articles', id), { views: newViews }, { merge: true });
    } catch {
      // Non-blocking for reader
    }
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

  const toggleLikeArticle = async (articleId: string) => {
    const art = articles.find((a) => a.id === articleId);
    if (!art) return;
    const isLiked = art.likedByMe;
    const newLikes = isLiked ? Math.max(0, art.likes - 1) : art.likes + 1;

    setArticles((prev) =>
      prev.map((a) => {
        if (a.id === articleId) {
          return {
            ...a,
            likes: newLikes,
            likedByMe: !isLiked
          };
        }
        return a;
      })
    );

    try {
      await setDoc(doc(db, 'articles', articleId), { likes: newLikes }, { merge: true });
    } catch {
      // Non-blocking
    }
  };

  const addComment = async (
    articleId: string,
    content: string,
    authorName: string,
    parentId: string | null = null
  ) => {
    const cleanContent = content.trim();
    if (!cleanContent) return;

    const authorDisplayName = currentUser?.displayName || authorName.trim() || 'Leitor Vibe Hub';
    const authorPhoto =
      currentUser?.photoURL ||
      `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(authorDisplayName)}`;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      articleId,
      parentId,
      authorName: authorDisplayName,
      authorAvatar: authorPhoto,
      authorRole: currentUser?.email === 'antonioestefanoprando@gmail.com' ? 'moderator' : 'reader',
      content: cleanContent,
      createdAt: new Date().toISOString(),
      likes: 1,
      likedByMe: true
    };

    // Optimistic UI
    setComments((prev) => [newComment, ...prev]);
    showNotification(t('commentPosted'));

    // Save to Firestore
    try {
      await setDoc(doc(db, 'comments', newComment.id), newComment);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `comments/${newComment.id}`);
    }
  };

  const likeComment = async (commentId: string) => {
    const c = comments.find((item) => item.id === commentId);
    if (!c) return;
    const isLiked = c.likedByMe;
    const newLikes = isLiked ? Math.max(0, c.likes - 1) : c.likes + 1;

    setComments((prev) =>
      prev.map((item) => {
        if (item.id === commentId) {
          return {
            ...item,
            likes: newLikes,
            likedByMe: !isLiked
          };
        }
        return item;
      })
    );

    try {
      await setDoc(doc(db, 'comments', commentId), { likes: newLikes }, { merge: true });
    } catch {
      // Non-blocking
    }
  };

  const deleteComment = async (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId && c.parentId !== commentId));
    showNotification('Comentário removido.');

    try {
      await deleteDoc(doc(db, 'comments', commentId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `comments/${commentId}`);
    }
  };

  const addArticle = async (newArticleData: Omit<Article, 'id' | 'views' | 'likes' | 'shares'>) => {
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

    try {
      await setDoc(doc(db, 'articles', id), newArticle);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `articles/${id}`);
    }
  };

  const updateArticle = async (updatedArticle: Article) => {
    setArticles((prev) =>
      prev.map((art) => (art.id === updatedArticle.id ? updatedArticle : art))
    );
    showNotification(t('adminArticleSaved'));

    try {
      await setDoc(doc(db, 'articles', updatedArticle.id), updatedArticle);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `articles/${updatedArticle.id}`);
    }
  };

  const deleteArticle = async (id: string) => {
    setArticles((prev) => prev.filter((art) => art.id !== id));
    setComments((prev) => prev.filter((c) => c.articleId !== id));
    setBookmarks((prev) => prev.filter((artId) => artId !== id));
    showNotification('Artigo excluído com sucesso.');

    try {
      await deleteDoc(doc(db, 'articles', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `articles/${id}`);
    }
  };

  const subscribeNewsletter = async (
    email: string,
    name?: string,
    frequency: 'daily' | 'weekly' | 'breaking' = 'weekly',
    topics: string[] = ['tech', 'planet', 'culture']
  ): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) return false;

    const exists = subscribers.some((sub) => sub.email.toLowerCase() === cleanEmail);
    if (exists) {
      showNotification('Este e-mail já está cadastrado na newsletter!');
      return true;
    }

    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: cleanEmail,
      name: name?.trim() || '',
      frequency,
      topics,
      subscribedAt: new Date().toISOString()
    };

    setSubscribers((prev) => [newSub, ...prev]);
    showNotification(t('newsletterSuccess'));

    try {
      await setDoc(doc(db, 'subscribers', newSub.id), newSub);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `subscribers/${newSub.id}`);
    }
    return true;
  };

  const resetToDefaultData = async () => {
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
    await removeMediaItem('vibehub_bg_video');
    await removeMediaItem('vibehub_custom_logo');
    safeLocalStorageRemove(ARTICLES_STORAGE_KEY);
    safeLocalStorageRemove(COMMENTS_STORAGE_KEY);
    safeLocalStorageRemove(SUBSCRIBERS_STORAGE_KEY);
    safeLocalStorageRemove(BOOKMARKS_STORAGE_KEY);
    safeLocalStorageRemove(CUSTOM_LOGO_STORAGE_KEY);
    safeLocalStorageRemove(BG_CONFIG_STORAGE_KEY);

    // Sync reset to Firestore
    try {
      const batch = writeBatch(db);
      INITIAL_ARTICLES.forEach((art) => {
        batch.set(doc(db, 'articles', art.id), art);
      });
      INITIAL_COMMENTS.forEach((c) => {
        batch.set(doc(db, 'comments', c.id), c);
      });
      batch.set(doc(db, 'settings', 'branding'), {
        id: 'branding',
        customLogoMedia: null,
        backgroundConfig: {
          enabled: true,
          videoUrl: null,
          opacity: 0.22,
          mode: 'canvas3d'
        },
        updatedAt: new Date().toISOString()
      });
      await batch.commit();
    } catch (err) {
      console.warn('Reset sync warning:', err);
    }

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
        currentUser,
        isAuthLoading,
        isFirebaseConnected,
        signInWithGoogle,
        signOutUser,
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
