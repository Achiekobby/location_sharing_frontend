import { useState, createContext, useContext, JSX } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  connectSocket: () => void;
};

type SocketProviderProps = {
  children: JSX.Element;
};

//* creating the context
export const SocketContext = createContext<SocketContextType | null>(null);

//* Making a provider for the context above
export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const connectSocket = () => {
    if (!socket) {
      const newSocket: Socket = io("http://localhost:4000");
      setSocket(newSocket);
      return;
    }
    socket?.connect();
  };

  return (
    <SocketContext.Provider value={{ socket, connectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};


//* Making a custom  hook for the context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("Something went wrong!!");
  }
  return context;
};
