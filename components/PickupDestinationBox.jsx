import { useRef, useContext } from "react";
import { DriveGoContext } from "../context/DriveGoContext";
import { Autocomplete, LoadScript } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const LIBRARIES = ["places"];

const PickupDestinationBox = () => {
  const { setPickup, setDropoff, distance, duration } =
    useContext(DriveGoContext);

  const pickupText = useRef("");
  const pickupRef = useRef("");
  const dropoffRef = useRef("");

  const updateInput = () => {
    const pickupValue = pickupRef.current.value;
    const dropoffValue = dropoffRef.current.value;
    setPickup(pickupValue);
    setDropoff(dropoffValue);
  };

  function updatePickupText() {
    pickupText.current.innerHTML = "Where Can We Find You?";
  }

  function updateDestinationText() {
    pickupText.current.innerHTML = "Where Should We Drop You?";
  }

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={LIBRARIES}>
      <div className="pickup_destination_box">
        <h1 ref={pickupText} className="pickup_destination_text">
          Where Can We Find You?
        </h1>
        <div className="circle"></div>
        <div className="line"></div>
        <div className="square"></div>
        <Autocomplete>
          <input
            type="text"
            placeholder="Pickup Location"
            ref={pickupRef}
            onClick={updatePickupText}
          />
        </Autocomplete>
        <Autocomplete>
          <input
            type="text"
            placeholder="Destination"
            ref={dropoffRef}
            onClick={updateDestinationText}
          />
        </Autocomplete>
        <button className="applyButton" onClick={updateInput}>
          Find Ride
        </button>
        {dropoffRef.current.value && pickupRef.current.value && (
          <p className="duration">
            {duration} | {distance}
          </p>
        )}
      </div>
    </LoadScript>
  );
};

export default PickupDestinationBox;
