import React, { useState } from 'react';
import { getJournalEntries, JournalEntry, analyzeJournalEntries } from '../../services/api';

interface InsightType {
  id: 'themes' | 'focus' | 'mood' | 'goals';
  title: string;
  description: string;
  icon: string;
}

const INSIGHT_TYPES: InsightType[] = [
  {
    id: 'themes',
    title: 'Recurring Themes',
    description: 'Identify patterns and common themes across your journal entries',
    icon: '🔄'
  },
  {
    id: 'focus',
    title: 'Focus Suggestions',
    description: 'Get recommendations for personal growth and development',
    icon: '🎯'
  },
  {
    id: 'mood',
    title: 'Mood Analysis',
    description: 'Understand your emotional patterns and trends',
    icon: '🎭'
  },
  {
    id: 'goals',
    title: 'Goal Tracking',
    description: 'Track progress on your goals and get achievement suggestions',
    icon: '🎯'
  }
];

export const Insights: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedInsight, setSelectedInsight] = useState<InsightType | null>(null);
  const [analysis, setAnalysis] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsight = async (insightType: InsightType) => {
    setSelectedInsight(insightType);
    setLoading(true);
    setError(null);
    setAnalysis([]);

    try {
      // Fetch entries only when needed
      if (entries.length === 0) {
        const data = await getJournalEntries();
        setEntries(data);
        if (data.length === 0) {
          throw new Error('No journal entries found. Start by adding some entries!');
        }
      }

      const combinedContent = entries.map(entry => entry.content).join('\n\n---\n\n');
      const insights = await analyzeJournalEntries(combinedContent, insightType.id);
      setAnalysis(insights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate insights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[1200px] mx-auto bg-white rounded-lg shadow-lg flex min-h-[600px]">
      {/* Sidebar with insight types */}
      <div className="w-[300px] border-r border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Available Insights
        </h2>
        <div className="space-y-4">
          {INSIGHT_TYPES.map((insight) => (
            <button
              key={insight.id}
              onClick={() => generateInsight(insight)}
              className={`w-full text-left p-4 rounded-lg transition-colors duration-200 ${
                selectedInsight?.id === insight.id
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className="flex items-start">
                <span className="text-2xl mr-3 mt-1">{insight.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900 text-lg">{insight.title}</div>
                  <div className="text-sm text-gray-500 mt-1">{insight.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-8">
        {!selectedInsight ? (
          <div className="text-center text-gray-500 py-8">
            Select an insight type from the sidebar to begin analysis
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-8">
              <span className="text-3xl mr-3">{selectedInsight.icon}</span>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedInsight.title}
              </h1>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">
                {error}
              </div>
            ) : analysis.length > 0 ? (
              <div className="space-y-6">
                {analysis.map((item, index) => {
                  // Split the item into title and content if it contains a colon
                  const parts = item.split(': ');
                  const hasTitle = parts.length > 1;
                  const title = hasTitle ? parts[0] : '';
                  const content = hasTitle ? parts[1] : item;

                  return (
                    <div 
                      key={index}
                      className="flex items-start p-6 bg-gray-50 rounded-lg"
                    >
                      <span className="text-blue-500 mr-4 text-lg">•</span>
                      <div>
                        {hasTitle && (
                          <div className="font-semibold text-gray-900 mb-1">
                            {title}:
                          </div>
                        )}
                        <div className="text-gray-700">
                          {content}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}; 