'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Star, Clock, Truck, Zap, Globe, ChevronRight, Menu, X, Play, TrendingUp, Users, Award, Sparkles, ArrowRight, Heart, MessageCircle, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function FoodTruckLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animatedNumber, setAnimatedNumber] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const target = 10247;
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedNumber(target);
        clearInterval(timer);
      } else {
        setAnimatedNumber(Math.floor(current));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, []);

  // Interactive Canvas Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        const dx = cursorPos.x - p.x;
        const dy = cursorPos.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(cursorPos.x, cursorPos.y);
          ctx.strokeStyle = `rgba(102, 126, 234, ${0.2 - dist / 750})`;
          ctx.stroke();
        }
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(102, 126, 234, 0.5)';
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cursorPos]);

  const testimonials = [
    { name: 'Sarah Chen', role: 'Food Blogger', text: 'Found my favorite taco truck in minutes! This app is a game-changer.', avatar: '👩', rating: 5 },
    { name: 'Mike Johnson', role: 'Software Dev', text: 'Never miss lunch again. The real-time tracking is incredible!', avatar: '👨', rating: 5 },
    { name: 'Emma Davis', role: 'Foodie', text: 'Best food discovery app ever. I use it every single day!', avatar: '👧', rating: 5 },
  ];

  const cities = ['New York', 'Los Angeles', 'Chicago', 'Austin', 'Portland', 'Seattle', 'Miami', 'Boston'];

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: '#0a0a0f',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Interactive Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Gradient Orbs */}
      <div style={{
        position: 'fixed',
        top: '-200px',
        right: '-200px',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        zIndex: 0,
        animation: 'float 20s ease-in-out infinite',
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-300px',
        left: '-300px',
        width: '700px',
        height: '700px',
        background: 'radial-gradient(circle, rgba(118, 75, 162, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: 0,
        animation: 'float 25s ease-in-out infinite reverse',
      }} />

      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(10, 10, 15, 0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
     //   borderBottom: scrolled ? '1px solid rgba(102, 126, 234, 0.2)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '20px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 0 30px rgba(102, 126, 234, 0.6)',
              animation: 'glow 2s ease-in-out infinite',
            }}>
              🚚
            </div>
            <span style={{
              fontSize: '24px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px',
            }}>
              TruckFinder
            </span>
          </div>

          <div style={{
            display: 'flex',
            gap: '40px',
            alignItems: 'center',
          }} className="desktop-menu">
            {['Features', 'Cities', 'Pricing', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{
                  color: '#e5e7eb',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#667eea';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#e5e7eb';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {item}
              </a>
            ))}
            <Link href='/dashboard'>
            
            
            <button style={{
              padding: '12px 28px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.05)';
              e.target.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
            }}>
              Launch App
            </button>
            </Link>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'rgba(102, 126, 234, 0.2)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              padding: '12px',
              borderRadius: '10px',
              cursor: 'pointer',
              color: '#fff',
            }}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

   {/* Hero Section - 3D Floating City Scene */}
<section style={{
  position: 'relative',
  zIndex: 1,
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '160px 40px 100px',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  gap: '80px',
}}>
  {/* Left Content */}
  <div style={{ flex: 1, zIndex: 2 }}>
    {/* Animated Badge */}
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 24px',
      borderRadius: '50px',
      background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(251, 191, 36, 0.2) 100%)',
      border: '1px solid rgba(251, 191, 36, 0.4)',
      marginBottom: '32px',
      animation: 'slideDown 0.6s ease-out',
      boxShadow: '0 8px 32px rgba(251, 191, 36, 0.3)',
    }}>
      <div style={{
        width: '10px',
        height: '10px',
        background: '#fbbf24',
        borderRadius: '50%',
        animation: 'ping 2s ease-in-out infinite',
        boxShadow: '0 0 20px #fbbf24',
      }} />
      <span style={{
        fontSize: '14px',
        fontWeight: '700',
        color: '#fbbf24',
        letterSpacing: '0.5px',
      }}>
        🔥 10,247 trucks tracked today
      </span>
    </div>

    {/* Main Headline with Gradient Animation */}
    <h1 style={{
      fontSize: '82px',
      fontWeight: '900',
      lineHeight: '1.05',
      marginBottom: '28px',
      letterSpacing: '-4px',
      animation: 'slideUp 0.8s ease-out',
    }}>
      <span style={{
        display: 'block',
        background: 'linear-gradient(135deg, #fff 0%, #e5e7eb 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '8px',
      }}>
        Food Trucks
      </span>
      <span style={{
        display: 'block',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #fbbf24 50%, #667eea 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundSize: '200% auto',
        animation: 'gradientShift 3s ease infinite',
      }}>
        At Your Fingertips
      </span>
    </h1>

    <p style={{
      fontSize: '22px',
      color: '#cbd5e1',
      lineHeight: '1.7',
      marginBottom: '48px',
      maxWidth: '580px',
      animation: 'slideUp 1s ease-out',
      fontWeight: '400',
    }}>
      Stop chasing. Start tracking. Find every food truck in your city with GPS precision and never miss your favorite meal again.
    </p>

    {/* CTA Buttons with Hover Effects */}
    <div style={{
      display: 'flex',
      gap: '20px',
      marginBottom: '70px',
      animation: 'slideUp 1.2s ease-out',
    }} className="hero-buttons">
      <Link href='/dashboard'>
      <button style={{
        padding: '22px 44px',
        borderRadius: '18px',
        border: 'none',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)',
        color: '#fff',
        fontSize: '18px',
        fontWeight: '800',
        cursor: 'pointer',
        boxShadow: '0 12px 48px rgba(255, 71, 87, 0.5)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-6px) scale(1.05)';
        e.target.style.boxShadow = '0 20px 60px rgba(255, 71, 87, 0.7)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0) scale(1)';
        e.target.style.boxShadow = '0 12px 48px rgba(255, 71, 87, 0.5)';
      }}>
        <Zap style={{ width: '22px', height: '22px' }} />
        Find Trucks Near Me
      </button>
      </Link>

      <button style={{
        padding: '22px 44px',
        borderRadius: '18px',
        border: '2px solid rgba(102, 126, 234, 0.6)',
        background: 'rgba(102, 126, 234, 0.08)',
        backdropFilter: 'blur(12px)',
        color: '#fff',
        fontSize: '18px',
        fontWeight: '800',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
      onMouseEnter={(e) => {
        e.target.style.background = 'rgba(102, 126, 234, 0.2)';
        e.target.style.borderColor = '#667eea';
        e.target.style.transform = 'translateY(-6px)';
        e.target.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'rgba(102, 126, 234, 0.08)';
        e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)';
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      }}>
        <Play style={{ width: '22px', height: '22px' }} />
        Watch Demo
      </button>
    </div>

    {/* Animated Stats Ticker */}
    <div style={{
      padding: '28px 32px',
      borderRadius: '20px',
      background: 'rgba(26, 26, 46, 0.6)',
      border: '1px solid rgba(102, 126, 234, 0.2)',
      backdropFilter: 'blur(20px)',
      animation: 'slideUp 1.4s ease-out',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '32px',
      }} className="hero-stats">
        {[
          { icon: '🚚', number: '10K+', label: 'Active Trucks', color: '#ff6b6b' },
          { icon: '⭐', number: '4.9', label: 'User Rating', color: '#fbbf24' },
          { icon: '📍', number: '50+', label: 'Cities', color: '#667eea' },
        ].map((stat, i) => (
          <div 
            key={i} 
            style={{ 
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{
              fontSize: '32px',
              marginBottom: '10px',
              animation: `float ${3 + i}s ease-in-out infinite`,
            }}>
              {stat.icon}
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '900',
              color: stat.color,
              marginBottom: '6px',
              letterSpacing: '-1px',
              textShadow: `0 0 20px ${stat.color}80`,
            }}>
              {stat.number}
            </div>
            <div style={{
              fontSize: '13px',
              color: '#8b92b8',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Right Side - 3D Isometric City */}
  <div style={{
    flex: 1,
    position: 'relative',
    minHeight: '700px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    perspective: '1500px',
  }}>
    {/* Ambient Glow */}
    <div style={{
      position: 'absolute',
      width: '500px',
      height: '500px',
      background: 'radial-gradient(circle, rgba(255, 107, 107, 0.3) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(80px)',
      animation: 'pulse 4s ease-in-out infinite',
    }} />

    {/* 3D City Container */}
    <div style={{
      position: 'relative',
      width: '600px',
      height: '600px',
      transformStyle: 'preserve-3d',
      transform: `rotateX(${20 - (cursorPos.y / window.innerHeight) * 10}deg) rotateZ(${-25 + (cursorPos.x / window.innerWidth) * 15}deg)`,
      transition: 'transform 0.15s ease-out',
      animation: 'float 8s ease-in-out infinite',
    }}>
      {/* Isometric Grid Base */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.1) 25%, transparent 25%, transparent 75%, rgba(102, 126, 234, 0.1) 75%), linear-gradient(45deg, rgba(102, 126, 234, 0.1) 25%, transparent 25%, transparent 75%, rgba(102, 126, 234, 0.1) 75%)',
        backgroundSize: '60px 60px',
        backgroundPosition: '0 0, 30px 30px',
        opacity: 0.3,
        transform: 'translateZ(-50px)',
      }} />

      {/* Buildings */}
      {[
        { left: 100, top: 150, width: 80, height: 200, color: '#667eea', delay: 0 },
        { left: 200, top: 180, width: 70, height: 160, color: '#764ba2', delay: 0.2 },
        { left: 350, top: 120, width: 90, height: 220, color: '#667eea', delay: 0.4 },
        { left: 450, top: 200, width: 75, height: 140, color: '#764ba2', delay: 0.6 },
        { left: 120, top: 320, width: 85, height: 180, color: '#667eea', delay: 0.3 },
        { left: 320, top: 300, width: 65, height: 150, color: '#764ba2', delay: 0.5 },
      ].map((building, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${building.left}px`,
            top: `${building.top}px`,
            width: `${building.width}px`,
            height: `${building.height}px`,
            background: `linear-gradient(135deg, ${building.color} 0%, ${building.color}cc 100%)`,
            borderRadius: '4px 4px 0 0',
            boxShadow: `0 20px 60px ${building.color}60, inset 0 -2px 10px rgba(0,0,0,0.3)`,
            transform: 'translateZ(0px)',
            animation: `buildingRise 1s ease-out ${building.delay}s backwards`,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Building Windows */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            padding: '12px',
            height: '100%',
          }}>
            {[...Array(12)].map((_, j) => (
              <div
                key={j}
                style={{
                  background: Math.random() > 0.3 ? '#fbbf24' : 'transparent',
                  borderRadius: '2px',
                  boxShadow: '0 0 10px #fbbf24',
                  animation: `windowBlink ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Animated Food Trucks on Streets */}
      {[
        { emoji: '🚚', startX: -50, startY: 250, endX: 650, duration: 12, delay: 0, size: 50 },
        { emoji: '🍕', startX: 650, startY: 320, endX: -50, duration: 10, delay: 2, size: 45 },
        { emoji: '🌮', startX: -50, startY: 400, endX: 650, duration: 14, delay: 4, size: 48 },
        { emoji: '🍔', startX: 650, startY: 180, endX: -50, duration: 11, delay: 1, size: 46 },
      ].map((truck, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            fontSize: `${truck.size}px`,
            filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5))',
            animation: `streetDrive${i} ${truck.duration}s linear infinite ${truck.delay}s`,
            zIndex: 100,
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.4)';
            e.target.style.filter = 'drop-shadow(0 15px 30px rgba(251, 191, 36, 0.8))';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.filter = 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5))';
          }}
        >
          {truck.emoji}
        </div>
      ))}

      {/* Floating Food Icons */}
      {[
        { emoji: '🍕', x: 80, y: 80, size: 40, delay: 0 },
        { emoji: '🌮', x: 520, y: 100, size: 35, delay: 1 },
        { emoji: '🍔', x: 150, y: 500, size: 38, delay: 0.5 },
        { emoji: '🍦', x: 480, y: 480, size: 36, delay: 1.5 },
        { emoji: '☕', x: 300, y: 60, size: 32, delay: 2 },
        { emoji: '🥤', x: 400, y: 520, size: 34, delay: 1.2 },
      ].map((food, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${food.x}px`,
            top: `${food.y}px`,
            fontSize: `${food.size}px`,
            animation: `floatFood ${5 + i}s ease-in-out infinite ${food.delay}s`,
            filter: 'drop-shadow(0 4px 12px rgba(255, 255, 255, 0.3))',
            cursor: 'pointer',
            transform: 'translateZ(100px)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateZ(100px) scale(1.5) rotate(15deg)';
            e.target.style.filter = 'drop-shadow(0 8px 24px rgba(251, 191, 36, 0.8))';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateZ(100px) scale(1) rotate(0deg)';
            e.target.style.filter = 'drop-shadow(0 4px 12px rgba(255, 255, 255, 0.3))';
          }}
        >
          {food.emoji}
        </div>
      ))}

      {/* Glowing Location Pins */}
      {[
        { x: 150, y: 200 },
        { x: 380, y: 180 },
        { x: 250, y: 350 },
        { x: 470, y: 280 },
      ].map((pin, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${pin.x}px`,
            top: `${pin.y}px`,
            width: '20px',
            height: '20px',
            animation: `ping ${1.5 + i * 0.3}s ease-in-out infinite ${i * 0.4}s`,
            transform: 'translateZ(50px)',
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            background: '#ff6b6b',
            borderRadius: '50% 50% 50% 0',
            transform: 'rotate(-45deg)',
            boxShadow: '0 0 30px #ff6b6b, 0 10px 20px rgba(255, 107, 107, 0.5)',
            border: '2px solid #fff',
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(45deg)',
              fontSize: '10px',
            }}>
              📍
            </div>
          </div>
        </div>
      ))}

      {/* Pulsing Circles */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: `${(i + 1) * 200}px`,
            height: `${(i + 1) * 200}px`,
            border: '2px solid rgba(255, 107, 107, 0.2)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%) translateZ(0px)',
            animation: `radarRing ${3 + i}s ease-out infinite ${i * 0.5}s`,
          }}
        />
      ))}
    </div>

    {/* Floating Info Cards */}
    <div style={{
      position: 'absolute',
      bottom: '60px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '16px',
      animation: 'slideUp 1.6s ease-out',
    }}>
      {[
        { icon: '⚡', text: 'Real-Time', subtext: 'Updates', color: '#fbbf24' },
        { icon: '🎯', text: 'Precise', subtext: 'Location', color: '#667eea' },
        { icon: '❤️', text: 'Top', subtext: 'Rated', color: '#ff6b6b' },
      ].map((card, i) => (
        <div
          key={i}
          style={{
            padding: '16px 20px',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: `2px solid ${card.color}40`,
            minWidth: '110px',
            textAlign: 'center',
            boxShadow: `0 8px 32px ${card.color}30`,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
            e.currentTarget.style.boxShadow = `0 12px 48px ${card.color}60`;
            e.currentTarget.style.borderColor = card.color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = `0 8px 32px ${card.color}30`;
            e.currentTarget.style.borderColor = `${card.color}40`;
          }}
        >
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>{card.icon}</div>
          <div style={{
            fontSize: '14px',
            fontWeight: '800',
            color: card.color,
            marginBottom: '2px',
            letterSpacing: '0.5px',
          }}>
            {card.text}
          </div>
          <div style={{
            fontSize: '11px',
            color: '#8b92b8',
            fontWeight: '600',
          }}>
            {card.subtext}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
      {/* Interactive Map Preview Section */}
     {/* Live Tracking Section - Radar Interface */}
<section style={{
  position: 'relative',
  zIndex: 1,
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '100px 40px',
}}>
  <div style={{
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%)',
    borderRadius: '32px',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    padding: '60px',
    backdropFilter: 'blur(20px)',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Animated Background Pulse */}
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '600px',
      height: '600px',
      background: 'radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%)',
      borderRadius: '50%',
      animation: 'radarPulse 4s ease-out infinite',
    }} />
    
    <div style={{ textAlign: 'center', marginBottom: '60px', position: 'relative', zIndex: 1 }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 20px',
        borderRadius: '20px',
        background: 'rgba(16, 185, 129, 0.2)',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        marginBottom: '20px',
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          background: '#10b981',
          borderRadius: '50%',
          boxShadow: '0 0 12px #10b981',
          animation: 'ping 1.5s ease-in-out infinite',
        }} />
        <span style={{ fontSize: '14px', color: '#10b981', fontWeight: '700', letterSpacing: '1px' }}>
          SCANNING AREA • UPDATES EVERY 60s
        </span>
      </div>
      <h2 style={{
        fontSize: '56px',
        fontWeight: '900',
        marginBottom: '20px',
        letterSpacing: '-2px',
      }}>
        <span style={{ color: '#fff' }}>Watch Trucks Move</span>
        <span style={{
          display: 'block',
          background: 'linear-gradient(135deg, #10b981 0%, #667eea 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Like Magic ✨
        </span>
      </h2>
      <p style={{
        fontSize: '20px',
        color: '#cbd5e1',
        maxWidth: '700px',
        margin: '0 auto',
      }}>
        Advanced GPS tracking shows real-time positions with sub-meter accuracy
      </p>
    </div>

    {/* Radar/Sonar Interface */}
    <div style={{
      position: 'relative',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5)',
      background: '#0a0a0f',
      border: '2px solid rgba(16, 185, 129, 0.3)',
    }}>
      <div style={{
        aspectRatio: '16/9',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Radar Circles */}
        {[1, 2, 3, 4].map((ring, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${ring * 150}px`,
              height: `${ring * 150}px`,
              border: `1px solid rgba(16, 185, 129, ${0.3 - i * 0.05})`,
              borderRadius: '50%',
              animation: `radarRing ${4 + i}s ease-out infinite`,
            }}
          />
        ))}

        {/* Scanning Line */}
        <div style={{
          position: 'absolute',
          width: '2px',
          height: '50%',
          background: 'linear-gradient(to bottom, transparent, #10b981, transparent)',
          transformOrigin: 'bottom center',
          animation: 'radarScan 4s linear infinite',
          filter: 'drop-shadow(0 0 10px #10b981)',
        }} />

        {/* Center Point */}
        <div style={{
          position: 'absolute',
          width: '16px',
          height: '16px',
          background: '#10b981',
          borderRadius: '50%',
          boxShadow: '0 0 30px #10b981',
          animation: 'ping 2s ease-in-out infinite',
        }} />

        {/* Animated Truck Markers with Trails */}
        {[
          { x: 30, y: 25, delay: 0, emoji: '🚚', name: 'Taco Palace' },
          { x: 60, y: 35, delay: 1, emoji: '🍕', name: 'Pizza Paradise' },
          { x: 45, y: 60, delay: 2, emoji: '🍔', name: 'Burger Boss' },
          { x: 25, y: 70, delay: 1.5, emoji: '🌮', name: 'Burrito Bliss' },
          { x: 70, y: 55, delay: 0.5, emoji: '🍦', name: 'Ice Cream Dream' },
          { x: 55, y: 40, delay: 2.5, emoji: '☕', name: 'Coffee Cart' },
        ].map((truck, i) => (
          <div key={i}>
            {/* Trail Effect */}
            <div style={{
              position: 'absolute',
              left: `${truck.x}%`,
              top: `${truck.y}%`,
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              animation: `truckPulse ${2 + i * 0.3}s ease-out infinite ${truck.delay}s`,
              filter: 'blur(8px)',
            }} />
            
            {/* Truck Marker */}
            <div
              style={{
                position: 'absolute',
                left: `${truck.x}%`,
                top: `${truck.y}%`,
                transform: 'translate(-50%, -50%)',
                animation: `truckBounce ${3 + i * 0.5}s ease-in-out infinite ${truck.delay}s`,
                zIndex: 10,
                cursor: 'pointer',
              }}
            >
              {/* Marker Pin */}
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #10b981 0%, #667eea 100%)',
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 30px rgba(16, 185, 129, 0.6)',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'rotate(-45deg) scale(1.3)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotate(-45deg) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(16, 185, 129, 0.6)';
              }}>
                <span style={{
                  transform: 'rotate(45deg)',
                  fontSize: '20px',
                }}>
                  {truck.emoji}
                </span>
              </div>

              {/* Info Card on Hover */}
              <div style={{
                position: 'absolute',
                bottom: '60px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '12px 16px',
                background: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                whiteSpace: 'nowrap',
                opacity: 0,
                pointerEvents: 'none',
                transition: 'opacity 0.3s ease',
              }}
              className={`truck-info-${i}`}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#fff',
                  marginBottom: '4px',
                }}>
                  {truck.name}
                </div>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  fontSize: '12px',
                  color: '#10b981',
                }}>
                  <span>📍 Moving</span>
                  <span>⏱ Updated 30s ago</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Live Status Indicators */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          display: 'flex',
          gap: '12px',
        }}>
          {[
            { count: '6', label: 'Active', color: '#10b981' },
            { count: '247', label: 'Today', color: '#667eea' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                padding: '12px 20px',
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: `1px solid ${stat.color}40`,
              }}
            >
              <div style={{
                fontSize: '24px',
                fontWeight: '900',
                color: stat.color,
                marginBottom: '4px',
                textAlign: 'center',
              }}>
                {stat.count}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#8b92b8',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Feature Pills */}
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginTop: '40px',
      flexWrap: 'wrap',
    }}>
      {[
        { icon: '⚡', text: '60s Refresh Rate', color: '#fbbf24' },
        { icon: '📡', text: 'GPS Precision', color: '#667eea' },
        { icon: '🎯', text: 'Smart Predictions', color: '#10b981' },
        { icon: '🔔', text: 'Instant Alerts', color: '#ff4757' },
      ].map((feature, i) => (
        <div
          key={i}
          style={{
            padding: '14px 24px',
            background: `rgba(${feature.color === '#fbbf24' ? '251, 191, 36' : feature.color === '#667eea' ? '102, 126, 234' : feature.color === '#10b981' ? '16, 185, 129' : '255, 71, 87'}, 0.1)`,
            border: `1px solid ${feature.color}40`,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `rgba(${feature.color === '#fbbf24' ? '251, 191, 36' : feature.color === '#667eea' ? '102, 126, 234' : feature.color === '#10b981' ? '16, 185, 129' : '255, 71, 87'}, 0.2)`;
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.borderColor = feature.color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `rgba(${feature.color === '#fbbf24' ? '251, 191, 36' : feature.color === '#667eea' ? '102, 126, 234' : feature.color === '#10b981' ? '16, 185, 129' : '255, 71, 87'}, 0.1)`;
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = `${feature.color}40`;
          }}
        >
          <span style={{ fontSize: '22px' }}>{feature.icon}</span>
          <span style={{
            fontSize: '15px',
            fontWeight: '700',
            color: '#fff',
          }}>{feature.text}</span>
        </div>
      ))}
    </div>
  </div>
</section>
      {/* Testimonials Carousel */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1400px',
        margin: '100px auto',
        padding: '0 40px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: '900',
            marginBottom: '16px',
            letterSpacing: '-2px',
          }}>
            Loved by Food Enthusiasts
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#8b92b8',
          }}>
            Join thousands of happy users discovering amazing street food
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '30px',
        }} className="testimonials-grid">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              style={{
                padding: '32px',
                borderRadius: '20px',
                background: hoveredCard === i 
                  ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                  : 'rgba(26, 26, 46, 0.4)',
                border: hoveredCard === i
                  ? '1px solid rgba(102, 126, 234, 0.5)'
                  : '1px solid rgba(102, 126, 234, 0.2)',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{
                display: 'flex',
                marginBottom: '20px',
              }}>
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} style={{ width: '20px', height: '20px', fill: '#fbbf24', color: '#fbbf24' }} />
                ))}
              </div>
              <p style={{
                fontSize: '16px',
                color: '#e5e7eb',
                lineHeight: '1.6',
                marginBottom: '24px',
              }}>
                "{testimonial.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>
                    {testimonial.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#8b92b8' }}>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cities Ticker */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        padding: '60px 0',
        overflow: 'hidden',
        background: 'rgba(102, 126, 234, 0.05)',
        borderTop: '1px solid rgba(102, 126, 234, 0.2)',
        borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
      }}>
        <div style={{
          display: 'flex',
          gap: '40px',
          animation: 'scroll 30s linear infinite',
          whiteSpace: 'nowrap',
        }}>
          {[...cities, ...cities, ...cities].map((city, i) => (
            <div
              key={i}
              style={{
                fontSize: '32px',
                fontWeight: '800',
                color: i % 2 === 0 ? '#667eea' : '#764ba2',
                opacity: 0.7,
                letterSpacing: '-1px',
              }}
            >
              {city}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section with Unique Design */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1400px',
        margin: '100px auto',
        padding: '0 40px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: '900',
            marginBottom: '16px',
            letterSpacing: '-2px',
          }}>
            Simple, Transparent Pricing
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#8b92b8',
          }}>
            Choose the plan that's right for you
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '30px',
        }} className="pricing-grid">
          {[
            { 
              name: 'Free', 
              price: '$0', 
              period: 'forever',
              features: ['Basic truck locations', 'Limited search', '5 favorites', 'Community reviews'],
              cta: 'Get Started',
              popular: false
            },
            { 
              name: 'Pro', 
              price: '$9', 
              period: '/month',
              features: ['Real-time tracking', 'Unlimited search', 'Unlimited favorites', 'Priority support', 'No ads', 'Advanced filters'],
              cta: 'Start Free Trial',
              popular: true
            },
            { 
              name: 'Business', 
              price: '$29', 
              period: '/month',
              features: ['Everything in Pro', 'List your truck', 'Analytics dashboard', 'Custom branding', 'API access', 'Dedicated support'],
              cta: 'Contact Sales',
              popular: false
            },
          ].map((plan, i) => (
            <div
              key={i}
              style={{
                padding: '40px',
                borderRadius: '24px',
                background: plan.popular 
                  ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                  : 'rgba(26, 26, 46, 0.4)',
                border: plan.popular
                  ? '2px solid rgba(102, 126, 234, 0.5)'
                  : '1px solid rgba(102, 126, 234, 0.2)',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s ease',
                position: 'relative',
                transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(102, 126, 234, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = plan.popular ? 'scale(1.05)' : 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '30px',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '12px',
                  fontWeight: '700',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#8b92b8',
                marginBottom: '16px',
              }}>
                {plan.name}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                marginBottom: '8px',
              }}>
                <span style={{
                  fontSize: '56px',
                  fontWeight: '900',
                  color: '#fff',
                  letterSpacing: '-2px',
                }}>
                  {plan.price}
                </span>
                <span style={{
                  fontSize: '18px',
                  color: '#8b92b8',
                  marginLeft: '8px',
                }}>
                  {plan.period}
                </span>
              </div>

              <button style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: plan.popular 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'rgba(102, 126, 234, 0.2)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                marginTop: '24px',
                marginBottom: '32px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}>
                {plan.cta}
              </button>

              <div style={{ borderTop: '1px solid rgba(102, 126, 234, 0.2)', paddingTop: '24px' }}>
                {plan.features.map((feature, j) => (
                  <div
                    key={j}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                    }}>
                      ✓
                    </div>
                    <span style={{
                      fontSize: '15px',
                      color: '#e5e7eb',
                    }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1400px',
        margin: '100px auto 60px',
        padding: '0 40px',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '32px',
          padding: '80px 60px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.1,
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontSize: '52px',
              fontWeight: '900',
              marginBottom: '24px',
              color: '#fff',
              letterSpacing: '-2px',
            }}>
              Ready to Find Your Next
              <br />
              Favorite Food Truck?
            </h2>
            <p style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '40px',
              maxWidth: '700px',
              margin: '0 auto 40px',
            }}>
              Join 500,000+ users discovering amazing street food every single day
            </p>
            <button style={{
              padding: '20px 48px',
              borderRadius: '16px',
              border: 'none',
              background: '#fff',
              color: '#667eea',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05) translateY(-4px)';
              e.target.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1) translateY(0)';
              e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.3)';
            }}>
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 1,
        borderTop: '1px solid rgba(102, 126, 234, 0.2)',
        padding: '60px 40px 40px',
        background: 'rgba(10, 10, 15, 0.8)',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '60px',
          marginBottom: '60px',
        }} className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}>
                🚚
              </div>
              <span style={{
                fontSize: '20px',
                fontWeight: '800',
                color: '#fff',
              }}>
                TruckFinder
              </span>
            </div>
            <p style={{
              fontSize: '14px',
              color: '#8b92b8',
              lineHeight: '1.6',
            }}>
              Discover the best street food in your city with real-time tracking and authentic reviews.
            </p>
          </div>

          {[
            {
              title: 'Product',
              links: ['Features', 'Pricing', 'Download', 'Updates']
            },
            {
              title: 'Company',
              links: ['About', 'Blog', 'Careers', 'Press']
            },
            {
              title: 'Resources',
              links: ['Help Center', 'Contact', 'Privacy', 'Terms']
            },
          ].map((section, i) => (
            <div key={i}>
              <div style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '20px',
                letterSpacing: '1px',
              }}>
                {section.title}
              </div>
              {section.links.map((link, j) => (
                <a
                  key={j}
                  href="#"
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    color: '#8b92b8',
                    textDecoration: 'none',
                    marginBottom: '12px',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#667eea'}
                  onMouseLeave={(e) => e.target.style.color = '#8b92b8'}
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div style={{
          paddingTop: '40px',
          borderTop: '1px solid rgba(102, 126, 234, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }} className="footer-bottom">
          <div style={{
            fontSize: '14px',
            color: '#8b92b8',
          }}>
            © 2026 TruckFinder. All rights reserved.
          </div>
          <div style={{
            display: 'flex',
            gap: '20px',
          }}>
            {['Twitter', 'Instagram', 'Facebook'].map((social) => (
              <a
                key={social}
                href="#"
                style={{
                  fontSize: '14px',
                  color: '#8b92b8',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.style.color = '#667eea'}
                onMouseLeave={(e) => e.target.style.color = '#8b92b8'}
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <style jsx global>{`

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes buildingRise {
  0% {
    transform: translateZ(0px) translateY(100px);
    opacity: 0;
  }
  100% {
    transform: translateZ(0px) translateY(0);
    opacity: 1;
  }
}

@keyframes windowBlink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes streetDrive0 {
  0% {
    left: -50px;
    top: 250px;
  }
  100% {
    left: 650px;
    top: 250px;
  }
}

@keyframes streetDrive1 {
  0% {
    left: 650px;
    top: 320px;
    transform: scaleX(-1);
  }
  100% {
    left: -50px;
    top: 320px;
    transform: scaleX(-1);
  }
}

@keyframes streetDrive2 {
  0% {
    left: -50px;
    top: 400px;
  }
  100% {
    left: 650px;
    top: 400px;
  }
}

@keyframes streetDrive3 {
  0% {
    left: 650px;
    top: 180px;
    transform: scaleX(-1);
  }
  100% {
    left: -50px;
    top: 180px;
    transform: scaleX(-1);
  }
}


@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes wheelSpin {
  from {
    transform: translateZ(10px) rotate(0deg);
  }
  to {
    transform: translateZ(10px) rotate(360deg);
  }
}

@keyframes serveWindow {
  0%, 100% {
    transform: translateZ(30px) translateY(0);
  }
  50% {
    transform: translateZ(30px) translateY(-10px);
  }
}

@keyframes smoke {
  0% {
    transform: translateY(0) translateX(0) scale(0.5);
    opacity: 0.7;
  }
  100% {
    transform: translateY(-150px) translateX(50px) scale(1.5);
    opacity: 0;
  }
}

@keyframes floatFood {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(5deg);
  }
  66% {
    transform: translateY(10px) rotate(-5deg);
  }
}

@keyframes orbPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.6;
  }
}



        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 30px rgba(102, 126, 234, 0.6);
          }
          50% {
            box-shadow: 0 0 50px rgba(102, 126, 234, 0.9);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ping {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @media (max-width: 968px) {
          .desktop-menu {
            display: none !important;
          }

          .mobile-menu-btn {
            display: flex !important;
          }

          .hero-buttons {
            flex-direction: column !important;
          }

          .hero-buttons button {
            width: 100% !important;
            justify-content: center !important;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }

          .testimonials-grid {
            grid-template-columns: 1fr !important;
          }

          .pricing-grid {
            grid-template-columns: 1fr !important;
          }

          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }

          .footer-bottom {
            flex-direction: column !important;
            gap: 20px !important;
            text-align: center !important;
          }

          h1 {
            font-size: 48px !important;
          }

          h2 {
            font-size: 36px !important;
          }
        }
      `}</style>
    </div>
  );
}


