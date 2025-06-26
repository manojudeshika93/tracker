import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { VehicleRealtimeData } from "../types/vehicle";

interface VehicleState {
  plate: string;
  status: string;
  position: { lat: number; lng: number };
  angle: number;
  speed: number;
  speedHistory: number[];
  distance: number;
  lastTimestamp: string | null;
}

const initialState: VehicleState = {
  plate: "DXB-CX-36357", // Example plate number to track only one vehicle, replace with actual data
  status: "",
  position: { lat: 0, lng: 0 },
  angle: 0,
  speed: 0,
  speedHistory: [],
  distance: 0,
  lastTimestamp: null,
};

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    updateVehicleData: (state, action: PayloadAction<VehicleRealtimeData>) => {
      const { lat, lng, angle, speed, status, timestamp } = action.payload;

      const prevLat = state.position.lat;
      const prevLng = state.position.lng;

      const distance = calculateDistance(prevLat, prevLng, lat, lng);
      state.distance += distance;

      state.speedHistory.push(speed);
      state.position = { lat, lng };
      state.angle = angle;
      state.speed = speed;
      state.status = status;
      state.lastTimestamp = timestamp;
    },
  },
});

const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371e3; // meters
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lng2 - lng1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d; // meters
};

export const { updateVehicleData } = vehicleSlice.actions;
export default vehicleSlice.reducer;
