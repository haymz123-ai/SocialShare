'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { 
  User, Mail, Shield, Calendar, Edit2, Save, X, 
  Bell, Search, MapPin, Star, Truck, Users, 
  Settings, LogOut, ChevronRight, Award, TrendingUp,
  Clock, Heart, Bookmark
} from 'lucide-react';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY,
  process.env.NEXT_PUBLIC_SUPABASE_PRIVATE_KEY
);

export default function ProfilePage() {
  const [userRole, setUserRole] = useState('');
  const [userStatus, setUserStatus] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: '',
    location: '',
    phone: '',
    firstName: '',
    lastName: '',
  });
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        // Fetch user data from Supabase
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('clerk_user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }

        if (data) {
          setUserRole(data.role);
          setUserStatus(data.status);
          setUserEmail(data.email);
          setProfileData({
            bio: data.bio || '',
            location: data.location || '',
            phone: data.phone || '',
            firstName: data.first_name || user.firstName || '',
            lastName: data.last_name || user.lastName || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const getRoleInfo = () => {
    switch (userRole) {
      case 'general_user':
        return {
          label: 'General User',
          color: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
          icon: Users,
          badge: '🍔'
        };
      case 'food_vendor':
        return {
          label: 'Food Vendor',
          color: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
          icon: Truck,
          badge: '🚚'
        };
      case 'event_planner':
        return {
          label: 'Event Planner',
          color: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
          icon: Calendar,
          badge: '🎪'
        };
      default:
        return {
          label: 'User',
          color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          icon: User,
          badge: '👤'
        };
    }
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  const stats = [
    { label: 'Favorites', value: '12', icon: Heart, color: '#ef4444' },
    { label: 'Bookmarks', value: '8', icon: Bookmark, color: '#f59e0b' },
    { label: 'Reviews', value: '24', icon: Star, color: '#eab308' },
    { label: 'Check-ins', value: '45', icon: MapPin, color: '#06b6d4' },
  ];

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          bio: profileData.bio,
          location: profileData.location,
          phone: profileData.phone,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          updated_at: new Date().toISOString(),
        })
        .eq('clerk_user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
        return;
      }

      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('An error occurred while saving your profile.');
    } finally {
      setSaving(false);
    }
  };

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
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
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

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '6px 12px 6px 6px',
              borderRadius: '10px',
              border: '1px solid rgba(102, 126, 234, 0.4)',
              background: 'rgba(102, 126, 234, 0.1)',
              cursor: 'pointer',
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
                {profileData.firstName?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#fff',
              }}>
                {profileData.firstName || user?.firstName || 'User'}
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '24px',
        }}>
          {/* Sidebar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}>
            {/* Profile Card */}
            <div style={{
              background: 'rgba(15, 12, 41, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              borderRadius: '20px',
              padding: '32px',
              textAlign: 'center',
            }}>
              <div style={{
                position: 'relative',
                display: 'inline-block',
                marginBottom: '20px',
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '48px',
                  fontWeight: '700',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                }}>
                  {profileData.firstName?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  right: '-8px',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: roleInfo.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  border: '3px solid rgba(15, 12, 41, 0.8)',
                }}>
                  {roleInfo.badge}
                </div>
              </div>

              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '8px',
              }}>
                {profileData.firstName || user?.firstName} {profileData.lastName || user?.lastName}
              </h2>

              <div style={{
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: '8px',
                background: 'rgba(102, 126, 234, 0.1)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                marginBottom: '16px',
              }}>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#a5b4fc',
                }}>
                  {roleInfo.label}
                </span>
              </div>

              <p style={{
                fontSize: '14px',
                color: '#8b92b8',
                marginBottom: '24px',
                lineHeight: '1.6',
              }}>
                {profileData.bio || 'Food enthusiast exploring the best street food in town 🌮'}
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}>
            {/* Stats Grid */}
           

            {/* Profile Information */}
            <div style={{
              background: 'rgba(15, 12, 41, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              borderRadius: '20px',
              padding: '32px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#fff',
                }}>
                  Profile Information
                </h3>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  disabled={saving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isEditing 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {saving ? (
                    <>Saving...</>
                  ) : isEditing ? (
                    <>
                      <Save style={{ width: '16px', height: '16px' }} />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit2 style={{ width: '16px', height: '16px' }} />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px',
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#8b92b8',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      background: isEditing ? 'rgba(26, 26, 46, 0.8)' : 'rgba(26, 26, 46, 0.4)',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#8b92b8',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      background: isEditing ? 'rgba(26, 26, 46, 0.8)' : 'rgba(26, 26, 46, 0.4)',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#8b92b8',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      background: isEditing ? 'rgba(26, 26, 46, 0.8)' : 'rgba(26, 26, 46, 0.4)',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#8b92b8',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    placeholder="City, Country"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      background: isEditing ? 'rgba(26, 26, 46, 0.8)' : 'rgba(26, 26, 46, 0.4)',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#8b92b8',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    placeholder="+1 (555) 000-0000"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      background: isEditing ? 'rgba(26, 26, 46, 0.8)' : 'rgba(26, 26, 46, 0.4)',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#8b92b8',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    disabled
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      background: 'rgba(26, 26, 46, 0.4)',
                      color: '#8b92b8',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'not-allowed',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}