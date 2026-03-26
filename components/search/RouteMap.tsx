"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface RouteMapProps {
  dLat?: number;
  dLon?: number;
  aLat?: number;
  aLon?: number;
}

// Component to adjust bounds when coordinates change
function MapController({ dLat, dLon, aLat, aLon, routeCoords }: any) {
  const map = useMap();
  useEffect(() => {
    if (dLat && dLon && aLat && aLon) {
      if (routeCoords.length > 0) {
        const bounds = L.latLngBounds(routeCoords);
        map.flyToBounds(bounds, { padding: [50, 50] });
      } else {
        const bounds = L.latLngBounds([dLat, dLon], [aLat, aLon]);
        map.flyToBounds(bounds, { padding: [50, 50] });
      }
    } else if (dLat && dLon) {
      map.flyTo([dLat, dLon], 12);
    } else if (aLat && aLon) {
      map.flyTo([aLat, aLon], 12);
    }
  }, [map, dLat, dLon, aLat, aLon, routeCoords]);
  return null;
}

export default function RouteMap({ dLat, dLon, aLat, aLon }: RouteMapProps) {
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    if (dLat && dLon && aLat && aLon) {
      const fetchRoute = async () => {
        try {
          const res = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${dLon},${dLat};${aLon},${aLat}?overview=full&geometries=geojson`,
          );
          const data = await res.json();
          if (data.routes && data.routes[0]) {
            const coords = data.routes[0].geometry.coordinates.map(
              (c: [number, number]) => [c[1], c[0]],
            ); // GeoJSON is [lon, lat], Leaflet is [lat, lon]
            setRouteCoords(coords);
          }
        } catch (e) {
          console.error("OSRM Error", e);
        }
      };
      fetchRoute();
    } else {
      setRouteCoords([]);
    }
  }, [dLat, dLon, aLat, aLon]);

  const defaultCenter = [45.5017, -73.5673] as [number, number]; // Montreal
  const center = dLat && dLon ? [dLat, dLon] : defaultCenter;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-inner border border-neutral-200 z-0">
      <MapContainer
        center={center as L.LatLngExpression}
        zoom={9}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {dLat && dLon && <Marker position={[dLat, dLon]} />}
        {aLat && aLon && <Marker position={[aLat, aLon]} />}
        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            color="#f97316"
            weight={5}
            opacity={0.8}
          />
        )}
        <MapController
          dLat={dLat}
          dLon={dLon}
          aLat={aLat}
          aLon={aLon}
          routeCoords={routeCoords}
        />
      </MapContainer>
    </div>
  );
}
