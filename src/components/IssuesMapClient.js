"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function IssuesMapClient({ issues }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    const id = setTimeout(() => {
      if (window.L?.Icon?.Default?.prototype) {
        delete window.L.Icon.Default.prototype._getIconUrl;
        window.L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });
      }
    }, 100);
    return () => clearTimeout(id);
  }, [mounted]);

  const withLocation = (issues || []).filter(
    (i) => i.location?.lat != null && i.location?.lng != null
  );
  const defaultCenter = withLocation.length
    ? [
        withLocation.reduce((s, i) => s + i.location.lat, 0) / withLocation.length,
        withLocation.reduce((s, i) => s + i.location.lng, 0) / withLocation.length,
      ]
    : [40.7128, -74.006];

  if (!mounted) {
    return (
      <div className="h-96 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500">
        Loading map…
      </div>
    );
  }

  return (
    <div className="h-96 rounded-lg overflow-hidden border border-slate-200 z-0">
      <MapContainer
        center={defaultCenter}
        zoom={withLocation.length ? 12 : 4}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {withLocation.map((issue) => (
          <Marker key={issue._id} position={[issue.location.lat, issue.location.lng]}>
            <Popup>
              <div className="text-sm">
                <strong>{issue.title}</strong>
                <br />
                {issue.category} · {issue.severity} · {issue.status}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
