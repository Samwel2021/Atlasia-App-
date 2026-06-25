import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/CustomerPortal.css';

const CustomerPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (activeTab === 'shipments') {
      fetchShipments();
    }
  }, [activeTab]);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/shipments/customer/list/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShipments(response.data.shipments);
    } catch (err) {
      console.error('Failed to fetch shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      originLocation: formData.get('origin'),
      destinationLocation: formData.get('destination'),
      cargoDescription: formData.get('description'),
      weight: formData.get('weight'),
      estimatedDelivery: formData.get('delivery')
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/shipments`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowCreateForm(false);
      fetchShipments();
    } catch (err) {
      console.error('Failed to create shipment:', err);
    }
  };

  return (
    <div className="customer-portal">
      <div className="sidebar">
        <h2>Customer Portal</h2>
        <nav>
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={activeTab === 'shipments' ? 'active' : ''}
            onClick={() => setActiveTab('shipments')}
          >
            My Shipments
          </button>
          <button
            className={activeTab === 'tracking' ? 'active' : ''}
            onClick={() => setActiveTab('tracking')}
          >
            Track Cargo
          </button>
          <button
            className={activeTab === 'chat' ? 'active' : ''}
            onClick={() => setActiveTab('chat')}
          >
            Contact Admin
          </button>
          <button
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </nav>
      </div>

      <div className="main-content">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <h2>Welcome to Customer Portal</h2>
            <p>Manage your shipments, track cargo, and communicate with our support team.</p>
          </div>
        )}

        {/* Shipments */}
        {activeTab === 'shipments' && (
          <div className="shipments">
            <div className="section-header">
              <h2>My Shipments</h2>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                {showCreateForm ? 'Cancel' : 'Create New Shipment'}
              </button>
            </div>

            {showCreateForm && (
              <form onSubmit={handleCreateShipment} className="create-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Origin Location</label>
                    <input type="text" name="origin" required />
                  </div>
                  <div className="form-group">
                    <label>Destination Location</label>
                    <input type="text" name="destination" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Cargo Description</label>
                    <input type="text" name="description" />
                  </div>
                  <div className="form-group">
                    <label>Weight (kg)</label>
                    <input type="number" name="weight" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Estimated Delivery</label>
                  <input type="date" name="delivery" required />
                </div>
                <button type="submit" className="btn btn-primary">Create Shipment</button>
              </form>
            )}

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="shipments-list">
                {shipments.length === 0 ? (
                  <p>No shipments yet</p>
                ) : (
                  shipments.map((shipment) => (
                    <div key={shipment.id} className="shipment-card">
                      <div className="shipment-header">
                        <h3>{shipment.originLocation} → {shipment.destinationLocation}</h3>
                        <span className={`status ${shipment.status}`}>{shipment.status}</span>
                      </div>
                      <p>{shipment.cargoDescription}</p>
                      <p className="shipment-meta">Weight: {shipment.weight}kg | Est. Delivery: {shipment.estimatedDelivery}</p>
                      <button className="btn btn-small">View Details</button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Other tabs can be added similarly */}
        {activeTab === 'tracking' && (
          <div className="tracking">
            <h2>Track Your Cargo</h2>
            <p>Real-time GPS tracking will appear here</p>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="chat">
            <h2>Contact Support</h2>
            <p>Chat with admin support team</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile">
            <h2>My Profile</h2>
            <p>Profile management interface</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerPortal;
