
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
}

export const FinanceNews = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock finance news data - in a real app, you'd fetch from a news API
  useEffect(() => {
    const mockNews: NewsArticle[] = [
      {
        id: '1',
        title: 'Federal Reserve Keeps Interest Rates Steady',
        summary: 'The Federal Reserve decided to maintain current interest rates, citing ongoing economic stability and inflation concerns.',
        url: '#',
        source: 'Financial Times',
        publishedAt: '2024-01-15T10:30:00Z',
        category: 'Central Banking'
      },
      {
        id: '2',
        title: 'Tech Stocks Rally Amid AI Optimism',
        summary: 'Major technology companies see significant gains as investors remain bullish on artificial intelligence developments.',
        url: '#',
        source: 'Reuters',
        publishedAt: '2024-01-15T09:15:00Z',
        category: 'Stock Market'
      },
      {
        id: '3',
        title: 'Cryptocurrency Market Shows Mixed Signals',
        summary: 'Bitcoin and other major cryptocurrencies display volatile behavior as regulatory clarity remains uncertain.',
        url: '#',
        source: 'Bloomberg',
        publishedAt: '2024-01-15T08:45:00Z',
        category: 'Cryptocurrency'
      },
      {
        id: '4',
        title: 'Housing Market Trends for 2024',
        summary: 'Real estate experts predict continued market adjustments with regional variations in pricing and demand.',
        url: '#',
        source: 'Wall Street Journal',
        publishedAt: '2024-01-15T07:20:00Z',
        category: 'Real Estate'
      },
      {
        id: '5',
        title: 'Global Economic Outlook Remains Cautious',
        summary: 'International monetary fund releases updated projections showing moderate growth expectations worldwide.',
        url: '#',
        source: 'CNN Business',
        publishedAt: '2024-01-15T06:00:00Z',
        category: 'Global Economy'
      }
    ];

    setTimeout(() => {
      setNews(mockNews);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Central Banking': 'bg-blue-100 text-blue-800',
      'Stock Market': 'bg-green-100 text-green-800',
      'Cryptocurrency': 'bg-purple-100 text-purple-800',
      'Real Estate': 'bg-orange-100 text-orange-800',
      'Global Economy': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Finance News</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.reload()}
          className="flex items-center gap-2"
        >
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {news.map((article) => (
          <Card key={article.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                    <span className="font-medium">{article.source}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(article.publishedAt)}
                    </div>
                  </div>
                </div>
                <Badge className={getCategoryColor(article.category)}>
                  {article.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {article.summary}
              </p>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.open(article.url, '_blank')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 p-0 h-auto"
              >
                Read more
                <ExternalLink className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
