import { useState, useEffect } from 'react';
import { supabase, WikiArticle } from './lib/supabase';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ArticleList from './components/ArticleList';
import ArticleView from './components/ArticleView';
import ArticleEditor from './components/ArticleEditor';

type View = 'list' | 'view' | 'edit' | 'create';

function App() {
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<WikiArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<WikiArticle | null>(null);
  const [view, setView] = useState<View>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchQuery, selectedCategory]);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('wiki_articles')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setArticles(data);
        const uniqueCategories = Array.from(
          new Set(data.map((article) => article.category))
        );
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((article) => article.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredArticles(filtered);
  };

  const handleArticleSelect = async (article: WikiArticle) => {
    await incrementViews(article.id);
    setSelectedArticle(article);
    setView('view');
  };

  const incrementViews = async (id: string) => {
    try {
      const article = articles.find((a) => a.id === id);
      if (article) {
        const { error } = await supabase
          .from('wiki_articles')
          .update({ views: article.views + 1 })
          .eq('id', id);

        if (!error) {
          setArticles((prev) =>
            prev.map((a) => (a.id === id ? { ...a, views: a.views + 1 } : a))
          );
        }
      }
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const handleSaveArticle = async (articleData: Partial<WikiArticle>) => {
    try {
      if (articleData.id) {
        const { error } = await supabase
          .from('wiki_articles')
          .update({
            title: articleData.title,
            slug: articleData.slug,
            content: articleData.content,
            category: articleData.category,
            tags: articleData.tags,
            updated_at: new Date().toISOString(),
          })
          .eq('id', articleData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('wiki_articles').insert([
          {
            title: articleData.title,
            slug: articleData.slug,
            content: articleData.content,
            category: articleData.category,
            tags: articleData.tags,
          },
        ]);

        if (error) throw error;
      }

      await fetchArticles();
      setView('list');
      setSelectedArticle(null);
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Error saving article. Please try again.');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      const { error } = await supabase.from('wiki_articles').delete().eq('id', id);

      if (error) throw error;

      await fetchArticles();
      setView('list');
      setSelectedArticle(null);
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article. Please try again.');
    }
  };

  const handleNewArticle = () => {
    setSelectedArticle(null);
    setView('create');
  };

  const handleBack = () => {
    setSelectedArticle(null);
    setView('list');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wiki...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNewArticle={handleNewArticle} />

      <div className="flex">
        {view === 'list' && (
          <Sidebar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />
        )}

        <main className="flex-1 p-6">
          {view === 'list' && (
            <ArticleList
              articles={filteredArticles}
              onArticleSelect={handleArticleSelect}
            />
          )}

          {view === 'view' && selectedArticle && (
            <ArticleView
              article={selectedArticle}
              onBack={handleBack}
              onEdit={(article) => {
                setSelectedArticle(article);
                setView('edit');
              }}
              onDelete={handleDeleteArticle}
            />
          )}

          {(view === 'edit' || view === 'create') && (
            <ArticleEditor
              article={selectedArticle}
              onSave={handleSaveArticle}
              onCancel={handleBack}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
