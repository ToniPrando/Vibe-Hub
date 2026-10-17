import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { Article } from '../types';
import { VibeHubLogo } from './VibeHubLogo';
import {
  FileText,
  MessageSquare,
  Users,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Download,
  RotateCcw,
  Eye,
  Heart,
  CheckCircle,
  X,
  Save,
  Tag,
  Sparkles,
  ExternalLink,
  ImagePlus,
  Video,
  Camera,
  Film,
  Upload,
  Link as LinkIcon,
  Check,
  ArrowLeft,
  Database,
  ShieldCheck,
  LogIn,
  LogOut
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    articles,
    comments,
    subscribers,
    deleteArticle,
    addArticle,
    updateArticle,
    deleteComment,
    resetToDefaultData,
    openArticle,
    language,
    t,
    showNotification,
    customLogoMedia,
    setCustomLogoMedia,
    setCurrentView,
    backgroundConfig,
    setBackgroundConfig,
    currentUser,
    isFirebaseConnected,
    signInWithGoogle,
    signOutUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'articles' | 'comments' | 'newsletter' | 'metrics' | 'settings'>('articles');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Logo replacement refs and state
  const logoImageInputRef = useRef<HTMLInputElement>(null);
  const logoVideoInputRef = useRef<HTMLInputElement>(null);
  const bgVideoInputRef = useRef<HTMLInputElement>(null);
  const articleCoverInputRef = useRef<HTMLInputElement>(null);

  const [showLogoUrlModal, setShowLogoUrlModal] = useState(false);
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [logoMediaType, setLogoMediaType] = useState<'image' | 'video'>('image');

  // Form State for creating/editing article
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('tech');
  const [formTags, setFormTags] = useState('');
  const [formCoverImage, setFormCoverImage] = useState('');
  const [formReadTime, setFormReadTime] = useState(5);
  const [formAuthorName, setFormAuthorName] = useState('Equipe Editorial Vibe Hub');
  const [formAuthorRole, setFormAuthorRole] = useState('Redação');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsTrending, setFormIsTrending] = useState(false);
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');

  // Search & filter in admin
  const [adminArticleSearch, setAdminArticleSearch] = useState('');

  // Sample stock images for easy pick
  const presetImages = [
    { label: 'Laboratório Quântico', url: '/src/assets/images/hero_tech_quantum_future_1792111788160.jpg' },
    { label: 'Nebulosa Cósmica', url: '/src/assets/images/article_james_webb_cosmos_1792111788440.jpg' },
    { label: 'Cidades Biofílicas', url: '/src/assets/images/article_sustainable_cities_future_1792111789045.jpg' },
    { label: 'Setup Gamer Espacial', url: '/src/assets/images/article_gaming_virtual_reality_1792111789371.jpg' },
    { label: 'Foco & Minimalismo', url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&h=675&q=80' },
    { label: 'Equipe Criativa', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&h=675&q=80' }
  ];

  // File upload handlers for Custom Logo
  const handleLogoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification('Por favor, selecione uma foto ou imagem válida (PNG, JPG, WebP, GIF, SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        try {
          await setCustomLogoMedia({
            type: 'image',
            url: reader.result,
            name: file.name
          });
        } catch (err) {
          console.error('Error setting custom logo photo:', err);
          showNotification('Erro ao processar imagem para logotipo.');
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleLogoVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showNotification('Por favor, selecione um arquivo de vídeo válido (MP4, WebM).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      showNotification('O vídeo local deve ter menos de 20MB para desempenho ideal no navegador.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        try {
          await setCustomLogoMedia({
            type: 'video',
            url: reader.result,
            name: file.name
          });
        } catch (err) {
          console.error('Error setting custom logo video:', err);
          showNotification('Erro ao processar vídeo para logotipo.');
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleBgVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showNotification('Por favor, envie um arquivo de vídeo válido (MP4, WebM).');
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      showNotification('Para vídeos de fundo, o tamanho limite recomendado é de 30MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        try {
          await setBackgroundConfig({
            ...backgroundConfig,
            videoUrl: reader.result,
            mode: 'video',
            enabled: true
          });
          showNotification('Vídeo aplicado com sucesso à animação de fundo!');
        } catch (err) {
          console.error('Error setting background video:', err);
          showNotification('Erro ao processar vídeo de fundo.');
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleApplyLogoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoUrlInput.trim()) return;

    setCustomLogoMedia({
      type: logoMediaType,
      url: logoUrlInput.trim(),
      name: 'Logo via Link'
    });
    setLogoUrlInput('');
    setShowLogoUrlModal(false);
  };

  // Article Cover File Upload handler
  const handleArticleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormCoverImage(reader.result);
        showNotification('Imagem carregada para a capa do artigo!');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleOpenCreateModal = () => {
    setFormTitle('');
    setFormSubtitle('');
    setFormExcerpt('');
    setFormContent('Escreva aqui os parágrafos da sua notícia...');
    setFormCategoryId('tech');
    setFormTags('Novidade, Tecnologia, Destaque');
    setFormCoverImage(presetImages[0].url);
    setFormReadTime(4);
    setFormAuthorName('Equipe Editorial Vibe Hub');
    setFormAuthorRole('Redação');
    setFormIsFeatured(false);
    setFormIsTrending(false);
    setFormStatus('published');
    setEditingArticle(null);
    setIsCreatingNew(true);
  };

  const handleOpenEditModal = (art: Article) => {
    setEditingArticle(art);
    setFormTitle(art.title);
    setFormSubtitle(art.subtitle);
    setFormExcerpt(art.excerpt);
    setFormContent(art.content);
    setFormCategoryId(art.categoryId);
    setFormTags(art.tags.join(', '));
    setFormCoverImage(art.coverImage);
    setFormReadTime(art.readTime);
    setFormAuthorName(art.author.name);
    setFormAuthorRole(art.author.role[language] || art.author.role['pt'] || 'Redator');
    setFormIsFeatured(!!art.isFeatured);
    setFormIsTrending(!!art.isTrending);
    setFormStatus(art.status);
    setIsCreatingNew(false);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const parsedTags = formTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    if (editingArticle) {
      // Update existing
      const updated: Article = {
        ...editingArticle,
        title: formTitle.trim(),
        subtitle: formSubtitle.trim(),
        excerpt: formExcerpt.trim(),
        content: formContent.trim(),
        categoryId: formCategoryId,
        tags: parsedTags.length > 0 ? parsedTags : ['Geral'],
        coverImage: formCoverImage || presetImages[0].url,
        readTime: Number(formReadTime) || 3,
        author: {
          ...editingArticle.author,
          name: formAuthorName.trim() || 'Redação Vibe Hub'
        },
        isFeatured: formIsFeatured,
        isTrending: formIsTrending,
        status: formStatus
      };
      updateArticle(updated);
      setEditingArticle(null);
    } else {
      // Create new
      addArticle({
        slug: formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        title: formTitle.trim(),
        subtitle: formSubtitle.trim(),
        excerpt: formExcerpt.trim(),
        content: formContent.trim(),
        categoryId: formCategoryId,
        tags: parsedTags.length > 0 ? parsedTags : ['Geral'],
        coverImage: formCoverImage || presetImages[0].url,
        coverImageCaption: 'Imagem ilustrativa Vibe Hub.',
        author: {
          name: formAuthorName.trim() || 'Equipe Editorial',
          avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(formAuthorName)}`,
          role: {
            pt: formAuthorRole,
            en: formAuthorRole,
            es: formAuthorRole
          },
          bio: {
            pt: 'Redator apaixonado por novidades e tendências no Vibe Hub.',
            en: 'Passionate writer covering trending topics at Vibe Hub.',
            es: 'Redactor apasionado por novedades y tendencias en Vibe Hub.'
          }
        },
        publishedAt: new Date().toISOString(),
        readTime: Number(formReadTime) || 4,
        isFeatured: formIsFeatured,
        isTrending: formIsTrending,
        status: formStatus
      });
      setIsCreatingNew(false);
    }
  };

  // Export subscribers to CSV
  const handleExportSubscribersCSV = () => {
    if (subscribers.length === 0) {
      showNotification('Nenhum inscrito para exportar.');
      return;
    }

    const header = 'ID,Email,Nome,Frequencia,DataInscricao\n';
    const rows = subscribers
      .map(
        (sub) =>
          `"${sub.id}","${sub.email}","${sub.name || ''}","${sub.frequency}","${sub.subscribedAt}"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `vibehub_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Arquivo CSV baixado com sucesso!');
  };

  // Export full JSON Backup
  const handleExportJSON = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      articles,
      comments,
      subscribers,
      customLogoMedia
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `vibehub_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Backup JSON baixado com sucesso!');
  };

  // Metrics calculations
  const totalViews = articles.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalLikes = articles.reduce((acc, curr) => acc + (curr.likes || 0), 0);

  const filteredArticles = articles.filter((art) => {
    if (!adminArticleSearch) return true;
    const q = adminArticleSearch.toLowerCase();
    return (
      art.title.toLowerCase().includes(q) ||
      art.author.name.toLowerCase().includes(q) ||
      art.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hidden file inputs for Logo upload */}
      <input
        type="file"
        ref={logoImageInputRef}
        onChange={handleLogoImageUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={logoVideoInputRef}
        onChange={handleLogoVideoUpload}
        accept="video/*"
        className="hidden"
      />
      <input
        type="file"
        ref={bgVideoInputRef}
        onChange={handleBgVideoUpload}
        accept="video/*"
        className="hidden"
      />
      <input
        type="file"
        ref={articleCoverInputRef}
        onChange={handleArticleCoverUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Admin Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              {t('adminPortal')}
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('adminManageContent')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Blog</span>
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('adminNewArticle')}</span>
          </button>
        </div>
      </div>

      {/* Firebase Cloud Database & Auth Status Bar */}
      <div className="mt-6 p-4 rounded-2xl bg-slate-900/90 dark:bg-slate-900/90 border border-slate-800 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Banco de Dados em Nuvem
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Firebase Firestore Conectado
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Artigos, comentários, inscritos da newsletter e logotipo sincronizados em tempo real no Google Cloud.
            </p>
          </div>
        </div>

        {/* Auth Profile / Google Sign-in */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/60">
              <img
                src={currentUser.photoURL || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(currentUser.displayName || 'admin')}`}
                alt=""
                className="w-7 h-7 rounded-full border border-sky-400"
              />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white leading-tight">
                    {currentUser.displayName || 'Administrador'}
                  </span>
                  {currentUser.email === 'antonioestefanoprando@gmail.com' && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300">
                      <ShieldCheck className="w-3 h-3 text-amber-400" />
                      ADMIN
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block truncate max-w-[160px]">
                  {currentUser.email}
                </span>
              </div>
              <button
                type="button"
                onClick={signOutUser}
                className="ml-2 p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
                title="Encerrar sessão"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="flex items-center gap-2 px-3.5 py-2 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Entrar com Google</span>
            </button>
          )}
        </div>
      </div>

      {/* DEDICATED BRANDING CARD: ÍCONE PARA ADICIONAR FOTO OU VÍDEO NO LUGAR DO LOGO */}
      <section className="my-8 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0a1835] to-[#051329] border border-sky-500/30 text-white shadow-xl relative overflow-hidden">
        {/* Ambient atmospheric glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            {/* Live Logo Preview Box */}
            <div className="p-2 rounded-2xl bg-slate-950/80 border border-sky-500/30 shadow-inner shrink-0">
              <VibeHubLogo size="lg" variant="mark" />
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-400">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Identidade Visual & Logotipo</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white mt-1">
                Substituir Logotipo por Foto ou Vídeo
              </h2>
              <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
                Clique nos ícones abaixo para adicionar uma foto (imagem) ou vídeo animado para ser exibido no lugar do logo no cabeçalho e na plataforma.
              </p>
              {customLogoMedia && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                  <Check className="w-3 h-3" />
                  <span>
                    {customLogoMedia.type === 'video' ? 'Vídeo personalizado ativo' : 'Foto personalizada ativa'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Icons and Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Ícone para Adicionar Foto */}
            <button
              type="button"
              onClick={() => logoImageInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              title="Adicionar uma foto ou imagem no lugar do logo"
            >
              <ImagePlus className="w-4 h-4 text-sky-100" />
              <span>Adicionar Foto</span>
            </button>

            {/* Ícone para Adicionar Vídeo */}
            <button
              type="button"
              onClick={() => logoVideoInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              title="Adicionar um clipe de vídeo animado no lugar do logo"
            >
              <Video className="w-4 h-4 text-amber-100" />
              <span>Adicionar Vídeo</span>
            </button>

            {/* Inserir via URL */}
            <button
              type="button"
              onClick={() => setShowLogoUrlModal(true)}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              title="Inserir link direto de foto ou vídeo"
            >
              <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Via URL</span>
            </button>

            {/* Restaurar Logo Original */}
            {customLogoMedia && (
              <button
                type="button"
                onClick={() => setCustomLogoMedia(null)}
                className="flex items-center gap-1.5 px-3 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                title="Voltar ao logotipo original com o globo VH"
              >
                <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                <span>Restaurar Padrão</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-strip for Background Video Animation */}
        <div className="mt-6 pt-5 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <Film className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <span className="font-bold text-white">Animação de Fundo do Site</span>
              <p className="text-[11px] text-slate-400">
                {backgroundConfig.mode === 'video' && backgroundConfig.videoUrl
                  ? 'Vídeo personalizado reproduzindo no fundo do site'
                  : 'Animação 3D ativa do vídeo do globo Vibe Hub com ícones sociais em órbita'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => bgVideoInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-medium cursor-pointer"
              title="Carregar um novo arquivo de vídeo para o fundo"
            >
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Upload de Vídeo</span>
            </button>

            {backgroundConfig.mode === 'video' && (
              <button
                type="button"
                onClick={() =>
                  setBackgroundConfig({
                    ...backgroundConfig,
                    mode: 'canvas3d',
                    videoUrl: null
                  })
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-medium cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Usar Animação 3D</span>
              </button>
            )}

            {/* Opacity slider */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
              <span className="text-[11px]">Opacidade:</span>
              <input
                type="range"
                min="0.05"
                max="0.45"
                step="0.05"
                value={backgroundConfig.opacity}
                onChange={(e) =>
                  setBackgroundConfig({
                    ...backgroundConfig,
                    opacity: parseFloat(e.target.value)
                  })
                }
                className="w-16 accent-sky-500 cursor-pointer"
              />
              <span className="text-[10px] font-mono">{Math.round(backgroundConfig.opacity * 100)}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 mt-6 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'articles'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t('adminArticlesTab')}</span>
          <span className="text-xs font-mono py-0.5 px-1.5 bg-slate-100 dark:bg-slate-800 rounded">
            {articles.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'comments'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t('adminCommentsTab')}</span>
          <span className="text-xs font-mono py-0.5 px-1.5 bg-slate-100 dark:bg-slate-800 rounded">
            {comments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('newsletter')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'newsletter'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t('adminSubscribersTab')}</span>
          <span className="text-xs font-mono py-0.5 px-1.5 bg-slate-100 dark:bg-slate-800 rounded">
            {subscribers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'metrics'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{t('adminMetricsTab')}</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'settings'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('adminSettingsTab')}</span>
        </button>
      </div>

      {/* TAB 1: ARTICLES MANAGER */}
      {activeTab === 'articles' && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <input
              type="text"
              value={adminArticleSearch}
              onChange={(e) => setAdminArticleSearch(e.target.value)}
              placeholder="Filtrar por título, autor ou tag..."
              className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 w-full sm:w-80 outline-none"
            />
            <div className="text-xs text-slate-400">
              Mostrando {filteredArticles.length} de {articles.length} artigos
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1425] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase text-slate-500">
                  <tr>
                    <th className="py-3 px-4">Artigo</th>
                    <th className="py-3 px-4">Categoria</th>
                    <th className="py-3 px-4">Leituras</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredArticles.map((art) => {
                    const cat = CATEGORIES.find((c) => c.id === art.categoryId);
                    const commentsCount = comments.filter((c) => c.articleId === art.id).length;

                    return (
                      <tr key={art.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={art.coverImage}
                              alt={art.title}
                              className="w-12 h-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-800"
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 max-w-md">
                                {art.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                <span>Por {art.author.name}</span>
                                <span>·</span>
                                <span>{art.readTime} min</span>
                                {art.isFeatured && (
                                  <span className="text-amber-500 font-semibold">• Destaque</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {cat?.name[language]}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3 text-xs tabular-nums text-slate-500">
                            <span className="inline-flex items-center gap-1" title="Leituras">
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              {art.views}
                            </span>
                            <span className="inline-flex items-center gap-1" title="Comentários">
                              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                              {commentsCount}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-md ${
                              art.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {art.status === 'published' ? t('adminStatusPublished') : t('adminStatusDraft')}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openArticle(art.id)}
                              className="p-1.5 text-slate-400 hover:text-sky-600 rounded transition-colors cursor-pointer"
                              title="Visualizar Artigo"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(art)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 rounded transition-colors cursor-pointer"
                              title={t('adminEdit')}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(t('adminDeleteConfirm'))) {
                                  deleteArticle(art.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                              title={t('adminDelete')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMMENTS MODERATION */}
      {activeTab === 'comments' && (
        <div className="mt-6 space-y-4">
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Moderação de {comments.length} Comentários Recebidos
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1425] overflow-hidden">
            {comments.map((comment) => {
              const art = articles.find((a) => a.id === comment.articleId);

              return (
                <div key={comment.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                      className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {comment.authorName}
                        </span>
                        <span className="text-xs text-slate-400">
                          em <strong className="text-slate-600 dark:text-slate-300">{art?.title.slice(0, 30)}...</strong>
                        </span>
                        <span className="text-xs text-slate-400">
                          ({new Date(comment.createdAt).toLocaleDateString()})
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                      title="Excluir Comentário"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: NEWSLETTER SUBSCRIBERS */}
      {activeTab === 'newsletter' && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Base de Leitores Inscritos ({subscribers.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Leitores que recebem resumos e novidades no e-mail.
              </p>
            </div>

            <button
              onClick={handleExportSubscribersCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('adminExportSubscribers')}</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1425] overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase text-slate-500">
                <tr>
                  <th className="py-3 px-4">E-mail</th>
                  <th className="py-3 px-4">Nome</th>
                  <th className="py-3 px-4">Frequência</th>
                  <th className="py-3 px-4">Data de Inscrição</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {subscribers.map((sub) => (
                  <tr key={sub.id}>
                    <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-white">
                      {sub.email}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {sub.name || '—'}
                    </td>
                    <td className="py-3 px-4 capitalize text-sky-600 dark:text-sky-400 font-semibold">
                      {sub.frequency === 'weekly' ? 'Semanal' : sub.frequency === 'daily' ? 'Diário' : 'Urgente'}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(sub.subscribedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: METRICS & ANALYTICS */}
      {activeTab === 'metrics' && (
        <div className="mt-6 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1425] border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {t('adminTotalArticles')}
              </span>
              <div className="text-3xl font-extrabold font-display text-slate-900 dark:text-white mt-1 tabular-nums">
                {articles.length}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1425] border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {t('adminTotalViews')}
              </span>
              <div className="text-3xl font-extrabold font-display text-sky-600 dark:text-sky-400 mt-1 tabular-nums">
                {totalViews.toLocaleString()}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1425] border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {t('adminTotalComments')}
              </span>
              <div className="text-3xl font-extrabold font-display text-amber-500 mt-1 tabular-nums">
                {comments.length}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1425] border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {t('adminTotalSubscribers')}
              </span>
              <div className="text-3xl font-extrabold font-display text-emerald-500 mt-1 tabular-nums">
                {subscribers.length}
              </div>
            </div>
          </div>

          {/* Top performing articles */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1425] border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Artigos Mais Lidos da Plataforma
            </h3>
            <div className="space-y-3">
              {[...articles]
                .sort((a, b) => b.views - a.views)
                .slice(0, 5)
                .map((art, idx) => (
                  <div key={art.id} className="flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono font-bold text-slate-400">#{idx + 1}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {art.title}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-sky-600 dark:text-sky-400 shrink-0">
                      {art.views.toLocaleString()} views
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SETTINGS & BACKUP */}
      {activeTab === 'settings' && (
        <div className="mt-6 max-w-2xl space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1425] border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Exportação e Backup
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Faça download de todos os artigos, comentários, lista de inscritos e configuração de logotipo em formato JSON estruturado.
            </p>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>Baixar Arquivo JSON de Backup</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 space-y-4">
            <h3 className="text-base font-bold text-red-700 dark:text-red-400">
              {t('adminResetData')}
            </h3>
            <p className="text-xs text-red-600/80 dark:text-red-300/80 leading-relaxed">
              {t('adminResetConfirm')}
            </p>
            <button
              onClick={() => {
                if (window.confirm(t('adminResetConfirm'))) {
                  resetToDefaultData();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('adminResetData')}</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL PARA INSERIR LOGO VIA URL */}
      {showLogoUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0c1425] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                Inserir Link de Foto ou Vídeo
              </h3>
              <button
                onClick={() => setShowLogoUrlModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLogoUrl} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tipo de Mídia
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      checked={logoMediaType === 'image'}
                      onChange={() => setLogoMediaType('image')}
                      className="accent-sky-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Foto / Imagem</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      checked={logoMediaType === 'video'}
                      onChange={() => setLogoMediaType('video')}
                      className="accent-orange-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Vídeo (MP4, WebM)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL Direta da Mídia *
                </label>
                <input
                  type="url"
                  value={logoUrlInput}
                  onChange={(e) => setLogoUrlInput(e.target.value)}
                  placeholder={logoMediaType === 'image' ? 'https://exemplo.com/minha-foto.png' : 'https://exemplo.com/meu-video.mp4'}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogoUrlModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold cursor-pointer"
                >
                  Aplicar ao Logo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT ARTICLE MODAL */}
      {(isCreatingNew || editingArticle) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#0c1425] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                {editingArticle ? 'Editar Notícia' : t('adminNewArticle')}
              </h3>
              <button
                onClick={() => {
                  setEditingArticle(null);
                  setIsCreatingNew(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('adminArticleTitleLabel')} *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  placeholder="Ex: Novo marco científico revoluciona telecomunicações"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('adminArticleSubtitleLabel')}
                </label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="Subtítulo ou resumo explicativo complementar..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('adminArticleCategoryLabel')}
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name[language]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('adminArticleReadTimeLabel')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('adminArticleExcerptLabel')}
                </label>
                <textarea
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  rows={2}
                  placeholder="Resumo de 1-2 frases para os cards de listagem..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('adminArticleContentLabel')} *
                </label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  rows={8}
                  required
                  placeholder="Conteúdo em parágrafos. Use '### Subtítulo' para seções."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-sans outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    {t('adminArticleCoverLabel')}
                  </label>
                  <button
                    type="button"
                    onClick={() => articleCoverInputRef.current?.click()}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Fazer upload de foto do computador</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={formCoverImage}
                  onChange={(e) => setFormCoverImage(e.target.value)}
                  placeholder="URL da imagem ou selecione uma predefinição abaixo"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none"
                />

                {/* Presets picker */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] text-slate-400">Banco de fotos:</span>
                  {presetImages.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setFormCoverImage(p.url)}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-sky-500 hover:text-white text-[11px] text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('adminArticleAuthorNameLabel')}
                  </label>
                  <input
                    type="text"
                    value={formAuthorName}
                    onChange={(e) => setFormAuthorName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('adminArticleTagsLabel')}
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Quântica, Espaço, IA"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="accent-amber-500"
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {t('adminArticleFeaturedLabel')}
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsTrending}
                    onChange={(e) => setFormIsTrending(e.target.checked)}
                    className="accent-sky-500"
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {t('adminArticleTrendingLabel')}
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingArticle(null);
                    setIsCreatingNew(false);
                  }}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{t('adminSave')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
