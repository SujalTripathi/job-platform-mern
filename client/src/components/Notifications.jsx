import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Check for new notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('authToken');
      // In a real app, you'd have a notifications API endpoint
      // For now, we'll simulate some notifications based on user role

      let mockNotifications = [];

      if (user.role === 'employer') {
        // Mock notifications for employers
        mockNotifications = [
          {
            id: 1,
            type: 'application',
            title: 'New Application Received',
            message: 'You have a new application for "Senior Developer" position',
            timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
            read: false
          },
          {
            id: 2,
            type: 'application',
            title: 'Application Update',
            message: 'John Doe updated their application for "Frontend Developer"',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            read: true
          }
        ];
      } else {
        // Mock notifications for job seekers
        mockNotifications = [
          {
            id: 1,
            type: 'application',
            title: 'Application Status Update',
            message: 'Your application for "Full Stack Developer" has been reviewed',
            timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
            read: false
          },
          {
            id: 2,
            type: 'job',
            title: 'New Jobs Match Your Search',
            message: '3 new jobs match your saved search for "React Developer"',
            timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
            read: true
          }
        ];
      }

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!user) return null;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#fff',
          fontSize: 18,
          cursor: 'pointer',
          position: 'relative',
          padding: '8px 12px',
          borderRadius: 4
        }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: 4,
            right: 4,
            background: '#dc3545',
            color: '#fff',
            borderRadius: '50%',
            width: 16,
            height: 16,
            fontSize: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          background: '#262626',
          border: '1px solid #3a3a3a',
          borderRadius: 8,
          width: 350,
          maxHeight: 400,
          overflowY: 'auto',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          marginTop: 5
        }}>
          <div style={{
            padding: '15px 20px',
            borderBottom: '1px solid #3a3a3a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h6 style={{ color: '#fbbf24', margin: 0 }}>Notifications</h6>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#007bff',
                  fontSize: 12,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          <div>
            {notifications.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#a3a3a3' }}>
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  style={{
                    padding: '15px 20px',
                    borderBottom: '1px solid #3a3a3a',
                    cursor: 'pointer',
                    background: notification.read ? 'transparent' : 'rgba(251, 191, 36, 0.1)',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = notification.read ? 'rgba(255,255,255,0.05)' : 'rgba(251, 191, 36, 0.15)'}
                  onMouseOut={(e) => e.currentTarget.style.background = notification.read ? 'transparent' : 'rgba(251, 191, 36, 0.1)'}
                >
                  <div style={{ display: 'flex', alignItems: 'start', gap: 10 }}>
                    <div style={{ fontSize: 16, marginTop: 2 }}>
                      {notification.type === 'application' ? '📋' :
                       notification.type === 'job' ? '💼' : '📢'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: notification.read ? 'normal' : 'bold',
                        color: '#fff',
                        fontSize: 14,
                        marginBottom: 4
                      }}>
                        {notification.title}
                      </div>
                      <div style={{
                        color: '#a3a3a3',
                        fontSize: 13,
                        lineHeight: 1.4,
                        marginBottom: 6
                      }}>
                        {notification.message}
                      </div>
                      <div style={{
                        color: '#737373',
                        fontSize: 11
                      }}>
                        {formatTimeAgo(notification.timestamp)}
                      </div>
                    </div>
                    {!notification.read && (
                      <div style={{
                        width: 8,
                        height: 8,
                        background: '#fbbf24',
                        borderRadius: '50%',
                        flexShrink: 0,
                        marginTop: 6
                      }} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showDropdown && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default Notifications;