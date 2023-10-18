import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/socket";
import Map from "../components/Element/Map";
import { GeolocationPosition, socket_status, room_status } from "../types";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import Status from "../components/Element/Status";
import StatusPanel from "../components/Element/StatusPanel";


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
  },[socket]);

  return (
    <>
    <section className="pb-3">
      <article className="bg-slate-600 rounded-md p-3 flex flex-wrap gap-3 justify-between items-center w-full">
        <Status locationStatus={null} socketStatus={socketStatus} />

        {
          position && (
            <div className="flex gap-2 justify-end text-gray-200">
              <p className="font-bold text-sm">Lat: <span className="text-lg font-bold">{position.lat}</span> </p>
              <p className="font-bold text-sm">Lng: <span className="text-lg font-bold">{position.lng}</span> </p>
            </div>
          )
        }
      </article>
    </section>
    {
      roomStatus==="joined" && (
        <section>
          {
            position && (
              <div className="bg-gray-200 rounded-md overflow-hidden">
                <Map location={position} />
              </div>
            )
          }
        </section>
      )
    }
    <section>
      {
        socketStatus==="connecting"&&(
          <article className="mt-5">
            <StatusPanel title="Connecting to Server" subtitle="Please wait..." status="loading" />
          </article>
        )
      }
      {
        socketStatus==="error"&&(
          <article className="mt-5">
            <StatusPanel title="Failed to connect to server" subtitle="Please try again later" status="error" />
          </article>
        )
      }
      {
        roomStatus==="not-exist"&&(
          <article className="mt-5">
            <StatusPanel title="Room does not exist" subtitle="Enter the correct URL" status="error" />
          </article>
        )
      }

{
        roomStatus==="joined"&&(
          <article className="mt-5">
            <BsFillArrowLeftCircleFill size={20} className="cursor-pointer" onClick={()=>window.open('/','_self')} />
            <p className="text-md font-semibold">Back</p>
          </article>
        )
      }
    </section>
    </>
  );
}

export default Location;
