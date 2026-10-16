import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Comment } from '../types';
import { MessageSquare, ThumbsUp, CornerDownRight, Trash2, Send, User } from 'lucide-react';

interface CommentsSectionProps {
  articleId: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ articleId }) => {
  const { comments, addComment, likeComment, deleteComment, t, currentUser, signInWithGoogle } = useApp();

  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyAuthorName, setReplyAuthorName] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'likes'>('newest');

  // Filter comments for this article
  const articleComments = comments.filter((c) => c.articleId === articleId);

  // Separate top-level comments and replies
  const rootComments = articleComments.filter((c) => !c.parentId);
  const replies = articleComments.filter((c) => c.parentId);

  // Sorting
  const sortedRootComments = [...rootComments].sort((a, b) => {
    if (sortBy === 'likes') return b.likes - a.likes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleSubmitRoot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const resolvedName = currentUser?.displayName || authorName.trim() || 'Leitor Vibe Hub';
    addComment(articleId, commentText, resolvedName);
    setCommentText('');
  };

  const handleSubmitReply = (parentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const resolvedName = currentUser?.displayName || replyAuthorName.trim() || 'Leitor Vibe Hub';
    addComment(articleId, replyText, resolvedName, parentId);
    setReplyText('');
    setReplyingToId(null);
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMin = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMin < 2) return 'agora há pouco';
      if (diffMin < 60) return `há ${diffMin} min`;
      if (diffHours < 24) return `há ${diffHours} h`;
      if (diffDays === 1) return 'ontem';
      if (diffDays < 30) return `há ${diffDays} dias`;
      return date.toLocaleDateString();
    } catch {
      return 'recente';
    }
  };

  return (
    <section className="mt-14 pt-10 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-sky-500" />
            <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
              {t('commentsTitle')}
            </h2>
            <span className="text-sm font-mono text-slate-500 dark:text-slate-400">
              ({articleComments.length})
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('commentsSubtitle')}
          </p>
        </div>

        {/* Sort selector */}
        {rootComments.length > 1 && (
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setSortBy('newest')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                sortBy === 'newest'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('sortNewest')}
            </button>
            <button
              onClick={() => setSortBy('likes')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                sortBy === 'likes'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('sortLikes')}
            </button>
          </div>
        )}
      </div>

      {/* Main Comment Input Box */}
      <form onSubmit={handleSubmitRoot} className="mb-10 p-5 rounded-2xl bg-white dark:bg-[#0c1425] border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {t('leaveComment')}
          </h3>
          {currentUser ? (
            <div className="flex items-center gap-2 text-xs text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-800/50">
              <img
                src={currentUser.photoURL || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(currentUser.displayName || 'user')}`}
                alt=""
                className="w-4 h-4 rounded-full"
              />
              <span className="font-medium truncate max-w-[150px]">{currentUser.displayName || currentUser.email}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="text-xs text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Entrar com</span>
              <span className="font-semibold text-sky-500">Google</span>
            </button>
          )}
        </div>

        {!currentUser && (
          <div className="mb-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder={t('yourName')}
                maxLength={40}
                className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>
          </div>
        )}

        <div className="mb-3">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={t('writeCommentPlaceholder')}
            rows={3}
            required
            className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all resize-y"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t('postComment')}</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {sortedRootComments.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium">{t('noCommentsYet')}</p>
          </div>
        ) : (
          sortedRootComments.map((comment) => {
            const commentReplies = replies.filter((r) => r.parentId === comment.id);

            return (
              <div key={comment.id} className="group p-5 rounded-2xl bg-white dark:bg-[#0c1425] border border-slate-200/80 dark:border-slate-800/80 transition-shadow">
                {/* Comment Header with Zero-Pill Typography */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                      className="w-9 h-9 rounded-full object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {comment.authorName}
                        </span>
                        {comment.authorRole === 'author' && (
                          <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400">
                            • {t('roleAuthor')}
                          </span>
                        )}
                        {comment.authorRole === 'vip' && (
                          <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                            • {t('roleVip')}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">
                        <span>{formatRelativeTime(comment.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delete button (moderation / user) */}
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1.5 transition-opacity"
                    title="Remover comentário"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Comment Body */}
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-3 whitespace-pre-line leading-relaxed">
                  {comment.content}
                </p>

                {/* Actions: Like & Reply */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-500">
                  <button
                    onClick={() => likeComment(comment.id)}
                    className={`flex items-center gap-1.5 py-1 px-2 rounded-md transition-colors ${
                      comment.likedByMe
                        ? 'text-sky-600 dark:text-sky-400 font-semibold bg-sky-50 dark:bg-sky-950/40'
                        : 'hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${comment.likedByMe ? 'fill-sky-500' : ''}`} />
                    <span className="tabular-nums">{comment.likes}</span>
                  </button>

                  <button
                    onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                    className="flex items-center gap-1 py-1 px-2 rounded-md hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  >
                    <CornerDownRight className="w-3.5 h-3.5" />
                    <span>{t('reply')}</span>
                  </button>
                </div>

                {/* Inline Reply Box if open */}
                {replyingToId === comment.id && (
                  <form
                    onSubmit={(e) => handleSubmitReply(comment.id, e)}
                    className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span>{t('replyTo')} <strong>{comment.authorName}</strong></span>
                      <button
                        type="button"
                        onClick={() => setReplyingToId(null)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {t('cancelReply')}
                      </button>
                    </div>

                    <input
                      type="text"
                      value={replyAuthorName}
                      onChange={(e) => setReplyAuthorName(e.target.value)}
                      placeholder={t('yourName')}
                      maxLength={40}
                      className="w-full px-2.5 py-1.5 mb-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none"
                    />

                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={t('writeCommentPlaceholder')}
                      rows={2}
                      required
                      className="w-full p-2.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-sky-500 resize-none"
                    />

                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="px-3 py-1 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-xs font-semibold rounded-md transition-colors"
                      >
                        {t('reply')}
                      </button>
                    </div>
                  </form>
                )}

                {/* Threaded Nested Replies */}
                {commentReplies.length > 0 && (
                  <div className="mt-4 pt-3 space-y-3 pl-4 sm:pl-6 border-l-2 border-slate-200 dark:border-slate-800">
                    {commentReplies.map((reply) => (
                      <div key={reply.id} className="group/reply text-xs text-slate-700 dark:text-slate-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={reply.authorAvatar}
                              alt={reply.authorName}
                              className="w-6 h-6 rounded-full object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                            />
                            <span className="font-bold text-slate-900 dark:text-white">
                              {reply.authorName}
                            </span>
                            {reply.authorRole === 'author' && (
                              <span className="text-[10px] text-sky-500 font-semibold">• {t('roleAuthor')}</span>
                            )}
                            <span className="text-slate-400">· {formatRelativeTime(reply.createdAt)}</span>
                          </div>

                          <button
                            onClick={() => deleteComment(reply.id)}
                            className="opacity-0 group-hover/reply:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                            title="Remover resposta"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <p className="mt-1.5 ml-8 whitespace-pre-line text-sm leading-relaxed">
                          {reply.content}
                        </p>

                        <div className="ml-8 mt-2 flex items-center gap-3 text-slate-400">
                          <button
                            onClick={() => likeComment(reply.id)}
                            className={`flex items-center gap-1 hover:text-sky-500 transition-colors ${
                              reply.likedByMe ? 'text-sky-500 font-medium' : ''
                            }`}
                          >
                            <ThumbsUp className={`w-3 h-3 ${reply.likedByMe ? 'fill-sky-500' : ''}`} />
                            <span className="tabular-nums">{reply.likes}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
