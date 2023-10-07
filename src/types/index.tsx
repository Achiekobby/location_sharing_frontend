import { Socket } from "socket.io-client";

export type GeolocationPosition = {
  lat: number;
  lng: number;
};

export type SocketContextType = {
  socket: Socket | null;
  connectSocket: () => void;
};
