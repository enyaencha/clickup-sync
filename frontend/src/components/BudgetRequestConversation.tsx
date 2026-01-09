import React, { useState, useEffect, useRef } from 'react';
import { authFetch } from '../config/api';

interface Comment {
  id: number;
  comment_text: string;
  created_by_name: string;
  created_by_id: number;
  created_at: string;
  is_finance_team: boolean;
}

interface BudgetRequestConversationProps {
  budgetRequestId: number;
  activityName: string;
  currentUserId: number;
  isFinanceTeam: boolean;
}

const BudgetRequestConversation: React.FC<BudgetRequestConversationProps> = ({
  budgetRequestId,
  activityName,
  currentUserId,
  isFinanceTeam
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchComments();
    // Poll for new comments every 10 seconds
    const interval = setInterval(fetchComments, 10000);
    return () => clearInterval(interval);
  }, [budgetRequestId]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await authFetch(`/api/budget-requests/${budgetRequestId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    try {
      setSubmitting(true);
      const response = await authFetch(`/api/budget-requests/${budgetRequestId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_text: newComment })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to post comment');
      }

      setNewComment('');
      await fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      alert(error instanceof Error ? error.message : 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Info Bar */}
      <div className="bg-blue-50 px-4 py-2 border-b border-blue-200">
        <p className="text-xs text-blue-900">
          {isFinanceTeam ? '🏦 Finance Team View' : '👥 Activity Team View'} • Activity: {activityName}
        </p>
      </div>

      {/* Messages Area - WhatsApp Style */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ddd5]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4c5b9' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}>
        {loading && comments.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="bg-white rounded-lg shadow-sm px-6 py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading conversation...</p>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="bg-white rounded-lg shadow-sm px-8 py-6 text-center">
              <p className="text-4xl mb-3">💭</p>
              <p className="text-gray-700 font-medium mb-1">No messages yet</p>
              <p className="text-sm text-gray-500">Start the conversation below!</p>
            </div>
          </div>
        ) : (
          <>
            {comments.map((comment) => {
              const isOwnComment = comment.created_by_id === currentUserId;
              const commentIsFromFinance = comment.is_finance_team;

              return (
                <div
                  key={comment.id}
                  className={`flex ${isOwnComment ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${isOwnComment ? 'items-end' : 'items-start'} flex flex-col`}>
                    {/* Message Bubble */}
                    <div
                      className={`rounded-lg px-4 py-2 shadow-sm ${
                        isOwnComment
                          ? commentIsFromFinance
                            ? 'bg-[#dcf8c6] text-gray-900' // Finance sent (light green - WhatsApp style)
                            : 'bg-[#dcf8c6] text-gray-900' // Activity user sent
                          : commentIsFromFinance
                          ? 'bg-white text-gray-900 border border-green-200' // Finance received
                          : 'bg-white text-gray-900' // Activity user received
                      }`}
                    >
                      {/* Sender name (only for received messages) */}
                      {!isOwnComment && (
                        <div className={`text-xs font-semibold mb-1 ${
                          commentIsFromFinance ? 'text-green-700' : 'text-blue-700'
                        }`}>
                          {commentIsFromFinance && '🏦 '}{comment.created_by_name}
                        </div>
                      )}

                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{comment.comment_text}</p>

                      {/* Timestamp and status */}
                      <div className={`flex items-center gap-1 mt-1 ${isOwnComment ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[10px] text-gray-500">
                          {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isOwnComment && (
                          <span className="text-blue-600 text-xs">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area - Sticky at bottom */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-hidden"
              style={{ minHeight: '40px', maxHeight: '120px' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
            <p className="text-[10px] text-gray-400 mt-1 ml-4">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
          <button
            onClick={handleSubmitComment}
            disabled={submitting || !newComment.trim()}
            className={`px-5 py-2 rounded-full font-medium flex items-center gap-2 transition-all ${
              submitting || !newComment.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isFinanceTeam
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
            }`}
            style={{ minHeight: '40px' }}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="text-sm">Sending...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span className="text-sm">Send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetRequestConversation;
