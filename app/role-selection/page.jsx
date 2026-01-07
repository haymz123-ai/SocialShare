'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Truck, Users, Calendar, Check, Loader2 } from 'lucide-react';

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useUser();

  const roles = [
    {
      id: 'general_user',
      title: 'General User',
      description: 'Find and explore food trucks in your area',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      features: ['Find nearby food trucks', 'View truck menus', 'Save favorites', 'View ratings and reviews']
    },
    {
      id: 'food_vendor',
      title: 'Food Truck Vendor',
      description: 'Manage your food truck business',
      icon: Truck,
      color: 'from-purple-500 to-pink-500',
      features: ['Add truck details', 'Manage menu items', 'Update location', 'View customer reviews']
    },
    {
      id: 'event_planner',
      title: 'Event Planner',
      description: 'Book food trucks for your events',
      icon: Calendar,
      color: 'from-orange-500 to-red-500',
      features: ['Browse available trucks', 'Book for events', 'Manage bookings', 'Coordinate with vendors']
    }
  ];

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/select-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkUserId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to select role');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to select role');
      console.error('Role selection error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        maxWidth: '1200px',
        width: '100%',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
        }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            marginBottom: '24px',
          }}>
            🚚
          </div>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
          }}>
            Welcome to Food Truck Finder
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#8b92b8',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Choose your role to get started and access the features designed for you
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}>
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                style={{
                  background: isSelected 
                    ? 'rgba(102, 126, 234, 0.15)' 
                    : 'rgba(15, 12, 41, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: isSelected 
                    ? '2px solid rgba(102, 126, 234, 0.5)' 
                    : '2px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: '20px',
                  padding: '32px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.4)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                  }}>
                    <Check style={{ width: '18px', height: '18px', color: '#fff' }} />
                  </div>
                )}

                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                }}>
                  <Icon style={{ width: '32px', height: '32px', color: '#fff' }} />
                </div>

                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#fff',
                  marginBottom: '8px',
                }}>
                  {role.title}
                </h3>

                <p style={{
                  fontSize: '15px',
                  color: '#8b92b8',
                  marginBottom: '20px',
                  lineHeight: '1.6',
                }}>
                  {role.description}
                </p>

                <div style={{
                  borderTop: '1px solid rgba(102, 126, 234, 0.2)',
                  paddingTop: '20px',
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#8b92b8',
                    fontWeight: '600',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Features
                  </div>
                  {role.features.map((feature, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }} />
                      <span style={{
                        fontSize: '14px',
                        color: '#a5b4fc',
                      }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            color: '#fca5a5',
            fontSize: '14px',
            textAlign: 'center',
            marginBottom: '24px',
          }}>
            {error}
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'center',
        }}>
          <button
            onClick={handleRoleSelection}
            disabled={loading || !selectedRole}
            style={{
              padding: '16px 48px',
              borderRadius: '12px',
              border: 'none',
              background: loading || !selectedRole
                ? 'rgba(102, 126, 234, 0.3)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading || !selectedRole ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            }}
            onMouseEnter={(e) => {
              if (!loading && selectedRole) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.3)';
            }}
          >
            {loading ? (
              <>
                <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                Setting up your account...
              </>
            ) : (
              <>
                Continue
                <Check style={{ width: '20px', height: '20px' }} />
              </>
            )}
          </button>
        </div>

        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}


