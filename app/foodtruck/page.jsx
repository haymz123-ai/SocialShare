
'use client';

import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Search, MapPin, Phone, Globe, Star, Clock, Loader2, X, Database } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

export default function FoodTruckFinder() {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [foodTrucks, setFoodTrucks] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [error, setError] = useState('');
  const [showingDatabaseTrucks, setShowingDatabaseTrucks] = useState(0);
  
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    if (map.current) return;
    
    mapboxgl.accessToken = 'pk.eyJ1Ijoic291cmF2dyIsImEiOiJjbHozaXdzOTkydXJkMmxzbHA1bnp0bWs1In0.LGUGYHSMfNEeSsk2p94ftw'

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-74.006, 40.7128],
      zoom: 12,
      pitch: 45,
      bearing: 0,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      placeholder: 'Search location...',
    });

    map.current.addControl(geocoder, 'top-left');

    geocoder.on('result', (e) => {
      setLocation(e.result.place_name);
      const [lng, lat] = e.result.center;
      searchFoodTrucks(lat, lng, e.result.place_name);
    });

  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const searchFoodTrucks = async (lat, lng, locationName) => {
    setLoading(true);
    setError('');
    setSelectedTruck(null);
    
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    try {
      // Search radius in kilometers
      const searchRadiusKm = 50;

      // Fetch from Google Maps API
      const googleResponse = await fetch('/api/search-food-trucks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, location: locationName }),
      });

      const googleData = await googleResponse.json();
      
      if (!googleResponse.ok && googleResponse.status !== 404) {
        console.warn('Google search error:', googleData.error);
      }

      // Fetch from Supabase
      const supabaseResponse = await fetch('/api/get-all-trucks');
      const supabaseData = await supabaseResponse.json();

      if (!supabaseResponse.ok) {
        console.warn('Supabase fetch error:', supabaseData.error);
      }

      // Process Google results
      const googleTrucks = (googleData.trucks || []).map(truck => ({
        ...truck,
        source: 'google',
        distance: truck.position ? calculateDistance(lat, lng, truck.position.lat, truck.position.lng) : null,
      }));

      // Process Supabase results and filter by distance
      const supabaseTrucks = (supabaseData.trucks || [])
        .filter(truck => truck.latitude && truck.longitude)
        .map(truck => {
          const distance = calculateDistance(lat, lng, truck.latitude, truck.longitude);
          return {
            name: truck.name,
            address: truck.address,
            phone: truck.phone,
            rating: null,
            reviews: null,
            type: truck.cuisine_type,
            hours: truck.opening_time && truck.closing_time 
              ? `${truck.opening_time} - ${truck.closing_time}`
              : null,
            description: truck.description,
            position: {
              lat: truck.latitude,
              lng: truck.longitude,
            },
            source: 'database',
            distance: distance,
            image_url: truck.image_url,
            average_price: truck.average_price,
          };
        })
        .filter(truck => truck.distance <= searchRadiusKm);

      // Combine and sort by distance
      const allTrucks = [...googleTrucks, ...supabaseTrucks]
        .filter(truck => truck.position && truck.distance !== null)
        .sort((a, b) => a.distance - b.distance);

      setShowingDatabaseTrucks(supabaseTrucks.length);
      setFoodTrucks(allTrucks);
      
      if (allTrucks.length > 0) {
        addMarkersToMap(allTrucks);
        
        const bounds = new mapboxgl.LngLatBounds();
        allTrucks.forEach(truck => {
          if (truck.position) {
            bounds.extend([truck.position.lng, truck.position.lat]);
          }
        });
        
        map.current.fitBounds(bounds, {
          padding: { top: 100, bottom: 100, left: 400, right: 100 },
          maxZoom: 14,
        });
      } else {
        setError('No food trucks found in this area. Try a different location or wider radius.');
      }
      
    } catch (err) {
      setError(err.message || 'Failed to search food trucks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addMarkersToMap = (trucks) => {
    trucks.forEach((truck) => {
      if (!truck.position) return;

      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      
      // Different colors for different sources
      const gradientColor = truck.source === 'database' 
        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      
      const shadowColor = truck.source === 'database'
        ? 'rgba(16, 185, 129, 0.4)'
        : 'rgba(102, 126, 234, 0.4)';

      el.innerHTML = `
        <div class="marker-inner" style="
          background: ${gradientColor};
          width: 40px;
          height: 40px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid #1a1a2e;
          box-shadow: 0 4px 12px ${shadowColor};
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          pointer-events: none;
        ">
          <span style="
            transform: rotate(45deg);
            font-size: 18px;
            pointer-events: none;
          ">${truck.source === 'database' ? '🍔' : '🚚'}</span>
        </div>
      `;

      el.addEventListener('mouseenter', () => {
        const inner = el.querySelector('.marker-inner');
        if (inner) {
          inner.style.transform = 'rotate(-45deg) scale(1.2)';
          inner.style.boxShadow = `0 6px 16px ${shadowColor.replace('0.4', '0.6')}`;
        }
      });
      
      el.addEventListener('mouseleave', () => {
        const inner = el.querySelector('.marker-inner');
        if (inner) {
          inner.style.transform = 'rotate(-45deg) scale(1)';
          inner.style.boxShadow = `0 4px 12px ${shadowColor}`;
        }
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([truck.position.lng, truck.position.lat])
        .addTo(map.current);

      el.addEventListener('click', () => {
        setSelectedTruck(truck);
        map.current.flyTo({
          center: [truck.position.lng, truck.position.lat],
          zoom: 15,
          essential: true
        });
      });

      markers.current.push(marker);
    });
  };

  const handleManualSearch = async (e) => {
    e.preventDefault();
    if (!location.trim()) return;

    setLoading(true);
    setError('');

    try {
      const geocodeResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${mapboxgl.accessToken}`
      );
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.features && geocodeData.features.length > 0) {
        const [lng, lat] = geocodeData.features[0].center;
        
        map.current.flyTo({
          center: [lng, lat],
          zoom: 12,
          essential: true
        });

        await searchFoodTrucks(lat, lng, location);
      } else {
        setError('Location not found. Please try a different search.');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to geocode location');
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        background: 'rgba(15, 12, 41, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
        padding: '20px 30px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Back Button */}
            <button
              onClick={() => window.history.back()}
              style={{
                background: 'rgba(26, 26, 46, 0.8)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '10px',
                padding: '10px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                color: '#8b92b8',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                e.target.style.borderColor = '#667eea';
                e.target.style.color = '#a5b4fc';
                e.target.style.transform = 'translateX(-3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(26, 26, 46, 0.8)';
                e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                e.target.style.color = '#8b92b8';
                e.target.style.transform = 'translateX(0)';
              }}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              width: '50px',
              height: '50px',
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
              <h1 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}>
                Food Truck Finder
              </h1>
              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#8b92b8',
                marginTop: '2px',
              }}>
                Discover the best food trucks near you
              </p>
            </div>
          </div>

          <form onSubmit={handleManualSearch} style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#667eea',
                width: '20px',
                height: '20px',
              }} />
              <input
                type="text"
                placeholder="Enter location (e.g., New York, NY)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  width: '350px',
                  padding: '12px 15px 12px 45px',
                  borderRadius: '12px',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  background: 'rgba(26, 26, 46, 0.8)',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                background: loading 
                  ? 'rgba(102, 126, 234, 0.5)' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
              }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                  Searching...
                </>
              ) : (
                <>
                  <Search style={{ width: '18px', height: '18px' }} />
                  Search
                </>
              )}
            </button>
          </form>
        </div>

        {error && (
          <div style={{
            marginTop: '15px',
            padding: '12px 16px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#fca5a5',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div ref={mapContainer} style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }} />

      {/* Results Sidebar */}
      {foodTrucks.length > 0 && (
        <div style={{
          position: 'absolute',
          left: '20px',
          top: '140px',
          bottom: '20px',
          width: '350px',
          background: 'rgba(15, 12, 41, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 5,
        }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
            background: 'rgba(102, 126, 234, 0.05)',
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
              color: '#fff',
            }}>
              Found {foodTrucks.length} Food Trucks
            </h3>
            <p style={{
              margin: '5px 0 0 0',
              fontSize: '13px',
              color: '#8b92b8',
            }}>
              {showingDatabaseTrucks > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <Database size={14} style={{ color: '#10b981' }} />
                  {showingDatabaseTrucks} from database
                </span>
              )}
            </p>
          </div>
          
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px',
          }}>
            {foodTrucks.map((truck, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedTruck(truck);
                  if (truck.position) {
                    map.current.flyTo({
                      center: [truck.position.lng, truck.position.lat],
                      zoom: 15,
                      essential: true
                    });
                  }
                }}
                style={{
                  padding: '16px',
                  marginBottom: '10px',
                  borderRadius: '12px',
                  background: selectedTruck?.name === truck.name 
                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                    : 'rgba(26, 26, 46, 0.6)',
                  border: selectedTruck?.name === truck.name
                    ? '1px solid rgba(102, 126, 234, 0.5)'
                    : truck.source === 'database'
                    ? '1px solid rgba(16, 185, 129, 0.2)'
                    : '1px solid rgba(102, 126, 234, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (selectedTruck?.name !== truck.name) {
                    e.currentTarget.style.background = 'rgba(26, 26, 46, 0.9)';
                    e.currentTarget.style.borderColor = truck.source === 'database' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(102, 126, 234, 0.3)';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedTruck?.name !== truck.name) {
                    e.currentTarget.style.background = 'rgba(26, 26, 46, 0.6)';
                    e.currentTarget.style.borderColor = truck.source === 'database' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(102, 126, 234, 0.1)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#fff',
                    flex: 1,
                  }}>
                    {truck.name}
                  </h4>
                  {truck.rating && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(251, 191, 36, 0.1)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      marginLeft: '8px',
                    }}>
                      <Star style={{ width: '14px', height: '14px', fill: '#fbbf24', color: '#fbbf24' }} />
                      <span style={{ fontSize: '13px', color: '#fbbf24', fontWeight: '600' }}>
                        {truck.rating}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  {truck.source === 'database' && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      fontSize: '11px',
                      color: '#10b981',
                      fontWeight: '600',
                    }}>
                      <Database size={12} />
                      Your Truck
                    </div>
                  )}
                  
                  {truck.type && (
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      fontSize: '12px',
                      color: '#a5b4fc',
                    }}>
                      {truck.type}
                    </div>
                  )}

                  {truck.distance && (
                    <div style={{
                      fontSize: '12px',
                      color: '#8b92b8',
                    }}>
                      {truck.distance.toFixed(1)} km away
                    </div>
                  )}
                </div>
                
                {truck.address && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    marginTop: '8px',
                  }}>
                    <MapPin style={{ width: '14px', height: '14px', color: '#8b92b8', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: '#8b92b8', lineHeight: '1.4' }}>
                      {truck.address}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Panel */}
      {selectedTruck && (
        <div style={{
          position: 'absolute',
          right: '20px',
          top: '140px',
          width: '400px',
          maxHeight: 'calc(100vh - 160px)',
          background: 'rgba(15, 12, 41, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden',
          zIndex: 5,
        }}>
          <div style={{
            padding: '24px',
            borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            position: 'relative',
          }}>
            <button
              onClick={() => setSelectedTruck(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(26, 26, 46, 0.8)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                e.target.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(26, 26, 46, 0.8)';
                e.target.style.transform = 'rotate(0deg)';
              }}
            >
              <X style={{ width: '20px', height: '20px', color: '#8b92b8' }} />
            </button>

            <h2 style={{
              margin: '0 40px 12px 0',
              fontSize: '24px',
              fontWeight: '700',
              color: '#fff',
              lineHeight: '1.3',
            }}>
              {selectedTruck.name}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {selectedTruck.source === 'database' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
}}>
<Database style={{ width: '16px', height: '16px', color: '#10b981' }} />
<span style={{ fontSize: '13px', color: '#10b981', fontWeight: '600' }}>
Your Truck
</span>
</div>
)}
{selectedTruck.rating && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(251, 191, 36, 0.15)',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(251, 191, 36, 0.3)',
            }}>
              <Star style={{ width: '16px', height: '16px', fill: '#fbbf24', color: '#fbbf24' }} />
              <span style={{ fontSize: '14px', color: '#fbbf24', fontWeight: '600' }}>
                {selectedTruck.rating}
              </span>
              {selectedTruck.reviews && (
                <span style={{ fontSize: '13px', color: '#8b92b8' }}>
                  ({selectedTruck.reviews} reviews)
                </span>
              )}
            </div>
          )}

          {selectedTruck.type && (
            <div style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(102, 126, 234, 0.15)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              fontSize: '13px',
              color: '#a5b4fc',
              fontWeight: '500',
            }}>
              {selectedTruck.type}
            </div>
          )}

          {selectedTruck.distance && (
            <div style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(139, 146, 184, 0.1)',
              border: '1px solid rgba(139, 146, 184, 0.3)',
              fontSize: '13px',
              color: '#8b92b8',
              fontWeight: '500',
            }}>
              {selectedTruck.distance.toFixed(1)} km away
            </div>
          )}
        </div>
      </div>

      <div style={{
        padding: '24px',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 340px)',
      }}>
        {/* Address */}
        {selectedTruck.address && (
          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(26, 26, 46, 0.6)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            marginBottom: '12px',
          }}>
            <MapPin style={{ width: '20px', height: '20px', color: '#667eea', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '12px', color: '#8b92b8', marginBottom: '4px', fontWeight: '500' }}>
                ADDRESS
              </div>
              <div style={{ fontSize: '14px', color: '#fff', lineHeight: '1.5' }}>
                {selectedTruck.address}
              </div>
            </div>
          </div>
        )}

        {/* Phone */}
        {selectedTruck.phone && (
          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(26, 26, 46, 0.6)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            marginBottom: '12px',
          }}>
            <Phone style={{ width: '20px', height: '20px', color: '#667eea', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '12px', color: '#8b92b8', marginBottom: '4px', fontWeight: '500' }}>
                PHONE
              </div>
              <a href={`tel:${selectedTruck.phone}`} style={{
                fontSize: '14px',
                color: '#a5b4fc',
                textDecoration: 'none',
                display: 'block',
              }}>
                {selectedTruck.phone}
              </a>
            </div>
          </div>
        )}

        {/* Website */}
        {selectedTruck.website && (
          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(26, 26, 46, 0.6)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            marginBottom: '12px',
          }}>
            <Globe style={{ width: '20px', height: '20px', color: '#667eea', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', color: '#8b92b8', marginBottom: '4px', fontWeight: '500' }}>
                WEBSITE
              </div>
              <a 
                href={selectedTruck.website} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  fontSize: '14px',
                  color: '#a5b4fc',
                  textDecoration: 'none',
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {selectedTruck.website}
              </a>
            </div>
          </div>
        )}

        {/* Hours */}
        {selectedTruck.hours && (
          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(26, 26, 46, 0.6)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            marginBottom: '12px',
          }}>
            <Clock style={{ width: '20px', height: '20px', color: '#667eea', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '12px', color: '#8b92b8', marginBottom: '4px', fontWeight: '500' }}>
                HOURS
              </div>
              <div style={{ fontSize: '14px', color: '#fff', lineHeight: '1.5' }}>
                {selectedTruck.hours}
              </div>
            </div>
          </div>
        )}

        {/* Average Price (Database trucks only) */}
        {selectedTruck.average_price && (
          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(26, 26, 46, 0.6)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            marginBottom: '12px',
          }}>
            <span style={{ fontSize: '20px' }}>💰</span>
            <div>
              <div style={{ fontSize: '12px', color: '#8b92b8', marginBottom: '4px', fontWeight: '500' }}>
                AVERAGE PRICE
              </div>
              <div style={{ fontSize: '14px', color: '#fff', lineHeight: '1.5' }}>
                {selectedTruck.average_price}
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        {selectedTruck.description && (
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(26, 26, 46, 0.6)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            marginBottom: '12px',
          }}>
            <div style={{ fontSize: '12px', color: '#8b92b8', marginBottom: '8px', fontWeight: '500' }}>
              ABOUT
            </div>
            <div style={{ fontSize: '14px', color: '#e5e7eb', lineHeight: '1.6' }}>
              {selectedTruck.description}
            </div>
          </div>
        )}

        {/* Service Options */}
        {selectedTruck.service_options && Object.keys(selectedTruck.service_options).length > 0 && (
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(26, 26, 46, 0.6)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
          }}>
            <div style={{ fontSize: '12px', color: '#8b92b8', marginBottom: '12px', fontWeight: '500' }}>
              SERVICE OPTIONS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {Object.entries(selectedTruck.service_options).map(([key, value]) => (
                value && (
                  <div
                    key={key}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'rgba(102, 126, 234, 0.15)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      fontSize: '12px',
                      color: '#a5b4fc',
                    }}
                  >
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )}

  {/* Loading Overlay */}
  {loading && (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
      background: 'rgba(15, 12, 41, 0.95)',
      backdropFilter: 'blur(20px)',
      padding: '32px 48px',
      borderRadius: '16px',
      border: '1px solid rgba(102, 126, 234, 0.3)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
    }}>
      <Loader2 style={{
        width: '48px',
        height: '48px',
        color: '#667eea',
        animation: 'spin 1s linear infinite',
      }} />
      <div style={{
        fontSize: '16px',
        color: '#fff',
        fontWeight: '600',
      }}>
        Searching for food trucks...
      </div>
      <div style={{
        fontSize: '13px',
        color: '#8b92b8',
      }}>
        Checking Google Maps & database
      </div>
    </div>
  )}

  <style jsx global>{`
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(26, 26, 46, 0.4);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb {
      background: rgba(102, 126, 234, 0.4);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: rgba(102, 126, 234, 0.6);
    }

    .mapboxgl-ctrl-geocoder {
      display: none !important;
    }
  `}</style>
</div>
  )}
  