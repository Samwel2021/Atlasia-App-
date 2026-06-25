import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/TransporterPortal.css';

const TransporterPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [assignedShipments, setAssignedShipments] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (activeTab === 'shipments') {
      fetchAssignedShipments();
    }
  }, [activeTab]);

  const fetchAssignedShipments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/shipments/transporter/list/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssignedShipments(response.data.shipments);
    } catch (err) {
      console.error('Failed to fetch shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateShipmentStatus = async (shipmentId, status) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/shipments/${shipmentId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAssignedShipments();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const updateTracking = async (shipmentId, lat, lng, location) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/shipments/${shipmentId}/tracking`,
        { latitude: lat, longitude: lng, locationName: location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Failed to update tracking:', err);
    }
  };

  return (
    <div className="transporter-portal">
      <div className="sidebar">
        <h2>Transporter Portal</h2>
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
            Assigned Shipments
          </button>
          <button
            className={activeTab === 'tracking' ? 'active' : ''}
            onClick={() => setActiveTab('tracking')}
          >
            Active Tracking
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
            <h2>Welcome to Transporter Portal</h2>
            <p>Manage assigned shipments, update GPS tracking, and communicate with support.</p>
            <div className="quick-stats">
              <div className="stat">
                <h3>Active Shipments</h3>
                <p>{assignedShipments.filter(s => s.status === 'in_transit').length}</p>
              </div>
              <div className="stat">
                <h3>Completed</h3>
                <p>{assignedShipments.filter(s => s.status === 'delivered').length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Shipments */}
        {activeTab === 'shipments' && (
          <div className="shipments">
            <h2>Assigned Shipments</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="shipments-list">
                {assignedShipments.length === 0 ? (
                  <p>No assigned shipments</p>
                ) : (
                  assignedShipments.map((shipment) => (
                    <div key={shipment.id} className="shipment-card">
                      <div className="shipment-header">
                        <h3>{shipment.originLocation} → {shipment.destinationLocation}</h3>
                        <span className={`status ${shipment.status}`}>{shipment.status}</span>
                      </div>
                      <p>{shipment.cargoDescription}</p>
                      <div className="shipment-actions">
                        <button
                          className="btn btn-small"
                          onClick={() => updateShipmentStatus(shipment.id, 'picked_up')}
                          disabled={shipment.status !== 'pending'}
                        >
                          Mark as Picked Up
                        </button>
                        <button
                          className="btn btn-small"
                          onClick={() => updateShipmentStatus(shipment.id, 'in_transit')}
                          disabled={shipment.status === 'in_transit' || shipment.status === 'delivered'}
                        >
                          Mark In Transit
                        </button>
                        <button
                          className="btn btn-small"
                          onClick={() => updateShipmentStatus(shipment.id, 'delivered')}
                          disabled={shipment.status !== 'in_transit'}
                        >
                          Mark Delivered
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Tracking */}
        {activeTab === 'tracking' && (
          <div className="tracking">
            <h2>Active GPS Tracking</h2>
            <p>Real-time tracking interface will appear here</p>
          </div>
        )}

        {/* Chat */}
        {activeTab === 'chat' && (
          <div className="chat">
            <h2>Contact Support</h2>
            <p>Chat with admin support team</p>
          </div>
        )}

        {/* Profile */}
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

export default TransporterPortal;
