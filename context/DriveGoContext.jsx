import { createContext, useState } from "react";

export const DriveGoContext = createContext();

export const DriveGoProvider = ({ children }) => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [drivers, setDrivers] = useState(null);
  return (
    <DriveGoContext.Provider
      value={{
        pickup,
        setPickup,
        dropoff,
        setDropoff,
        distance,
        setDistance,
        duration,
        setDuration,
        drivers,
        setDrivers,
      }}
    >
      {children}
    </DriveGoContext.Provider>
  );
};
