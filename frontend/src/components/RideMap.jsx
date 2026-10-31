import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import { useEffect } from "react";

// Fix Leaflet marker icons issue in React
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function Routing({ pickup, destination }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !pickup || !destination) return;

    try {
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(pickup.lat, pickup.lng),
          L.latLng(destination.lat, destination.lng),
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        show: false // Hides the textual directions overlay for a cleaner map look
      }).addTo(map);

      return () => {
        if (map && routingControl) {
          map.removeControl(routingControl);
        }
      };
    } catch (err) {
      console.error("Routing control error:", err);
    }
  }, [map, pickup, destination]);

  return null;
}

const RideMap = ({ pickup, destination }) => {
  const hasCoords =
    pickup && destination &&
    typeof pickup.lat === "number" && typeof pickup.lng === "number" &&
    typeof destination.lat === "number" && typeof destination.lng === "number";

  if (!hasCoords) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-slate-800 text-slate-400 rounded-2xl border border-slate-700">
        <p className="text-center font-medium">Map coordinates not available for this ride.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
      <MapContainer
        center={[pickup.lat, pickup.lng]}
        zoom={13}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[pickup.lat, pickup.lng]}>
          <Popup>Pickup Location</Popup>
        </Marker>
        <Marker position={[destination.lat, destination.lng]}>
          <Popup>Destination</Popup>
        </Marker>
        <Routing pickup={pickup} destination={destination} />
      </MapContainer>
    </div>
  );
};

export default RideMap;
