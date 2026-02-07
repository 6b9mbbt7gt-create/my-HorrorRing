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

export function TimelineNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications?limit=20');
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
      const response = await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', { method: 'POST' });
      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white">通知</h3>
        {notifications.length > 0 && (
          <Button variant="secondary" size="sm" onClick={handleMarkAllAsRead}>
            すべて既読
          </Button>
        )}
      </div>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="sm" />
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">通知はありません</p>
      ) : (
        <ul className="space-y-2 overflow-y-auto">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`rounded-lg p-2 text-sm ${!n.isRead ? 'bg-gray-800/60' : 'bg-gray-800/30'}`}
            >
              {n.relatedPostId ? (
                <Link
                  href={`/posts/${n.relatedPostId}`}
                  onClick={() => handleMarkAsRead(n.id)}
                  className="block text-gray-300 hover:text-white"
                >
                  {n.content}
                  <span className="text-gray-500 text-xs block mt-0.5">
                    {formatRelativeTime(n.createdAt)}
                  </span>
                </Link>
              ) : n.relatedUserId ? (
                <Link
                  href={`/users/${n.relatedUserId}`}
                  onClick={() => handleMarkAsRead(n.id)}
                  className="block text-gray-300 hover:text-white"
                >
                  {n.content}
                  <span className="text-gray-500 text-xs block mt-0.5">
                    {formatRelativeTime(n.createdAt)}
                  </span>
                </Link>
              ) : (
                <div onClick={() => handleMarkAsRead(n.id)}>
                  <span className="text-gray-300">{n.content}</span>
                  <span className="text-gray-500 text-xs block mt-0.5">
                    {formatRelativeTime(n.createdAt)}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
