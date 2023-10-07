import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import "leaflet/dist/leaflet.css";
import { GeolocationPosition } from "../../types";
import L from 'leaflet'

const MarkerIcon = L.icon({
  iconUrl:icon,
  shadowUrl: iconShadow
})

function Map({ location }: { location: GeolocationPosition | null }) {
  if (!location){
    return (
      <div>No location found</div>
    );
  }

  const initialPosition: [number, number] = [location.lat, location.lng];
  return (
    <div className="w-full bg-gray-100 h-[600px] md-h-[550px]">
      <MapContainer
        center={initialPosition}
        zoom={30}
        scrollWheelZoom={true}
        className="h-screen"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributor'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker location={location} />
      </MapContainer>
    </div>
  );
}

function LocationMarker({ location }: { location: GeolocationPosition }) {
  const map = useMapEvents({});
  const [position, setPosition] = useState<GeolocationPosition>({
    lat: location.lat,
    lng: location.lng,
  });

  useEffect(() => {
    setPosition({
      lat: location.lat,
      lng: location.lng,
    });
    map.flyTo([location.lat, location.lng]);
  }, [location]);

  return position === null ? null : (
    <Marker position={position} icon={MarkerIcon}>
      <Popup>User is here!</Popup>
    </Marker>
  );
}

export default Map;
