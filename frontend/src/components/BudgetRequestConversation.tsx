import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchComments();
    // Poll for new comments every 10 seconds
    const interval = setInterval(fetchComments, 10000);
    return () => clearInterval(interval);
  }, [budgetRequestId]);

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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-4 pb-4 border-b">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span>💬</span>
          Budget Request Discussion
        </h2>
        <p className="text-sm text-gray-600 mt-1">Activity: {activityName}</p>
        <p className="text-xs text-gray-500 mt-1">
          {isFinanceTeam ? '🏦 Finance Team View' : '👥 Activity Team View'}
        </p>
      </div>

      {/* Comments List */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {loading && comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            Loading conversation...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-4xl mb-2">💭</p>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          comments.map((comment) => {
            const isOwnComment = comment.created_by_id === currentUserId;
            // Use isFinanceTeam prop for own messages styling
            const commentIsFromFinance = isOwnComment ? isFinanceTeam : false;

            return (
              <div
                key={comment.id}
                className={`flex ${isOwnComment ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-2xl ${isOwnComment ? 'order-2' : 'order-1'}`}>
                  {/* Author and timestamp */}
                  <div className={`flex items-center gap-2 mb-1 ${isOwnComment ? 'justify-end' : 'justify-start'}`}>
                    <span className={`text-xs font-medium ${
                      isOwnComment && isFinanceTeam ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {isOwnComment && isFinanceTeam && '🏦 '}
                      {comment.created_by_name}
                      {isOwnComment && ' (You)'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>

                  {/* Comment bubble */}
                  <div
                    className={`rounded-lg px-4 py-3 ${
                      isOwnComment
                        ? commentIsFromFinance
                          ? 'bg-green-100 text-gray-900'
                          : 'bg-blue-100 text-gray-900'
                        : 'bg-gray-100 border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{comment.comment_text}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Comment Input */}
      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {isFinanceTeam ? 'Reply to Activity Team' : 'Reply to Finance Team'}
        </label>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={
            isFinanceTeam
              ? 'Ask for clarification or provide feedback...'
              : 'Respond to finance queries or provide additional information...'
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="flex justify-between items-center mt-3">
          <p className="text-xs text-gray-500">
            {newComment.length} characters
          </p>
          <button
            onClick={handleSubmitComment}
            disabled={submitting || !newComment.trim()}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              submitting || !newComment.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isFinanceTeam
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              <>
                <span>📤</span>
                Send Message
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <span className="font-semibold">💡 Tip:</span> Use this space to discuss amendments, ask questions,
          or clarify budget details. {isFinanceTeam ? 'Finance team' : 'Activity team'} messages appear in
          {isFinanceTeam ? ' blue' : ' green'}.
        </p>
      </div>
    </div>
  );
};

export default BudgetRequestConversation;
