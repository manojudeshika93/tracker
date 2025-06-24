import { useSelector } from "react-redux";

import { RootState } from "../store";

const VehiclePopup = () => {
  const vehicle = useSelector((state: RootState) => state.vehicle);

  const avgSpeed = vehicle.speedHistory.length
    ? (
        vehicle.speedHistory.reduce((a, b) => a + b, 0) /
        vehicle.speedHistory.length
      ).toFixed(1)
    : "0";

  const mileage = (vehicle.distance / 1000).toFixed(2);

  return (
    <div className="p-2 text-sm">
      <p>
        <strong>Plate:</strong> {vehicle.plate}
      </p>
      <p>
        <strong>Avg Speed:</strong> {avgSpeed} km/h
      </p>
      <p>
        <strong>Mileage:</strong> {mileage} km
      </p>
      <p>
        <strong>Status:</strong> {vehicle.status}
      </p>
    </div>
  );
};

export default VehiclePopup;
