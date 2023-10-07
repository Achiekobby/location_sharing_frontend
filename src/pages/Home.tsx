import { useState, useEffect } from "react";
import Map from "../components/Element/Map";
import { GeolocationPosition, location_status } from "../types";


export default function Home() {
  const [locationStatus, setLocationStatus] = useState<location_status>("unknown");
  const [position, setPosition]             = useState<GeolocationPosition | null>(null);

  useEffect(() => {
    let coordinate_id: number | null = null;

    //* Checking for geolocation support in browser
    if ("geolocation" in navigator) {
      coordinate_id = navigator.geolocation.watchPosition(
        (position) => {
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationStatus("accessed");
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationStatus("denied");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationStatus("unknown");
              break;
            case error.TIMEOUT:
              setLocationStatus("error");
              break;
            default:
              setLocationStatus("error");
              break;
          }
        }
      );
      return () => {
        if (coordinate_id) {
          navigator.geolocation.clearWatch(coordinate_id);
        }
      };
    }
  }, []);

  return (
    position && (
      <article className="bg-gray-200 rounded-md overflow-hidden w-full">
        <Map location={position} />
      </article>
    )
  );
}
