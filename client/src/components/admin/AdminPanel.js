import UserRegistration from './UserRegistration';

const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <h1>Administrator Dashboard</h1>
      <div className="admin-sections">
        <section>
          <h2>User Management</h2>
          <UserRegistration />
        </section>
        {/* Other admin sections */}
      </div>
    </div>
  );
};

export default AdminPanel;