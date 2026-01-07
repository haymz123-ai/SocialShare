'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { MapPin, Clock, Phone, Edit, Trash2, DollarSign, Utensils, Save, X, Plus, ChevronDown, ChevronUp } from 'lucide-react';

export default function MyTrucksPage() {
  const { user } = useUser();
  const router = useRouter();
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTruckId, setEditingTruckId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editDishes, setEditDishes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [expandedTruckId, setExpandedTruckId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchTrucks();
    }
  }, [user]);

  const fetchTrucks = async () => {
    try {
      const response = await fetch(`/api/my-trucks?userId=${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setTrucks(data.trucks || []);
      }
    } catch (error) {
      console.error('Error fetching trucks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (truckId) => {
    if (!confirm('Are you sure you want to delete this food truck?')) {
      return;
    }

    try {
      const response = await fetch(`/api/delete?id=${truckId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Food truck deleted successfully!');
        fetchTrucks();
      } else {
        alert('Failed to delete food truck');
      }
    } catch (error) {
      console.error('Error deleting truck:', error);
      alert('An error occurred while deleting the truck');
    }
  };

  const startEditing = (truck) => {
    setEditingTruckId(truck.id);
    setEditFormData({
      name: truck.name,
      description: truck.description || '',
      latitude: truck.latitude,
      longitude: truck.longitude,
      address: truck.address,
      phone: truck.phone,
      opening_time: truck.opening_time,
      closing_time: truck.closing_time,
      image_url: truck.image_url || '',
      cuisine_type: truck.cuisine_type,
      average_price: truck.average_price || '',
    });
    setEditDishes(truck.dishes && truck.dishes.length > 0 ? truck.dishes : [{ name: '', price: '' }]);
    setExpandedTruckId(truck.id);
  };

  const cancelEditing = () => {
    setEditingTruckId(null);
    setEditFormData({});
    setEditDishes([]);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditDishChange = (index, field, value) => {
    const newDishes = [...editDishes];
    newDishes[index][field] = value;
    setEditDishes(newDishes);
  };

  const addEditDish = () => {
    setEditDishes([...editDishes, { name: '', price: '' }]);
  };

  const removeEditDish = (index) => {
    if (editDishes.length > 1) {
      setEditDishes(editDishes.filter((_, i) => i !== index));
    }
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const filteredDishes = editDishes.filter(dish => dish.name && dish.price);
      
      const response = await fetch('/api/trucks/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingTruckId,
          ...editFormData,
          dishes: filteredDishes,
        }),
      });

      if (response.ok) {
        alert('Food truck updated successfully!');
        setEditingTruckId(null);
        setEditFormData({});
        setEditDishes([]);
        fetchTrucks();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update food truck');
      }
    } catch (error) {
      console.error('Error updating truck:', error);
      alert('An error occurred while updating the truck');
    } finally {
      setSaving(false);
    }
  };

  const toggleExpand = (truckId) => {
    if (editingTruckId === truckId) return;
    setExpandedTruckId(expandedTruckId === truckId ? null : truckId);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(102, 126, 234, 0.3)',
          borderTopColor: '#667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        background: 'rgba(15, 12, 41, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(102, 126, 234, 0.2)',
        padding: '40px',
        marginBottom: '32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}>
              🚚
            </div>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '32px',
                fontWeight: '700',
                color: '#fff',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                My Food Trucks
              </h1>
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '14px',
                color: '#8b92b8',
              }}>
                Manage and edit your food truck listings
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push('/add-truck')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <Utensils size={18} />
            Add New Truck
          </button>
        </div>
      </div>

      {trucks.length === 0 ? (
        <div style={{
          background: 'rgba(15, 12, 41, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          padding: '60px 40px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '20px',
          }}>
            🚚
          </div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#fff',
            marginBottom: '12px',
          }}>
            No Food Trucks Yet
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#8b92b8',
            marginBottom: '24px',
          }}>
            Start by adding your first food truck to get noticed by customers!
          </p>
          <button
            onClick={() => router.push('/add-truck')}
            style={{
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Add Your First Truck
          </button>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
          {trucks.map((truck) => {
            const isEditing = editingTruckId === truck.id;
            const isExpanded = expandedTruckId === truck.id;

            return (
              <div
                key={truck.id}
                style={{
                  background: 'rgba(15, 12, 41, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: isEditing ? '2px solid #667eea' : '1px solid rgba(102, 126, 234, 0.2)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: isEditing ? '0 8px 30px rgba(102, 126, 234, 0.4)' : '0 4px 20px rgba(0, 0, 0, 0.2)',
                }}
              >
                {/* Header Section */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  padding: '24px',
                  background: isEditing ? 'rgba(102, 126, 234, 0.05)' : 'transparent',
                }}>
                  <div style={{ flex: 1 }}>
                    {isEditing ? (
                      <div style={{ marginBottom: '16px' }}>
                        <input
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditInputChange}
                          placeholder="Truck Name"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'rgba(26, 26, 46, 0.6)',
                            border: '1px solid rgba(102, 126, 234, 0.3)',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '20px',
                            fontWeight: '700',
                            outline: 'none',
                          }}
                        />
                      </div>
                    ) : (
                      <h3 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#fff',
                        margin: '0 0 12px 0',
                      }}>
                        {truck.name}
                      </h3>
                    )}

                    {isEditing ? (
                      <input
                        type="text"
                        name="cuisine_type"
                        value={editFormData.cuisine_type}
                        onChange={handleEditInputChange}
                        placeholder="Cuisine Type"
                        style={{
                          padding: '8px 14px',
                          background: 'rgba(102, 126, 234, 0.2)',
                          border: '1px solid rgba(102, 126, 234, 0.3)',
                          borderRadius: '8px',
                          color: '#a5b4fc',
                          fontSize: '13px',
                          fontWeight: '600',
                          outline: 'none',
                        }}
                      />
                    ) : (
                      <div style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        background: 'rgba(102, 126, 234, 0.2)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#a5b4fc',
                      }}>
                        {truck.cuisine_type}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                    {isEditing ? (
                      <>
                        <button
                          onClick={saveChanges}
                          disabled={saving}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 18px',
                            background: saving ? 'rgba(102, 126, 234, 0.5)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            borderRadius: '10px',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <Save size={16} />
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={saving}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 18px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '10px',
                            color: '#fca5a5',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(truck)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 18px',
                            background: 'rgba(102, 126, 234, 0.2)',
                            border: '1px solid rgba(102, 126, 234, 0.3)',
                            borderRadius: '10px',
                            color: '#667eea',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(102, 126, 234, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                          }}
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(truck.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 18px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '10px',
                            color: '#fca5a5',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                          }}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div style={{ padding: '0 24px 24px 24px' }}>
                  {/* Description */}
                  {isEditing ? (
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#8b92b8',
                        marginBottom: '8px',
                      }}>
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditInputChange}
                        rows={3}
                        placeholder="Describe your food truck..."
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(26, 26, 46, 0.6)',
                          border: '1px solid rgba(102, 126, 234, 0.2)',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '14px',
                          outline: 'none',
                          resize: 'vertical',
                        }}
                      />
                    </div>
                  ) : (
                    truck.description && (
                      <p style={{
                        fontSize: '14px',
                        color: '#8b92b8',
                        lineHeight: '1.6',
                        marginBottom: '20px',
                      }}>
                        {truck.description}
                      </p>
                    )
                  )}

                  {/* Quick Info Grid */}
                  {isEditing ? (
                    <div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '16px',
                        marginBottom: '20px',
                      }}>
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#8b92b8',
                            marginBottom: '6px',
                          }}>
                            <MapPin size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                            Address
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={editFormData.address}
                            onChange={handleEditInputChange}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              background: 'rgba(26, 26, 46, 0.6)',
                              border: '1px solid rgba(102, 126, 234, 0.2)',
                              borderRadius: '10px',
                              color: '#fff',
                              fontSize: '13px',
                              outline: 'none',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#8b92b8',
                            marginBottom: '6px',
                          }}>
                            <Phone size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                            Phone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={editFormData.phone}
                            onChange={handleEditInputChange}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              background: 'rgba(26, 26, 46, 0.6)',
                              border: '1px solid rgba(102, 126, 234, 0.2)',
                              borderRadius: '10px',
                              color: '#fff',
                              fontSize: '13px',
                              outline: 'none',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#8b92b8',
                            marginBottom: '6px',
                          }}>
                            <DollarSign size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                            Average Price
                          </label>
                          <input
                            type="text"
                            name="average_price"
                            value={editFormData.average_price}
                            onChange={handleEditInputChange}
                            placeholder="e.g., $10-$20"
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              background: 'rgba(26, 26, 46, 0.6)',
                              border: '1px solid rgba(102, 126, 234, 0.2)',
                              borderRadius: '10px',
                              color: '#fff',
                              fontSize: '13px',
                              outline: 'none',
                            }}
                          />
                        </div>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr 1fr',
                        gap: '16px',
                        marginBottom: '20px',
                      }}>
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#8b92b8',
                            marginBottom: '6px',
                          }}>
                            Latitude
                          </label>
                          <input
                            type="number"
                            step="any"
                            name="latitude"
                            value={editFormData.latitude}
                            onChange={handleEditInputChange}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              background: 'rgba(26, 26, 46, 0.6)',
                              border: '1px solid rgba(102, 126, 234, 0.2)',
                              borderRadius: '10px',
                              color: '#fff',
                              fontSize: '13px',
                              outline: 'none',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#8b92b8',
                            marginBottom: '6px',
                          }}>
                            Longitude
                          </label>
                          <input
                            type="number"
                            step="any"
                            name="longitude"
                            value={editFormData.longitude}
                            onChange={handleEditInputChange}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              background: 'rgba(26, 26, 46, 0.6)',
                              border: '1px solid rgba(102, 126, 234, 0.2)',
                              borderRadius: '10px',
                              color: '#fff',
                              fontSize: '13px',
                              outline: 'none',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#8b92b8',
                            marginBottom: '6px',
                          }}>
                            <Clock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                            Opening Time
                          </label>
                          <input
                            type="time"
                            name="opening_time"
                            value={editFormData.opening_time}
                            onChange={handleEditInputChange}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              background: 'rgba(26, 26, 46, 0.6)',
                              border: '1px solid rgba(102, 126, 234, 0.2)',
                              borderRadius: '10px',
                              color: '#fff',
                              fontSize: '13px',
                              outline: 'none',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#8b92b8',
                            marginBottom: '6px',
                          }}>
                            <Clock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                            Closing Time
                          </label>
                          <input
                            type="time"
                            name="closing_time"
                            value={editFormData.closing_time}
                            onChange={handleEditInputChange}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              background: 'rgba(26, 26, 46, 0.6)',
                              border: '1px solid rgba(102, 126, 234, 0.2)',
                              borderRadius: '10px',
                              color: '#fff',
                              fontSize: '13px',
                              outline: 'none',
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <label style={{
                          display: 'block',
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#8b92b8',
                          marginBottom: '6px',
                        }}>
                          Image URL
                        </label>
                        <input
                          type="url"
                          name="image_url"
                          value={editFormData.image_url}
                          onChange={handleEditInputChange}
                          placeholder="https://example.com/image.jpg"
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: 'rgba(26, 26, 46, 0.6)',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            borderRadius: '10px',
                            color: '#fff',
                            fontSize: '13px',
                            outline: 'none',
                          }}
                        />
                      </div>

                      {/* Menu Items Edit */}
                      <div style={{
                        padding: '20px',
                        background: 'rgba(26, 26, 46, 0.4)',
                        borderRadius: '12px',
                        border: '1px solid rgba(102, 126, 234, 0.1)',
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '16px',
                        }}>
                          <h4 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#fff',
                            margin: 0,
                          }}>
                            Menu Items
                          </h4>
                          <button
                            type="button"
                            onClick={addEditDish}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 14px',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              border: 'none',
                              borderRadius: '8px',
                              color: '#fff',
                              fontSize: '13px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <Plus size={14} />
                            Add Dish
                          </button>
                        </div>

                        {editDishes.map((dish, index) => (
                          <div
                            key={index}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '2fr 1fr auto',
                              gap: '10px',
                              marginBottom: '10px',
                              padding: '12px',
                              background: 'rgba(15, 12, 41, 0.6)',
                              borderRadius: '10px',
                            }}
                          >
                            <input
                              type="text"
                              placeholder="Dish name"
                              value={dish.name}
                              onChange={(e) => handleEditDishChange(index, 'name', e.target.value)}
                              style={{
                                padding: '10px 12px',
                                background: 'rgba(26, 26, 46, 0.8)',
                                border: '1px solid rgba(102, 126,234, 0.2)',
borderRadius: '8px',
color: '#fff',
fontSize: '13px',
outline: 'none',
}}
/>
<input
type="text"
placeholder="Price"
value={dish.price}
onChange={(e) => handleEditDishChange(index, 'price', e.target.value)}
style={{
padding: '10px 12px',
background: 'rgba(26, 26, 46, 0.8)',
border: '1px solid rgba(102, 126, 234, 0.2)',
borderRadius: '8px',
color: '#fff',
fontSize: '13px',
outline: 'none',
}}
/>
<button
type="button"
onClick={() => removeEditDish(index)}
disabled={editDishes.length === 1}
style={{
padding: '10px',
background: editDishes.length === 1 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.2)',
border: '1px solid rgba(239, 68, 68, 0.3)',
borderRadius: '8px',
color: editDishes.length === 1 ? '#666' : '#fca5a5',
cursor: editDishes.length === 1 ? 'not-allowed' : 'pointer',
transition: 'all 0.3s ease',
}}
>
<Trash2 size={16} />
</button>
</div>
))}
</div>
</div>
) : (
<div>
{/* Collapsed View - Basic Info */}
<div style={{
display: 'grid',
gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
gap: '12px',
padding: '16px',
background: 'rgba(26, 26, 46, 0.4)',
borderRadius: '12px',
border: '1px solid rgba(102, 126, 234, 0.1)',
marginBottom: '16px',
}}>
<div style={{
display: 'flex',
alignItems: 'center',
gap: '10px',
}}>
<MapPin size={16} style={{ color: '#667eea', flexShrink: 0 }} />
<div>
<div style={{ fontSize: '11px', color: '#667eea', marginBottom: '2px' }}>Location</div>
<span style={{ fontSize: '13px', color: '#8b92b8' }}>{truck.address}</span>
</div>
</div>
<div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}>
                      <Clock size={16} style={{ color: '#667eea', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '11px', color: '#667eea', marginBottom: '2px' }}>Hours</div>
                        <span style={{ fontSize: '13px', color: '#8b92b8' }}>
                          {truck.opening_time} - {truck.closing_time}
                        </span>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}>
                      <Phone size={16} style={{ color: '#667eea', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '11px', color: '#667eea', marginBottom: '2px' }}>Contact</div>
                        <span style={{ fontSize: '13px', color: '#8b92b8' }}>{truck.phone}</span>
                      </div>
                    </div>

                    {truck.average_price && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}>
                        <DollarSign size={16} style={{ color: '#667eea', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '11px', color: '#667eea', marginBottom: '2px' }}>Price Range</div>
                          <span style={{ fontSize: '13px', color: '#8b92b8' }}>{truck.average_price}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expandable Menu Section */}
                  {truck.dishes && truck.dishes.length > 0 && (
                    <div>
                      <button
                        onClick={() => toggleExpand(truck.id)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 16px',
                          background: 'rgba(26, 26, 46, 0.4)',
                          border: '1px solid rgba(102, 126, 234, 0.2)',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          marginBottom: isExpanded ? '12px' : '0',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(26, 26, 46, 0.6)';
                          e.target.style.borderColor = 'rgba(102, 126, 234, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(26, 26, 46, 0.4)';
                          e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                        }}
                      >
                        <span>
                          Menu Items ({truck.dishes.length})
                        </span>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>

                      {isExpanded && (
                        <div style={{
                          padding: '16px',
                          background: 'rgba(26, 26, 46, 0.4)',
                          borderRadius: '12px',
                          border: '1px solid rgba(102, 126, 234, 0.1)',
                        }}>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '10px',
                          }}>
                            {truck.dishes.map((dish, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '12px 14px',
                                  background: 'rgba(15, 12, 41, 0.6)',
                                  borderRadius: '10px',
                                  border: '1px solid rgba(102, 126, 234, 0.1)',
                                }}
                              >
                                <span style={{
                                  fontSize: '13px',
                                  color: '#8b92b8',
                                  fontWeight: '500',
                                }}>
                                  {dish.name}
                                </span>
                                <span style={{
                                  fontSize: '14px',
                                  fontWeight: '700',
                                  color: '#667eea',
                                }}>
                                  {dish.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  )}

  <style jsx global>{`
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `}</style>
</div>
  )}