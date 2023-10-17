import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/socket";
import Map from "../components/Element/Map";
import { GeolocationPosition, socket_status, room_status } from "../types";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";

function Location() {
  const { roomId } = useParams();
  const { socket, connectSocket } = useSocket();

  //* state variables
  const [socketStatus, setSocketStatus] =
    useState<socket_status>("disconnected");
  const [roomStatus, setRoomStatus] = useState<room_status>("unknown");
  const [position, setPosition] = useState<GeolocationPosition | null>(null);

  //* using the effect hook to manage the socket connection
  useEffect(() => {
    connectSocket();
    setSocketStatus("connecting");
    return () => {
      if (socket) {
        socket.disconnect();
        setSocketStatus("disconnected");
      }
    };
  }, []);

  //* Effect hook to manage the socket events
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setSocketStatus("connected");

        //* emit the join room event
        socket.emit("joinRoom", {
          roomId,
        });
      });
      //* listen to the roomJoined event sent from the backend
      socket.on("roomJoined", ({ status }: { status: string }) => {
        if (status === "OK") {
          setRoomStatus("joined");
        } else if (status === "ERROR") {
          setRoomStatus("not-exist");
        } else {
          setRoomStatus("unknown");
        }
      });

      //* listen to the update location response sent when update location event is triggered
      socket.on(
        "updateLocationResponse",
        ({ position }: { position: GeolocationPosition }) => {
          if (position) {
            setPosition(position);
          }
        }
      );

      //* listen to the room destroyed event when a creator leaves the room they created
      socket.on("roomDestroyed", ({ status }: { status: string }) => {
        setRoomStatus("not-exist");
        socket.disconnect();
      });

      socket.on("disconnect", () => {
        setSocketStatus("disconnected");
      });
    }
  });

  return (
    <>
    <section className="pb-3">
      <article className="bg-slate-600 rounded-md p-3 flex flex-wrap gap-3 justify-between items-center w-full">
        
      </article>
    </section>
    </>
  );
}

export default Location;
