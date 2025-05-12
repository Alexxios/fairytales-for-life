const Dashboard = () => {
    return (
        <div className="admin-component">
            <h2>Dashboard</h2>
            <p>Welcome to the admin dashboard</p>
            <div className="stats">
                <div>Total Users: 1,234</div>
                <div>Active Sessions: 56</div>
                <div>Server Load: 24%</div>
            </div>
        </div>
    );
};

export default Dashboard;