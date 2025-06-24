import { io, Socket } from "socket.io-client";

import { VehicleDataPayload } from "../types/vehicle";

let socket: Socket;

export const connectSocket = () => {
  socket = io("http://localhost:3000");
};

export const subscribeToVehicle = (plate: string) => {
  socket?.emit("subscribeToVehicle", { plate });
};

export const unsubscribeFromVehicle = (plate: string) => {
  socket?.emit("unsubscribeFromVehicle", { plate });
};

export const onVehicleData = (callback: (data: VehicleDataPayload) => void) => {
  socket?.on("vehicleData", callback);
};

export const disconnectSocket = () => {
  socket?.disconnect();
};
