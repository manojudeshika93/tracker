import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useDispatch, useSelector } from "react-redux";
import ReactDOM from "react-dom/client";

import { RootState } from "./store";
import { updateVehicleData } from "./store/vehicleSlice";
import {
  connectSocket,
  onVehicleData,
  subscribeToVehicle,
  unsubscribeFromVehicle,
  disconnectSocket,
} from "./services/socket";
import VehiclePopup from "./components/VehiclePopup";
import vehicleIcon from "./assets/location-icon.svg";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFub2p1ZGVzaGlrYTkzIiwiYSI6ImNtY2F1MzZpcDA2NTEyanNhaDBmN2dmbnUifQ.U8TFFX9GH0I4Wbzt5HG2hA";

function App() {
  const dispatch = useDispatch();
  const vehicle = useSelector((state: RootState) => state.vehicle);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  // Setup WebSocket on mount
  useEffect(() => {
    connectSocket();
    subscribeToVehicle(vehicle.plate);

    onVehicleData((payload) => {
      dispatch(updateVehicleData(payload.data));
    });

    return () => {
      unsubscribeFromVehicle(vehicle.plate);
      disconnectSocket();
    };
  }, [dispatch, vehicle.plate]);

  // Setup Map on mount
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [vehicle.position.lng, vehicle.position.lat],
      zoom: 13,
    });

    return () => mapRef.current?.remove();
  }, []);

  // Update Marker on vehicle update
  useEffect(() => {
    if (!mapRef.current) return;

    const el = document.createElement("div");
    el.className = "vehicle-marker";
    el.style.backgroundImage = `url(${vehicleIcon})`;
    el.style.backgroundSize = "contain";
    el.style.width = "30px";
    el.style.height = "30px";
    el.style.transform = `rotate(${vehicle.angle}deg)`;
    el.style.cursor = "pointer";

    el.onclick = () => {
      const popupNode = document.createElement("div");
      ReactDOM.createRoot(popupNode).render(<VehiclePopup />);
      new mapboxgl.Popup({ offset: 25 })
        .setLngLat([vehicle.position.lng, vehicle.position.lat])
        .setDOMContent(popupNode)
        .addTo(mapRef.current!);
    };

    if (markerRef.current) {
      markerRef.current.setLngLat([vehicle.position.lng, vehicle.position.lat]);
    } else {
      markerRef.current = new mapboxgl.Marker(el)
        .setLngLat([vehicle.position.lng, vehicle.position.lat])
        .addTo(mapRef.current);
    }
  }, [vehicle]);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
}

export default App;
