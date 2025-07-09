import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const GeoMapViewer = ({ data }) => {
  const locationRows = data.filter(
    (row) =>
      row.latitude !== undefined &&
      row.longitude !== undefined &&
      !isNaN(row.latitude) &&
      !isNaN(row.longitude)
  );

  if (locationRows.length === 0) {
    return (
      <div className="p-4 mt-6 bg-yellow-100 text-yellow-800 rounded">
        ⚠️ No valid latitude/longitude data found.
      </div>
    );
  }

  const center = [
    locationRows[0].latitude || 10.0,
    locationRows[0].longitude || 78.0,
  ];

  return (
    <div className="mt-10 bg-white z-49 p-6 border rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-blue-700">
        🗺️ Geographic Map View
      </h3>

      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locationRows.map((point, idx) => (
          <Marker
            key={idx}
            position={[point.latitude, point.longitude]}
          >
            <Popup>
              <strong>Point {idx + 1}</strong>
              <br />
              Lat: {point.latitude}
              <br />
              Lng: {point.longitude}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default GeoMapViewer;
