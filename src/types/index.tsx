import { Socket } from "socket.io-client";


export type GeolocationPosition = {
  lat: number;
  lng: number;
};

export type location_status = "accessed" | "denied" | "unknown" | "error";

export type SocketContextType = {
  socket: Socket | null;
  connectSocket: () => void;
};
