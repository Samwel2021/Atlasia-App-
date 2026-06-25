import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/AdminPortal.css';

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allShipments, setAllShipments] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    } else if (activeTab === 'approvals') {
      fetchPendingApprovals();
    } else if (activeTab === 'shipments') {
      fetchAllShipments();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/dashboard/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(response.data.stats);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingApprovals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/approvals/pending`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingUsers(response.data.users);
    } catch (err) {
      console.error('Failed to fetch approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllShipments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/shipments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllShipments(response.data.shipments);
    } catch (err) {
      console.error('Failed to fetch shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId, approved = true) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/approvals/${userId}`,
        { approved },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPendingApprovals();
    } catch (err) {
      console.error('Failed to approve user:', err);
    }
  };

  return (
    <div className="admin-portal">
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={activeTab === 'approvals' ? 'active' : ''}
            onClick={() => setActiveTab('approvals')}
          >
            Approvals
          </button>
          <button
            className={activeTab === 'shipments' ? 'active' : ''}
            onClick={() => setActiveTab('shipments')}
          >
            Shipments
          </button>
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={activeTab === 'chat' ? 'active' : ''}
            onClick={() => setActiveTab('chat')}
          >
            Support Chat
          </button>
        </nav>
      </div>

      <div className="main-content">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="dashboard">
            <h2>Dashboard</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">{stats.users.total}</p>
                <small>Pending: {stats.users.pending}</small>
              </div>
              <div className="stat-card">
                <h3>Total Shipments</h3>
                <p className="stat-number">{stats.shipments.total}</p>
                <small>In Transit: {stats.shipments.inTransit}</small>
              </div>
              <div className="stat-card">
                <h3>Delivered</h3>
                <p className="stat-number">{stats.shipments.delivered}</p>
              </div>
              <div className="stat-card">
                <h3>Portal Distribution</h3>
                <p>Admins: {stats.portalDistribution.admins}</p>
                <p>Customers: {stats.portalDistribution.customers}</p>
                <p>Transporters: {stats.portalDistribution.transporters}</p>
              </div>
            </div>
          </div>
        )}

        {/* Approvals Tab */}
        {activeTab === 'approvals' && (
          <div className="approvals">
            <h2>Pending Approvals</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="user-list">
                {pendingUsers.length === 0 ? (
                  <p>No pending approvals</p>
                ) : (
                  pendingUsers.map((user) => (
                    <div key={user.id} className="user-item">
                      <div className="user-info">
                        <p><strong>{user.email}</strong></p>
                        <p>{user.portalType}</p>
                      </div>
                      <div className="user-actions">
                        <button
                          className="btn btn-approve"
                          onClick={() => approveUser(user.id, true)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-reject"
                          onClick={() => approveUser(user.id, false)}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Shipments Tab */}
        {activeTab === 'shipments' && (
          <div className="shipments">
            <h2>All Shipments</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="shipments-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th>Status</th>
                    <th>Weight</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allShipments.map((shipment) => (
                    <tr key={shipment.id}>
                      <td>{shipment.id.substring(0, 8)}</td>
                      <td>{shipment.originLocation}</td>
                      <td>{shipment.destinationLocation}</td>
                      <td><span className={`status ${shipment.status}`}>{shipment.status}</span></td>
                      <td>{shipment.weight}</td>
                      <td><button className="btn btn-small">View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
