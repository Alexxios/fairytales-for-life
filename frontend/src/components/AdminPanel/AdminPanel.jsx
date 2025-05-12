import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Settings from './components/Settings';
import Analytics from './components/Analytics';
import './AdminPanel.css';

const AdminPanel = () => {
    const components = [
        { id: 1, name: 'Dashboard', component: <Dashboard /> },
        { id: 2, name: 'Users', component: <Users /> },
        { id: 3, name: 'Settings', component: <Settings /> },
        { id: 4, name: 'Analytics', component: <Analytics /> }
    ];

    const [currentComponentIndex, setCurrentComponentIndex] = useState(0);

    const nextComponent = () => {
        setCurrentComponentIndex((prevIndex) => 
            prevIndex === components.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevComponent = () => {
        setCurrentComponentIndex((prevIndex) => 
            prevIndex === 0 ? components.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="admin-panel">
            <h1>Admin Panel</h1>
            <div className="component-navigator">
                <button className="nav-arrow left" onClick={prevComponent}>
                    &larr;
                </button>
                
                <div className="current-component">
                    <div className="component-header">
                        <h3>{components[currentComponentIndex].name}</h3>
                    </div>
                    {components[currentComponentIndex].component}
                </div>
                
                <button className="nav-arrow right" onClick={nextComponent}>
                    &rarr;
                </button>
            </div>
        </div>
    );
};

export default AdminPanel;