import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { GeolocationPosition } from "../../types";

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
    <Marker position={position}>
      <Popup>User is here!</Popup>
    </Marker>
  );
}

export default Map;
