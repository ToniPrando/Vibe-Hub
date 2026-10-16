import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Send, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const { subscribeNewsletter, language, t } = useApp();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'breaking'>('weekly');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const ok = await subscribeNewsletter(email, name, frequency);
    if (ok) {
      setIsSuccess(true);
      setEmail('');
      setName('');
      setTimeout(() => setIsSuccess(false), 6000);
    }
  };

  return (
    <section id="newsletter-section" className="my-16 scroll-mt-24">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-[#0a1832] to-[#041226] border border-sky-500/30 p-8 sm:p-12 text-white shadow-2xl">
        {/* Ambient atmospheric glow echoing logo colors */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Header Mark */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Vibe Hub Digest</span>
          </div>

          <h2
            className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white leading-tight"
            style={{ textWrap: 'balance' }}
          >
            {t('newsletterTitle')}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-xl mx-auto leading-relaxed">
            {t('newsletterSubtitle')}
          </p>

          {isSuccess ? (
            <div className="mt-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div className="text-left">
                <h4 className="text-sm font-bold text-white">{t('newsletterSuccess')}</h4>
                <p className="text-xs text-emerald-200/80 mt-0.5">{t('newsletterNotice')}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 max-w-2xl mx-auto">
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('newsletterNamePlaceholder')}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder:text-slate-400 outline-none focus:border-sky-500 transition-colors"
                  />
                </div>

                <div className="sm:col-span-8 flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('newsletterInputPlaceholder')}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder:text-slate-400 outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-sky-500 hover:from-amber-600 hover:to-sky-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>{t('newsletterButton')}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Frequency Radios */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-300">
                <span className="text-slate-400 font-medium">{t('newsletterFrequency')}:</span>
                <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                  <input
                    type="radio"
                    name="freq"
                    checked={frequency === 'weekly'}
                    onChange={() => setFrequency('weekly')}
                    className="accent-amber-400"
                  />
                  <span>{t('newsletterWeekly')}</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                  <input
                    type="radio"
                    name="freq"
                    checked={frequency === 'daily'}
                    onChange={() => setFrequency('daily')}
                    className="accent-amber-400"
                  />
                  <span>{t('newsletterDaily')}</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                  <input
                    type="radio"
                    name="freq"
                    checked={frequency === 'breaking'}
                    onChange={() => setFrequency('breaking')}
                    className="accent-amber-400"
                  />
                  <span>{t('newsletterBreaking')}</span>
                </label>
              </div>

              {/* Trust badge */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('newsletterNotice')}</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
