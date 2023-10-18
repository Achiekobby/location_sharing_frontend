import { Socket } from "socket.io-client";

export type GeolocationPosition = {
  lat: number;
  lng: number;
};

export type location_status = "accessed" | "denied" | "unknown" | "error";

export type room_status = "unknown" | "joined" | "not-exist";

export type socket_status =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export type SocketContextType = {
  socket: Socket | null;
  connectSocket: () => void;
};

export type StatusProps = {
  locationStatus: location_status | null;
  socketStatus: socket_status | null;
};
