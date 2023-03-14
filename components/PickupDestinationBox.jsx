import { useRef, useContext } from "react";
import { DriveGoContext } from "../context/DriveGoContext";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { getAllDriverDetails } from "../services/blockchain";
import Image from "next/image";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState, useEffect } from "react";
import {
  retrieveSpecificDriver,
  addData,
  getData,
} from "../services/blockchain";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { Button, Rating } from "@mui/material";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const LIBRARIES = ["places"];

const PickupDestinationBox = () => {
  const {
    setPickup,
    setDropoff,
    setDrivers,
    distance,
    duration,
    drivers,
    pickup,
    dropoff,
    setAccept,
  } = useContext(DriveGoContext);
  const [alertOpen, setAlertOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [expanded, setExpanded] = useState("");
  const [locations, setLocations] = useState([]);
  let newDistance = distance.slice(0, -3);

  const pickupText = useRef("");
  const pickupRef = useRef("");
  const dropoffRef = useRef("");

  const updateInput = async () => {
    const pickupValue = pickupRef.current.value;
    const dropoffValue = dropoffRef.current.value;
    if (pickupValue && dropoffValue) {
      let data = await getAllDriverDetails();
      setDrivers(data);
    }
    setPickup(pickupValue);
    setDropoff(dropoffValue);
  };

  function updatePickupText() {
    pickupText.current.innerHTML = "Where Can We Find You?";
  }

  function updateDestinationText() {
    pickupText.current.innerHTML = "Where Should We Drop You?";
  }

  const handleChange = (panel, car) => async (event, newExpanded) => {
    if (newExpanded) {
      setDetails(await retrieveSpecificDriver({ address: car }));
    }
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    if (drivers) {
      if (drivers[0].length === 0) {
        setAlertOpen(true);
        setLocations([]);
      } else {
        Promise.all(drivers[1].map((location) => calculateRoute(location)))
          .then((durations) => setLocations(durations))
          .catch((error) => console.log(error));
      }
    }
  }, [drivers]);

  useEffect(() => {
    if (window.ethereum.selectedAddress !== null) {
      const interval = setInterval(async () => {
        let count = 0;
        const data = await getData();
        console.log(data);
        if (data?.length === 0) setAccept(null);
        for (let i = 0; i < data.length; i++) {
          if (
            data[i].accept &&
            data[i].userAddress.toLowerCase() ===
              window.ethereum.selectedAddress.toLowerCase()
          ) {
            count++;
            setAccept(data[i]);
            break;
          }
        }
        if (count === 0) setAccept(null);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, []);

  async function calculateRoute(location) {
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: pickup,
      destination: location,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    return results.routes[0].legs[0].duration.text;
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
        {duration && distance && (
          <p className="duration">
            {duration} and {distance}
          </p>
        )}

        <Snackbar
          open={alertOpen}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          style={{ marginTop: "40px" }}
        >
          <Alert
            severity="error"
            sx={{
              width: "100%",
              fontWeight: "bold",
              fontFamily: "Josefin Sans",
            }}
            onClose={() => {
              setAlertOpen(false);
            }}
          >
            No Drivers Found !!!
          </Alert>
        </Snackbar>
        {duration && drivers && locations.length == drivers[0].length && (
          <div style={{ color: "black" }} className="ride-select-box">
            {drivers[0].map((car, index) => {
              const costPerKilometer =
                drivers[2][index] === "Premium" ? 22 : 16;
              const distanceInKilometers = Number(newDistance) / 100000;
              const rideCost = (
                costPerKilometer * distanceInKilometers
              ).toFixed(5);
              return (
                <Accordion
                  square={true}
                  disableGutters
                  className="accordian"
                  sx={{ borderRadius: "13px", boxShadow: "none" }}
                  key={car}
                  expanded={expanded === `panel${index}`}
                  onChange={handleChange(`panel${index}`, car)}
                >
                  <AccordionSummary sx={{ height: "80px" }}>
                    <Image
                      className="box"
                      src={
                        drivers[2][index] === "Premium"
                          ? "/premium.png"
                          : "/classic.png"
                      }
                      priority="high"
                      alt=""
                      height={90}
                      width={90}
                      style={{
                        position: "relative",
                        right: "8px",
                      }}
                    />
                    <div
                      style={{
                        height: "40px",
                        position: "relative",
                        top: "32px",
                      }}
                    >
                      <div style={{ fontWeight: "bold" }}>
                        {drivers[2][index]}
                      </div>
                      <div style={{ color: "#205295" }}>
                        {locations[index]} away
                      </div>
                    </div>
                    <div
                      style={{
                        height: "30px",
                        position: "absolute",
                        top: "29px",
                        right: "0px",
                        marginRight: "7px",
                      }}
                    >
                      <div
                        style={{
                          float: "left",
                          paddingTop: "6.5px",
                          position: "relative",
                          left: "13px",
                        }}
                      >
                        {rideCost}
                      </div>
                      <Image src="/eth.png" alt="" height={25} width={40} />
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    {details && (
                      <Typography sx={{ fontFamily: "Josefin Sans" }}>
                        Driver : {details[0]} <br />
                        Phone : {details[1]} <br />
                        Vehicle Model : {details[7]} <br />
                        Vehicle Number : {details[4]} <br />
                        Rating :
                        <Rating
                          name="read-only"
                          value={parseInt(details[9]._hex)}
                          readOnly
                          size="small"
                          sx={{
                            position: "relative",
                            left: "5px",
                            top: "4px",
                          }}
                        />
                        <br />
                        <Button
                          variant="contained"
                          color="error"
                          sx={{
                            borderRadius: "12px",
                            position: "relative",
                            left: "113px",
                            top: "3px",
                          }}
                          onClick={async () => {
                            await addData({
                              driverAddr: car,
                              pickup,
                              dropoff,
                              amount: rideCost,
                            });
                          }}
                        >
                          Book Ride
                        </Button>
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </div>
        )}
      </div>
    </LoadScript>
  );
};

export default PickupDestinationBox;
