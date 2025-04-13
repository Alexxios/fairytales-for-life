import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const ClusterMap = ({
  users = [],
  style = 'https://demotiles.maplibre.org/style.json',
  center = [0, 0],
  zoom = 1,
  onUserClick = null,
  onClusterClick = null,
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Инициализация карты
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://api.maptiler.com/maps/basic/style.json?key=63P7VH1rv11qc0NXGyYz",
      center,
      zoom,
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Добавление источника данных
      map.current.addSource('users', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: users.map(user => ({
            type: 'Feature',
            properties: {
              id: user.id,
              name: user.name,
            },
            geometry: {
              type: 'Point',
              coordinates: [user.lng, user.lat],
            },
          })),
        },
        cluster: true,
        clusterMaxZoom: 14,  // Максимальный зум, на котором работает кластеризация
        clusterRadius: 50,   // Радиус в пикселях для объединения в кластер
      });

      // 1. Слой кластеров (круги)
      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'users',
        filter: ['has', 'point_count'], // Показываем только кластеры
        paint: {
          // Цвет круга в зависимости от количества точек в кластере
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',  // цвет для 3-9 точек
            10,
            '#f1f075',  // цвет для 10-49 точек
            50,
            '#f28cb1'   // цвет для 50+ точек
          ],
          // Размер круга в зависимости от количества точек
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,  // размер для 3-9 точек
            10,
            30,  // размер для 10-49 точек
            50,
            40   // размер для 50+ точек
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      });

      // 2. Слой с цифрами внутри кластеров
      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'users',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['Open Sans Bold'],
          'text-size': 14,
          'text-allow-overlap': true
        },
        paint: {
          'text-color': '#000'
        }
      });

      // 3. Слой отдельных точек (не кластеры)
      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'users',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });

      // Обработка клика по кластеру
      map.current.on('click', 'clusters', (e) => {
        if (!map.current) return;

        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ['clusters'],
        });

        if (!features.length) return;

        const clusterId = features[0].properties.cluster_id;
        const coordinates = features[0].geometry.coordinates.slice();

        map.current.getSource('users').getClusterExpansionZoom(
          clusterId,
          (err, zoomLevel) => {
            if (err || !map.current) return;

            if (onClusterClick) {
              onClusterClick(coordinates, zoomLevel);
            } else {
              map.current.easeTo({
                center: coordinates,
                zoom: zoomLevel,
                duration: 500
              });
            }
          }
        );
      });

      // Обработка клика по отдельной точке
      map.current.on('click', 'unclustered-point', (e) => {
        if (!map.current) return;

        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ['unclustered-point'],
        });

        if (!features.length) return;

        const coordinates = features[0].geometry.coordinates.slice();
        const user = users.find(u => u.id === features[0].properties.id);

        if (user) {
          if (onUserClick) {
            onUserClick(user);
          } else {
            new maplibregl.Popup()
              .setLngLat(coordinates)
              .setHTML(`<strong>${user.name}</strong>`)
              .addTo(map.current);
          }
        }
      });

      // Изменение курсора при наведении
      map.current.on('mouseenter', ['clusters', 'unclustered-point'], () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', ['clusters', 'unclustered-point'], () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [style, center, zoom]);

  // Обновление данных при изменении users
  useEffect(() => {
    if (!map.current || !map.current.getSource('users')) return;

    const source = map.current.getSource('users');
    source.setData({
      type: 'FeatureCollection',
      features: users.map(user => ({
        type: 'Feature',
        properties: {
          id: user.id,
          name: user.name,
        },
        geometry: {
          type: 'Point',
          coordinates: [user.lng, user.lat],
        },
      })),
    });
  }, [users]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    />
  );
};

export default ClusterMap;