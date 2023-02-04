import { createContext, useState } from "react";

export const DriveGoContext = createContext();

export const DriveGoProvider = ({ children }) => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

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
      }}
    >
      {children}
    </DriveGoContext.Provider>
  );
};
