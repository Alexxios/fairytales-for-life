import React, { useState } from 'react';
import ClusterMap from "../components/ClusterMap";




export function Page2() {
    const [users, setUsers] = useState([
        { id: 1, lng: 37.617634, lat: 55.755819, name: "Москва" },
        { id: 2, lng: 30.315868, lat: 59.939095, name: "Санкт-Петербург" },
        { id: 3, lng: 39.720349, lat: 47.222078, name: "Ростов-на-Дону" },
        { id: 4, lng: 49.108891, lat: 55.796127, name: "Казань" },
        { id: 5, lng: 37.618423, lat: 55.751244, name: "Москва 2" },
        { id: 6, lng: 37.616667, lat: 55.750000, name: "Москва 3" },
        { id: 7, lng: 131.908856, lat: 43.115536, name: "Владивосток" }
      ]);
    
    const handleUserClick = (user) => {
    console.log('Выбран пользователь:', user);
    alert(`Выбрано: ${user.name}\nШирота: ${user.lat}\nДолгота: ${user.lng}`);
    };

    const handleClusterClick = (coordinates, zoom) => {
    console.log('Клик по кластеру:', coordinates, 'Новый зум:', zoom);
    };

    return (
    <div style={{ width: '100vw', height: '100vh' }}>
        <ClusterMap
        users={users}
        center={[55, 65]} // Центральная Россия
        zoom={4}
        onUserClick={handleUserClick}
        onClusterClick={handleClusterClick}
        maxClusterZoom={14}
        clusterRadius={60}
        />
    </div>
    );
}