'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function parseLocation(locationString) {
  const parts = locationString.split(',').map(part => part.trim());
  const lastPart = parts[parts.length - 1];
  const secondLastPart = parts[parts.length - 2];

  // Try to extract coordinates from the last two parts
  const latLngMatch = lastPart.match(/(-?\d+\.\d+)\s+(-?\d+\.\d+)/);
  if (latLngMatch) {
    return { lat: parseFloat(latLngMatch[1]), lng: parseFloat(latLngMatch[2]) };
  }

  // If no coordinates found, try to extract from the second last part (assuming it might contain a zip code with coordinates)
  const zipMatch = secondLastPart.match(/(\d{5})\s+(-?\d+\.\d+)\s+(-?\d+\.\d+)/);
  if (zipMatch) {
    return { lat: parseFloat(zipMatch[2]), lng: parseFloat(zipMatch[3]) };
  }

  // If still no coordinates found, return null
  return null;
}

export default function Map({ hotels }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!mapRef.current) {
        mapRef.current = L.map('map').setView([39.8283, -98.5795], 4); // Center on USA

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapRef.current);
      }

      const map = mapRef.current;

      const hotelIcon = L.icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      const markers = [];

      hotels.forEach(hotel => {
        const coords = parseLocation(hotel.location);
        if (coords) {
          const marker = L.marker([coords.lat, coords.lng], { icon: hotelIcon })
            .addTo(map)
            .bindPopup(`
              <div class="text-center">
                <h3 class="font-bold">${hotel.name}</h3>
                <p>${hotel.location}</p>
                <p>Price: ${hotel.price}</p>
                <p>Rating: ${hotel.rating}</p>
              </div>
            `);
          markers.push(marker);
        } else {
          console.warn(`Unable to parse location for hotel: ${hotel.name}`);
        }
      });

      if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
      }

      return () => {
        map.remove();
        mapRef.current = null;
      };
    }
  }, [hotels]);

  return <div id="map" style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }} />;
}