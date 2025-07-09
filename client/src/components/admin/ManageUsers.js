import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import '../GlobalStyles.css';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    email: '',
    role: 'citizen',
    phone: '',
    profile: {}
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setStatus('Error loading users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      email: user.email || '',
      role: user.role || 'citizen',
      phone: user.phone || '',
      profile: user.profile || {}
    });
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          email: editForm.email,
          role: editForm.role,
          phone: editForm.phone,
          profile: editForm.profile,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      setStatus('User updated successfully!');
      setIsEditing(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      setStatus('Error updating user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setStatus('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setStatus('Error deleting user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-admin';
      case 'legal': return 'role-legal';
      case 'citizen': return 'role-citizen';
      default: return 'role-citizen';
    }
  };

  const getStatusClass = () => {
    if (!status) return '';
    if (status.includes('successfully')) return 'success';
    if (status.includes('Error')) return 'error';
    return 'info';
  };

  return (
    <div className="page-container">
      <div className="content-card">
        <div className="page-header">
          <h2 className="page-title">Manage Users</h2>
          <p className="page-subtitle">View, edit, and manage user accounts and roles</p>
        </div>

        {status && (
          <div className={`message ${getStatusClass()}`}>
            {status}
          </div>
        )}

        {loading ? (
          <div className="loading-message">
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="users-container">
            <div className="users-header">
              <h3>Users ({users.length})</h3>
              <button 
                onClick={fetchUsers} 
                className="btn btn-secondary btn-small"
                disabled={loading}
              >
                Refresh
              </button>
            </div>

            {users.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">👥</span>
                <p>No users found</p>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td><strong>{user.email}</strong></td>
                        <td>
                          <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{user.phone || '-'}</td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                        <td className="action-buttons">
                          <button 
                            onClick={() => handleEdit(user)}
                            className="btn btn-secondary btn-small"
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="btn btn-danger btn-small"
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {isEditing && selectedUser && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Edit User</h3>
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm({...editForm, email: e.target.value})}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={editForm.role}
                    onChange={e => setEditForm({...editForm, role: e.target.value})}
                    disabled={loading}
                  >
                    <option value="citizen">Citizen</option>
                    <option value="legal">Legal Officer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={e => setEditForm({...editForm, phone: e.target.value})}
                    disabled={loading}
                  />
                </div>
                
                <div className="modal-actions">
                  <button 
                    type="submit" 
                    className={`btn btn-primary ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update User'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedUser(null);
                    }}
                    className="btn btn-secondary"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers; 