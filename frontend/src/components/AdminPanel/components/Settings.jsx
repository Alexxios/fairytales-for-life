const Settings = () => {
    return (
        <div className="admin-component">
            <h2>System Settings</h2>
            <form>
                <div className="form-group">
                    <label>Site Title</label>
                    <input type="text" defaultValue="My Admin Panel" />
                </div>
                <div className="form-group">
                    <label>Maintenance Mode</label>
                    <input type="checkbox" />
                </div>
                <button type="submit">Save Settings</button>
            </form>
        </div>
    );
};

export default Settings;