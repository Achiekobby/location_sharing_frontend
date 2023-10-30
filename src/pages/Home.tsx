import { useState, useEffect } from "react";
import { useSocket } from "../context/socket";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import StatusPanel from "../components/Element/StatusPanel";
import Status from "../components/Element/Status";
import Map from "../components/Element/Map";
import { GeolocationPosition, location_status, socket_status } from "../types";
import { LuCopy } from "react-icons/lu";

type RoomInfo = {
  roomId: string;
  position: GeolocationPosition;
  totalConnectedUsers: string[];
};

export default function Home() {
  //* accessing the context data
  const { socket, connectSocket } = useSocket();

  const [socketStatus, setSocketStatus] =
    useState<socket_status>("disconnected");
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [locationStatus, setLocationStatus] =
    useState<location_status>("unknown");
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [roomLink, setRoomLink] = useState<string>("");

  function connectToSocket() {
    connectSocket();
    setSocketStatus("connecting");
  }

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

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setSocketStatus("connected");
        socket.emit("createRoom", {
          position,
        });
      });

      socket.on("roomCreated", (data: RoomInfo) => {
        toast.success("You are live", {
          autoClose: 2000,
        });
        setRoomInfo(data);
      });

      socket.on(
        "userJoinedRoom",
        (data: { user_id: string; total_connected_users: string[] }) => {
          setRoomInfo((prev) => {
            if (prev) {
              return {
                ...prev,
                totalConnectedUsers: data.total_connected_users,
              };
            }
            return null;
          });
          toast.info(`${data.user_id} joined room`, { autoClose: 2000 });
        }
      );

      position &&
        socket.emit("updateLocation", {
          position,
        });

      socket.on(
        "userLeftRoom",
        (data: { user_id: string; total_connected_users: string[] }) => {
          setRoomInfo((prev) => {
            if (prev) {
              return {
                ...prev,
                totalConnectedUsers: data.total_connected_users,
              };
            }
            return null;
          });
          toast.info(`${data.user_id} left the Room`, {
            autoClose: 2000,
          });
        }
      );

      socket.on("disconnect", () => {
        setSocketStatus("disconnected");
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.disconnect();
      setSocketStatus("disconnected");
      setRoomInfo(null);
      toast.success("You are currently disconnected", {
        autoClose: 2000,
      });
    }
  }, [position]);

  function stopSharingLocation() {
    if (socket) {
      socket.disconnect();
      setSocketStatus("disconnected");
      setRoomInfo(null);
      toast.success("You are currently disconnected", { autoClose: 2000 });
    }
  }

  return (
    <>
      <section className="pb-3">
        <article className="bg-slate-600 rounded-md p-3 flex flex-wrap gap-3 justify-between items-center w-full">
          <Status locationStatus={locationStatus} socketStatus={socketStatus} />

          {position && (
            <div className="flex gap-2 flex-wrap gap-2 justify-end text-gray-200">
              <p className="font-bold text-sm">
                Lat: <span className="text-lg font-bold">{position.lat}</span>
              </p>
              <p className="font-bold text-sm">
                Lng: <span className="text-lg font-bold">{position.lng}</span>
              </p>
            </div>
          )}
        </article>
      </section>

      <section className="flex flex-col lg:flex-row gap-4 w-full h-auto">
        <article
          className={`flex flex-col justify-between gap-4 w-full bg-slate-500 px-4 py-6 rounded-xl lg:min-w[20rem] ${
            position ? "lg:max-w-sm" : "w-full"
          }`}
        >
          <div className="flex flex-col gap-3 w-full">
            {socketStatus === "disconnected" && (
              <div className="flex flex-col gap-6 items-start w-full">
                <button
                  className={`${
                    locationStatus === "accessed"
                      ? "bg-purple-600"
                      : "bg-gray-600 cursor-not-allowed"
                  } text-md text-white font-bold py-2 px-4 rounded-md`}
                  onClick={() => {
                    if (locationStatus === "accessed") {
                      connectToSocket();
                    } else {
                      toast.error("Please allow access to location", {
                        autoClose: 2000,
                      });
                    }
                  }}
                  disabled={locationStatus !== "accessed"}
                >
                  Share Location
                </button>
                <span className="flex gap-1">
                  <input
                    type="text"
                    value={roomLink}
                    onChange={(e) => setRoomLink(e.target.value)}
                    placeholder="Enter a link to join a sharing room"
                    className="bg-gray-300 rounded-md px-4 py-2 outline-none ring-0 text-md font-medium"
                  />
                  <button
                    className="bg-yellow-400 text-md text-gray-700 py-2 px-4 rounded-md"
                    onClick={() => {
                      if (roomLink) {
                        window.open(roomLink, "_self");
                      } else {
                        toast.error("Invalid Link Entry", { autoClose: 2000 });
                      }
                    }}
                  >
                    Join
                  </button>
                </span>
              </div>
            )}
          </div>
        </article>
      </section>
    </>
  );
}
