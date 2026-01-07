'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { TrendingUp, Users, Truck, Calendar, MapPin, Star, Plus, ArrowRight, Bell, Search, Menu, X } from 'lucide-react';

export default function DashboardPage() {
  const [userRole, setUserRole] = useState('');
  const [stats, setStats] = useState({
    totalTrucks: 0,
    totalUsers: 0,
    totalEvents: 0,
    avgRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roleResponse = await fetch('/api/get-role');
        const roleData = await roleResponse.json();
        setUserRole(roleData.role);

        const statsResponse = await fetch('/api/dashboard/stats');
        const statsData = await statsResponse.json();
        if (statsData.stats) {
          setStats(statsData.stats);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRoleSpecificContent = () => {
    switch (userRole) {
      case 'general_user':
        return {
          title: 'Discover Amazing Food Trucks',
          subtitle: 'Your journey to delicious street food starts here',
          description: 'Explore a world of culinary delights on wheels. Find the best food trucks near you, discover new flavors, and support local vendors.',
          heroImage: '🍔',
          primaryAction: { label: 'Explore Food Trucks', href: '/foodtruck', icon: MapPin },
          secondaryAction: { label: 'View Favorites', href: '/profile', icon: Star },
          features: [
            { icon: '🗺️', title: 'Real-Time Locations', description: 'Track food trucks in real-time and never miss your favorite vendor' },
            { icon: '⭐', title: 'Ratings & Reviews', description: 'Make informed choices with community ratings and honest reviews' },
            { icon: '🎉', title: 'Special Events', description: 'Discover food truck festivals and special events near you' },
          ],
          stats: [
            { label: 'Food Trucks', value: stats.totalTrucks, gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' },
            { label: 'Average Rating', value: stats.avgRating.toFixed(1) + '★', gradient: 'linear-gradient(135deg, #eab308 0%, #f97316 100%)' },
            { label: 'Active Events', value: stats.totalEvents, gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' },
          ]
        };
      case 'food_vendor':
        return {
          title: 'Grow Your Food Truck Business',
          subtitle: 'Manage, analyze, and expand your mobile food empire',
          description: 'Take control of your food truck operations with powerful tools designed for vendors. Manage locations, track performance, and connect with more customers.',
          heroImage: '🚚',
          primaryAction: { label: 'Add New Truck', href: '/add-truck', icon: Plus },
          secondaryAction: { label: 'View My Trucks', href: '/my-trucks', icon: Truck },
          features: [
            { icon: '📊', title: 'Business Analytics', description: 'Track views, engagement, and customer feedback in real-time' },
            { icon: '📍', title: 'Location Management', description: 'Update your location and let customers find you easily' },
            { icon: '💼', title: 'Professional Profile', description: 'Showcase your menu, story, and build your brand' },
          ],
          stats: [
            { label: 'Your Trucks', value: '2', gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' },
            { label: 'Total Views', value: '1.2K', gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' },
            { label: 'Your Rating', value: '4.8★', gradient: 'linear-gradient(135deg, #eab308 0%, #f97316 100%)' },
          ]
        };
      case 'event_planner':
        return {
          title: 'Plan Extraordinary Events',
          subtitle: 'Book the perfect food trucks for unforgettable experiences',
          description: 'Create memorable events with the best food truck vendors. From corporate gatherings to festivals, find and book the perfect culinary experience.',
          heroImage: '🎪',
          primaryAction: { label: 'Create Event', href: '/events', icon: Calendar },
          secondaryAction: { label: 'Browse Vendors', href: '/foodtruck', icon: Truck },
          features: [
            { icon: '📅', title: 'Event Management', description: 'Organize multiple events and manage bookings all in one place' },
            { icon: '🤝', title: 'Vendor Coordination', description: 'Communicate directly with vendors and coordinate logistics' },
            { icon: '📈', title: 'Event Analytics', description: 'Track attendance, feedback, and plan better future events' },
          ],
          stats: [
            { label: 'Upcoming Events', value: '5', gradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)' },
            { label: 'Booked Trucks', value: '12', gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' },
            { label: 'Total Attendees', value: '850', gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' },
          ]
        };
      default:
        return {
          title: 'Welcome to Food Truck Finder',
          subtitle: 'Your gateway to mobile food experiences',
          description: 'Get started by selecting your role and exploring the platform.',
          heroImage: '🌟',
          primaryAction: { label: 'Get Started', href: '/profile', icon: ArrowRight },
          secondaryAction: { label: 'Learn More', href: '/about', icon: Users },
          features: [],
          stats: []
        };
    }
  };

  const content = getRoleSpecificContent();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
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
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    }}>
      {/* Navbar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(15, 12, 41, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
          }} onClick={() => router.push('/dashboard')}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}>
              🚚
            </div>
            <span style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#fff',
            }}>
              Food Truck Finder
            </span>
          </div>

          {/* Search Bar - Desktop */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            maxWidth: '500px',
            margin: '0 32px',
            position: 'relative',
          }}>
            <Search style={{
              position: 'absolute',
              left: '16px',
              width: '18px',
              height: '18px',
              color: '#8b92b8',
            }} />
            <input
              type="text"
              placeholder="Search food trucks, cuisines, events..."
              style={{
                width: '100%',
                padding: '10px 16px 10px 48px',
                borderRadius: '10px',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                background: 'rgba(26, 26, 46, 0.6)',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                e.target.style.background = 'rgba(26, 26, 46, 0.8)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                e.target.style.background = 'rgba(26, 26, 46, 0.6)';
              }}
            />
          </div>

          {/* Right Side Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            {/* Notifications */}
            <button style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              background: 'rgba(26, 26, 46, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(26, 26, 46, 0.6)';
              e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.2)';
            }}>
              <Bell style={{ width: '18px', height: '18px', color: '#8b92b8' }} />
              <span style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ef4444',
              }} />
            </button>

            {/* User Profile */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '6px 12px 6px 6px',
              borderRadius: '10px',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              background: 'rgba(26, 26, 46, 0.6)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onClick={() => router.push('/profile')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(26, 26, 46, 0.6)';
              e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.2)';
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
              }}>
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#fff',
              }}>
                {user?.firstName || 'User'}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '48px 24px',
      }}>
        {/* Hero Section */}
        <div style={{
          background: 'rgba(15, 12, 41, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          borderRadius: '24px',
          padding: '48px',
          marginBottom: '48px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          
          <div style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '800px',
          }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(102, 126, 234, 0.1)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              marginBottom: '16px',
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#a5b4fc',
              }}>
                {getGreeting()}, {user?.firstName || 'User'}! 👋
              </span>
            </div>

            <h1 style={{
              fontSize: '48px',
              fontWeight: '700',
              color: '#fff',
              marginBottom: '16px',
              lineHeight: '1.2',
            }}>
              {content.title}
            </h1>

            <p style={{
              fontSize: '20px',
              color: '#a5b4fc',
              marginBottom: '8px',
              fontWeight: '500',
            }}>
              {content.subtitle}
            </p>

            <p style={{
              fontSize: '16px',
              color: '#8b92b8',
              marginBottom: '32px',
              lineHeight: '1.6',
            }}>
              {content.description}
            </p>

            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={() => router.push(content.primaryAction.href)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
                }}
              >
                <content.primaryAction.icon style={{ width: '20px', height: '20px' }} />
                {content.primaryAction.label}
              </button>

              <button
                onClick={() => router.push(content.secondaryAction.href)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  background: 'rgba(26, 26, 46, 0.6)',
                  color: '#a5b4fc',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(26, 26, 46, 0.6)';
                  e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                }}
              >
                <content.secondaryAction.icon style={{ width: '20px', height: '20px' }} />
                {content.secondaryAction.label}
              </button>
            </div>
          </div>

          {/* Hero Emoji/Icon */}
          <div style={{
            position: 'absolute',
            right: '48px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '200px',
            opacity: 0.1,
          }}>
            {content.heroImage}
          </div>
        </div>

        {/* Stats Section */}
        {content.stats && content.stats.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
          }}>
            {content.stats.map((stat, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(15, 12, 41, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: '16px',
                  padding: '32px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.4)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  fontSize: '48px',
                  fontWeight: '700',
                  background: stat.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '12px',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '16px',
                  color: '#8b92b8',
                  fontWeight: '500',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Features Section */}
        {content.features && content.features.length > 0 && (
          <div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#fff',
              marginBottom: '24px',
              textAlign: 'center',
            }}>
              Why Choose Us
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}>
              {content.features.map((feature, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(15, 12, 41, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    borderRadius: '16px',
                    padding: '32px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.4)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    fontSize: '48px',
                    marginBottom: '16px',
                  }}>
                    {feature.icon}
                  </div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '12px',
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: '15px',
                    color: '#8b92b8',
                    lineHeight: '1.6',
                  }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}