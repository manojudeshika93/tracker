import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useDispatch, useSelector } from "react-redux";
import ReactDOM from "react-dom/client";

import { RootState } from "../store";
import {
    connectSocket,
    disconnectSocket,
    subscribeToVehicle,
    unsubscribeFromVehicle,
    onVehicleData,
} from "../services/socket";
import { updateVehicleData } from "../store/vehicleSlice";
import vehicleIcon from "../assets/triangle-icon.svg";
import VehiclePopup from "../components/VehiclePopup";

mapboxgl.accessToken =
    "pk.eyJ1IjoibWFub2p1ZGVzaGlrYTkzIiwiYSI6ImNtY2F1MzZpcDA2NTEyanNhaDBmN2dmbnUifQ.U8TFFX9GH0I4Wbzt5HG2hA";

function LiveTracker() {
    const dispatch = useDispatch();
    const vehicle = useSelector((state: RootState) => state.vehicle);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);

    // Setup WebSocket connection on mount
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

    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [53.847, 23.424], // default UAE coordinates
            zoom: 8,
        });

        return () => mapRef.current?.remove();
    }, []);

    // Update marker when vehicle position changes
    useEffect(() => {
        if (!mapRef.current) return;

        const car = document.createElement("div");
        car.style.backgroundImage = `url(${vehicleIcon})`;
        car.style.backgroundSize = "contain";
        car.style.width = "10px";
        car.style.height = "10px";
        car.style.backgroundRepeat = "no-repeat";
        car.style.backgroundPosition = "center";
        car.style.cursor = "pointer";

        car.onclick = () => {
            const popupNode = document.createElement("div");
            ReactDOM.createRoot(popupNode).render(<VehiclePopup />);
            new mapboxgl.Popup({ offset: 25 })
                .setLngLat([vehicle.position.lng, vehicle.position.lat])
                .setDOMContent(popupNode)
                .addTo(mapRef.current!);
        };

        markerRef.current = new mapboxgl.Marker(car, { rotation: vehicle.angle })
            .setLngLat([vehicle.position.lng, vehicle.position.lat])
            .addTo(mapRef.current);

    }, [vehicle]);

    return null;
}

export default LiveTracker;
