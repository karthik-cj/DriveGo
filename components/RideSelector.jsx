import Image from "next/image";
import { useContext } from "react";
import { DriveGoContext } from "../context/DriveGoContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState, useEffect } from "react";
import { retrieveSpecificDriver } from "../services/blockchain";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

const RideSelector = () => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [expanded, setExpanded] = useState("");
  const [locations, setLocations] = useState([]);
  const { distance, duration, drivers, pickup } = useContext(DriveGoContext);
  let newDistance = distance.slice(0, -3);

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
    <div>
      <Snackbar
        open={alertOpen}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        style={{ marginTop: "40px" }}
      >
        <Alert
          severity="error"
          sx={{ width: "100%", fontWeight: "bold", fontFamily: "Josefin Sans" }}
          onClose={() => {
            setAlertOpen(false);
          }}
        >
          No Drivers Found !!!
        </Alert>
      </Snackbar>
      {duration && drivers && locations.length == drivers[0].length && (
        <div style={{ color: "black" }} className="ride-select-box">
          {drivers[0].map((car, index) => (
            <Accordion
              square={true}
              disableGutters
              className="accordian"
              sx={{ borderRadius: "13px" }}
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
                  <div style={{ fontWeight: "bold" }}>{drivers[2][index]}</div>
                  <div style={{ color: "#205295" }}>
                    {locations[index]} away.
                  </div>
                </div>
                <div
                  style={{
                    height: "30px",
                    position: "absolute",
                    top: "29px",
                    left: "267px",
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
                    {(
                      ((drivers[2][index] === "Premium" ? 22 : 16) *
                        Number(newDistance)) /
                      100000
                    ).toFixed(5)}
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
                    <Button
                      variant="contained"
                      color="error"
                      sx={{
                        position: "relative",
                        left: "110px",
                        top: "3px",
                      }}
                    >
                      Book Ride
                    </Button>
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      )}
    </div>
  );
};

export default RideSelector;
