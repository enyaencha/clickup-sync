import React, { useState, useEffect, useRef } from 'react';
import { authFetch } from '../config/api';

interface Comment {
  id: number;
  comment_text: string;
  created_by_name: string;
  created_by_id: number;
  created_at: string;
  updated_at: string | null;
  is_finance_team: boolean;
  is_online: number;
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
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [previousCommentsLength, setPreviousCommentsLength] = useState(0);
  const [visibleDate, setVisibleDate] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Initialize with scroll to bottom on first load
  useEffect(() => {
    fetchComments();
    markConversationAsRead();
    // Scroll to bottom on first load
    setTimeout(() => {
      scrollToBottom('auto');
      setIsAtBottom(true);
      setPreviousCommentsLength(comments.length);
    }, 100);

    // Poll for new comments every 10 seconds
    const interval = setInterval(fetchComments, 10000);
    return () => clearInterval(interval);
  }, [budgetRequestId]);

  // Smart auto-scroll - only scroll if user is at bottom
  useEffect(() => {
    if (comments.length > 0 && previousCommentsLength > 0 && comments.length > previousCommentsLength) {
      const newMessages = comments.length - previousCommentsLength;

      if (isAtBottom) {
        // User is at bottom, scroll to new messages
        setTimeout(() => scrollToBottom('smooth'), 100);
        setNewMessageCount(0);
      } else {
        // User is scrolled up, show counter
        setNewMessageCount(prev => prev + newMessages);
      }

      setPreviousCommentsLength(comments.length);
    } else if (comments.length > 0 && previousCommentsLength === 0) {
      // First load
      setPreviousCommentsLength(comments.length);
    }
  }, [comments]);

  // Check if user is at bottom while scrolling
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isBottom = scrollHeight - scrollTop - clientHeight < 50;

    setIsAtBottom(isBottom);

    if (isBottom) {
      setNewMessageCount(0);
    }

    // Update visible date based on scroll position
    updateVisibleDate();
  };

  const updateVisibleDate = () => {
    if (!messagesContainerRef.current) return;

    const container = messagesContainerRef.current;
    const dateElements = container.querySelectorAll('[data-message-date]');

    // Find the date that's currently visible at the top
    for (let i = dateElements.length - 1; i >= 0; i--) {
      const element = dateElements[i] as HTMLElement;
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (rect.top <= containerRect.top + 100) {
        const date = element.getAttribute('data-message-date');
        if (date) {
          setVisibleDate(formatDateHeader(date));
          break;
        }
      }
    }
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const fetchComments = async () => {
    try {
      setLoading(comments.length === 0);
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

  const markConversationAsRead = async () => {
    try {
      await authFetch(`/api/budget-requests/${budgetRequestId}/mark-conversation-read`, {
        method: 'PUT'
      });
    } catch (error) {
      console.error('Error marking conversation as read:', error);
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
      scrollToBottom('smooth');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert(error instanceof Error ? error.message : 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: number) => {
    if (!editText.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    try {
      const response = await authFetch(`/api/budget-requests/${budgetRequestId}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_text: editText })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to edit comment');
      }

      setEditingCommentId(null);
      setEditText('');
      await fetchComments();
    } catch (error) {
      console.error('Error editing comment:', error);
      alert(error instanceof Error ? error.message : 'Failed to edit comment');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await authFetch(`/api/budget-requests/${budgetRequestId}/comments/${commentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete comment');
      }

      await fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete comment');
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.comment_text);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent, commentId: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditComment(commentId);
    }
    if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  // Date formatting functions
  const formatDateHeader = (date: string) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  const groupMessagesByDate = () => {
    const grouped: { [key: string]: Comment[] } = {};

    comments.forEach(comment => {
      const date = new Date(comment.created_at).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(comment);
    });

    return Object.entries(grouped).map(([date, msgs]) => ({
      date,
      messages: msgs
    }));
  };

  const isEdited = (comment: Comment) => {
    if (!comment.updated_at) return false;
    const created = new Date(comment.created_at).getTime();
    const updated = new Date(comment.updated_at).getTime();
    return updated > created + 1000; // More than 1 second difference
  };

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="flex flex-col h-full relative" style={{ background: 'var(--main-background)', color: 'var(--main-text)' }}>
      <style>{`
        .message-bubble:hover .message-actions {
          display: flex !important;
        }
      `}</style>
      {/* Info Bar */}
      <div
        className="px-4 py-2 border-b"
        style={{
          background: 'var(--activity-card-background)',
          borderColor: 'var(--activity-card-border)'
        }}
      >
        <p className="text-xs" style={{ color: 'var(--main-text)' }}>
          {isFinanceTeam ? '🏦 Finance Team View' : '👥 Activity Team View'} • Activity: {activityName}
        </p>
      </div>

      {/* Sticky Date Header - Shows when scrolling */}
      {visibleDate && !isAtBottom && (
        <div
          className="sticky top-0 z-10 text-center py-1 text-xs"
          style={{ background: 'var(--card-background)', color: 'var(--main-text)' }}
        >
          {visibleDate}
        </div>
      )}

      {/* Messages Area - WhatsApp Style */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{ background: 'var(--main-background)' }}
      >
        {loading && comments.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="rounded-lg shadow-sm px-6 py-4" style={{ background: 'var(--card-background)' }}>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm" style={{ color: 'var(--main-text)', opacity: 0.8 }}>Loading conversation...</p>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="rounded-lg shadow-sm px-8 py-6 text-center" style={{ background: 'var(--card-background)' }}>
              <p className="text-4xl mb-3">💭</p>
              <p className="font-medium mb-1" style={{ color: 'var(--main-text)' }}>No messages yet</p>
              <p className="text-sm" style={{ color: 'var(--main-text)', opacity: 0.7 }}>Start the conversation below!</p>
            </div>
          </div>
        ) : (
          groupedMessages.map(({ date, messages }) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex justify-center my-4" data-message-date={messages[0].created_at}>
                <div className="shadow-sm px-3 py-1 rounded-lg" style={{ background: 'var(--card-background)' }}>
                  <span className="text-xs font-medium" style={{ color: 'var(--main-text)', opacity: 0.8 }}>
                    {formatDateHeader(messages[0].created_at)}
                  </span>
                </div>
              </div>

              {/* Messages for this date */}
              {messages.map((comment) => {
                const isOwnComment = comment.created_by_id === currentUserId;
                const commentIsFromFinance = comment.is_finance_team;
                const isEditingThis = editingCommentId === comment.id;

                return (
                  <div key={comment.id} className={`flex ${isOwnComment ? 'justify-end' : 'justify-start'} mb-2`}>
                    <div className={`max-w-[75%] relative group`}>
                      {/* Edit/Delete buttons (only for own messages) */}
                      {isOwnComment && !isEditingThis && (
                        <div className="absolute -top-8 right-0 hidden group-hover:flex gap-1 z-20 message-actions">
                          <button
                            onClick={() => startEdit(comment)}
                            className="bg-gray-700 text-white rounded-full p-1.5 hover:bg-gray-800 shadow-lg transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 shadow-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className="message-bubble rounded-lg px-4 py-2 shadow-sm"
                        style={{
                          background: isOwnComment
                            ? 'var(--activity-card-background)'
                            : 'var(--card-background)',
                          color: 'var(--main-text)',
                          border: commentIsFromFinance || isOwnComment
                            ? `1px solid var(--activity-card-border)`
                            : `1px solid var(--card-border)`
                        }}
                      >
                        {/* Sender name (only for received messages) */}
                        {!isOwnComment && (
                          <div className={`text-xs font-semibold mb-1 flex items-center gap-1 ${
                            commentIsFromFinance ? 'text-green-700' : 'text-blue-700'
                          }`}>
                            {!!commentIsFromFinance && '🏦 '}
                            <span>{comment.created_by_name}</span>
                            {comment.is_online === 1 && (
                              <span className="inline-block w-2 h-2 bg-green-500 rounded-full" title="Online"></span>
                            )}
                          </div>
                        )}

                        {/* Message content or edit textarea */}
                        {isEditingThis ? (
                          <div className="space-y-2">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyDown={(e) => handleEditKeyPress(e, comment.id)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-none"
                              rows={3}
                              autoFocus
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={cancelEdit}
                                className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleEditComment(comment.id)}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{comment.comment_text}</p>
                        )}

                        {/* Timestamp, edited indicator, and status */}
                        {!isEditingThis && (
                          <div className="flex items-center gap-2 mt-1 justify-end">
                            <span className="text-[10px]" style={{ color: 'var(--main-text)', opacity: 0.6 }}>
                              {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isEdited(comment) && (
                              <span className="text-[10px] italic" style={{ color: 'var(--main-text)', opacity: 0.6 }}>edited</span>
                            )}
                            {isOwnComment && (
                              <span className="text-xs" style={{ color: 'var(--accent-primary)' }}>✓✓</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to Bottom Button */}
      {!isAtBottom && (
        <button
          onClick={() => scrollToBottom('smooth')}
          className="absolute bottom-24 right-8 rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow border z-10"
          style={{ background: 'var(--card-background)', borderColor: 'var(--card-border)' }}
        >
          <svg className="w-5 h-5" style={{ color: 'var(--main-text)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          {newMessageCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {newMessageCount > 9 ? '9+' : newMessageCount}
            </span>
          )}
        </button>
      )}

      {/* Input Area - Sticky at bottom */}
      <div className="border-t p-3" style={{ background: 'var(--card-background)', borderColor: 'var(--card-border)' }}>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-hidden"
              style={{
                background: 'var(--main-background)',
                color: 'var(--main-text)',
                borderColor: 'var(--card-border)',
                minHeight: '40px',
                maxHeight: '120px'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
            <p className="text-[10px] mt-1 ml-4" style={{ color: 'var(--main-text)', opacity: 0.5 }}>
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
