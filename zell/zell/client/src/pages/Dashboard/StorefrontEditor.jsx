import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../store/useAuth';

const StorefrontEditor = () => {
  const { token } = useAuth();
  const [storefront, setStorefront] = useState({
    name: '',
    slug: '',
    bio: '',
    themeAccent: '#C8DDD4'
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/vendors/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.storefront) {
          setStorefront({
            name: data.storefront.name || '',
            slug: data.storefront.slug || '',
            bio: data.storefront.bio || '',
            themeAccent: data.storefront.themeAccent || '#C8DDD4'
          });
        }
      })
      .catch(console.error);
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/vendors/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ storefront })
      });
      if (res.ok) {
        setMessage('✓ Storefront saved successfully.');
      } else {
        const err = await res.json();
        setMessage(`Error: ${err.message}`);
      }
    } catch (err) {
      setMessage('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h2>Storefront Customization</h2>
        <p>Manage your public profile and branding.</p>
      </div>

      <Card style={{ maxWidth: '600px' }}>
        <div className="form-group">
          <label>Store Name</label>
          <input
            className="input"
            value={storefront.name}
            onChange={e => setStorefront({ ...storefront, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Store URL Slug</label>
          <input
            className="input"
            value={storefront.slug}
            onChange={e => setStorefront({ ...storefront, slug: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea
            className="input"
            rows="4"
            value={storefront.bio}
            onChange={e => setStorefront({ ...storefront, bio: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Theme Accent Color</label>
          <input
            type="color"
            className="input"
            style={{ padding: '4px', height: '40px' }}
            value={storefront.themeAccent}
            onChange={e => setStorefront({ ...storefront, themeAccent: e.target.value })}
          />
        </div>
        {message && (
          <p style={{ fontSize: '14px', marginBottom: '12px', color: message.startsWith('✓') ? 'var(--color-accent-1)' : '#DC2626' }}>
            {message}
          </p>
        )}
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Card>
    </div>
  );
};

export default StorefrontEditor;
