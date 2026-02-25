import { Eye, Clock, Tag } from 'lucide-react';
import { WikiArticle } from '../lib/supabase';

interface ArticleListProps {
  articles: WikiArticle[];
  onArticleSelect: (article: WikiArticle) => void;
}

export default function ArticleList({ articles, onArticleSelect }: ArticleListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-400">
        <BookOpen className="w-16 h-16 mb-4" />
        <p className="text-lg">No articles found</p>
        <p className="text-sm">Create your first article to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <article
          key={article.id}
          onClick={() => onArticleSelect(article)}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-full">
              {article.category}
            </span>
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Eye className="w-3 h-3" />
              {article.views}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {article.content.substring(0, 150)}...
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {formatDate(article.updated_at)}
            </div>
            {article.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">{article.tags.length}</span>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function BookOpen({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}
