import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';

interface BudgetRequestNotification {
  request_id: number;
  request_number: string;
  activity_name: string;
  unread_count: number;
  last_message_at: string;
  status: string;
}

interface NotificationBellProps {
  onOpenConversation: (requestId: number, activityName: string) => void;
}

const BudgetRequestNotificationBell: React.FC<NotificationBellProps> = ({ onOpenConversation }) => {
  const [notifications, setNotifications] = useState<BudgetRequestNotification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await authFetch('/api/budget-requests/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const totalUnread = notifications.reduce((sum, n) => sum + n.unread_count, 0);

  const handleNotificationClick = (notification: BudgetRequestNotification) => {
    setShowDropdown(false);
    onOpenConversation(notification.request_id, notification.activity_name);
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="Budget Request Messages"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread Badge */}
        {totalUnread > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-96 overflow-y-auto">
            <div className="p-3 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>💬</span>
                Budget Request Messages
              </h3>
              {totalUnread > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  {totalUnread} unread message{totalUnread !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-sm">No messages yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <button
                    key={notification.request_id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full p-3 text-left hover:bg-gray-50 transition-colors ${
                      notification.unread_count > 0 ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-gray-900 text-sm">
                        {notification.activity_name}
                      </span>
                      {notification.unread_count > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                          {notification.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      Request #{notification.request_number}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        notification.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                        notification.status === 'under_review' ? 'bg-yellow-100 text-yellow-700' :
                        notification.status === 'returned_for_amendment' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {notification.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.last_message_at).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="p-2 border-t bg-gray-50">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  window.location.href = '/my-budget-requests';
                }}
                className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Requests →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BudgetRequestNotificationBell;
