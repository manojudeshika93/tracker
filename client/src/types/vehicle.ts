export interface VehicleRealtimeData {
  lat: number;
  lng: number;
  angle: number;
  speed: number;
  status: "moving" | "stopped";
  timestamp: string;
}

export interface VehicleDataPayload {
  plate: string;
  data: VehicleRealtimeData;
}
