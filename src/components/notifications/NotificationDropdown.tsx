'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatRelativeTime } from '@/lib/utils/format';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Button } from '../common/Button';

type Notification = {
  id: string;
  type: string;
  content: string;
  relatedUserId?: string | null;
  relatedPostId?: string | null;
  isRead: boolean;
  createdAt: string;
};

type NotificationDropdownProps = {
  onClose: () => void;
  onNotificationRead: () => void;
};

export function NotificationDropdown({
  onClose,
  onNotificationRead,
}: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications?limit=10');
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications || []);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        onNotificationRead();
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST',
      });
      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        onNotificationRead();
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h3 className="text-white font-semibold">通知</h3>
        {notifications.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMarkAllAsRead}
          >
            すべて既読
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="p-8 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          通知はありません
        </div>
      ) : (
        <div className="divide-y divide-gray-800">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-800 transition-colors ${
                !notification.isRead ? 'bg-gray-800/50' : ''
              }`}
            >
              {notification.relatedPostId ? (
                <Link
                  href={`/posts/${notification.relatedPostId}`}
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="block"
                >
                  <p className="text-gray-300 text-sm mb-2">
                    {notification.content}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </Link>
              ) : notification.relatedUserId ? (
                <Link
                  href={`/users/${notification.relatedUserId}`}
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="block"
                >
                  <p className="text-gray-300 text-sm mb-2">
                    {notification.content}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </Link>
              ) : (
                <div onClick={() => handleMarkAsRead(notification.id)}>
                  <p className="text-gray-300 text-sm mb-2">
                    {notification.content}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
