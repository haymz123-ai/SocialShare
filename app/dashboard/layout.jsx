'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { Home, MapPin, Plus, Truck, Calendar, Settings, User, LogOut, Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch('/api/get-role');
        const data = await response.json();
        
        if (data.role) {
          setUserRole(data.role);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserRole();
    }
  }, [user]);

  const getSidebarItems = () => {
    const commonItems = [
      { icon: MapPin, label: 'Find Trucks', path: '/foodtruck' },
      { icon: User, label: 'Profile', path: '/dashboard/profile' },
    ];

    switch (userRole) {
      case 'general_user':
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard' },
          ...commonItems,
        ];
      case 'food_vendor':
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard' },
          ...commonItems,
          { icon: Plus, label: 'Add Truck Details', path: '/dashboard/add-truck' },
          { icon: Truck, label: 'My Trucks', path: '/dashboard/my-trucks' },
        ];
      case 'event_planner':
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard' },
          ...commonItems,
          { icon: Calendar, label: 'Events', path: '/events' },
          { icon: Truck, label: 'Book Trucks', path: '/book-trucks' },
          { icon: Settings, label: 'Settings', path: '/settings' },
        ];
      default:
        return commonItems;
    }
  };

  const sidebarItems = getSidebarItems();

  if (loading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(102, 126, 234, 0.3)',
          borderTopColor: '#667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1001,
          background: 'rgba(15, 12, 41, 0.95)',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          borderRadius: '12px',
          padding: '12px',
          cursor: 'pointer',
          display: 'none',
        }}
        className="mobile-menu-btn"
      >
        {sidebarOpen ? (
          <X style={{ width: '24px', height: '24px', color: '#fff' }} />
        ) : (
          <Menu style={{ width: '24px', height: '24px', color: '#fff' }} />
        )}
      </button>

      <div
        style={{
          width: '280px',
          height: '100vh',
          background: 'rgba(15, 12, 41, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(102, 126, 234, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          transition: 'transform 0.3s ease',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          zIndex: 1000,
        }}
        className="sidebar"
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '40px',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
          }}>
            🚚
          </div>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '700',
              color: '#fff',
            }}>
              Food Truck Finder
            </h2>
            <p style={{
              margin: 0,
              fontSize: '12px',
              color: '#8b92b8',
              textTransform: 'capitalize',
            }}>
              {userRole.replace('_', ' ')}
            </p>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <div
                key={item.path}
                onClick={() => {
                  router.push(item.path);
                  setSidebarOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(102, 126, 234, 0.4)'
                    : '1px solid transparent',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(26, 26, 46, 0.6)';
                    e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                <Icon style={{
                  width: '20px',
                  height: '20px',
                  color: isActive ? '#667eea' : '#8b92b8',
                }} />
                <span style={{
                  fontSize: '15px',
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? '#fff' : '#8b92b8',
                }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </nav>

        <div style={{
          borderTop: '1px solid rgba(102, 126, 234, 0.2)',
          paddingTop: '20px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(26, 26, 46, 0.6)',
            marginBottom: '12px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: '600',
              color: '#fff',
            }}>
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#fff',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {user?.firstName || 'User'}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#8b92b8',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {user?.primaryEmailAddress?.emailAddress}
              </div>
            </div>
          </div>

          <button
            onClick={() => signOut(() => router.push('/'))}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#fca5a5',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.2)';
              e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.1)';
              e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            }}
          >
            <LogOut style={{ width: '18px', height: '18px' }} />
            Sign Out
          </button>
        </div>
      </div>

      <div style={{
        flex: 1,
height: '100vh',
overflowY: 'auto',
padding: '32px',
}}>
{children}
</div>
<style jsx global>{`
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed !important;
        left: 0;
        top: 0;
        transform: translateX(-100%) !important;
      }
      .sidebar.open {
        transform: translateX(0) !important;
      }
      .mobile-menu-btn {
        display: flex !important;
      }
    }

    @media (min-width: 769px) {
      .sidebar {
        transform: translateX(0) !important;
      }
    }
  `}</style>
</div>
  )}