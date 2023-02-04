import Image from "next/image";
import { useContext } from "react";
import { DriveGoContext } from "../context/DriveGoContext";

const carList = [
  {
    id: 1,
    service: "Classic",
    iconUrl: "/classic.png",
    priceMultiplier: 15,
  },
  {
    id: 2,
    service: "Classic XL",
    iconUrl: "/classicXL.png",
    priceMultiplier: 18,
  },
  {
    id: 3,
    service: "Premium",
    iconUrl: "/premium.png",
    priceMultiplier: 21,
  },
  {
    id: 4,
    service: "Premium XL",
    iconUrl: "/premiumXL.png",
    priceMultiplier: 24,
  },
];

const RideSelector = () => {
  const { distance, duration } = useContext(DriveGoContext);
  let newDistance = distance.slice(0, -3);
  return (
    <div>
      {duration && (
        <div style={{ color: "black" }} className="ride-select-box">
          <div>
            {carList.map((car, index) => (
              <div key={car.id} className="car-image">
                <Image
                  className="box"
                  src={car.iconUrl}
                  priority="high"
                  alt=""
                  height={90}
                  width={90}
                  style={{ position: "relative", bottom: "3px" }}
                />
                <div
                  className="box"
                  style={{ position: "relative", left: "5px" }}
                >
                  <div style={{ fontWeight: "bold" }}>{car.service}</div>
                  <div style={{ color: "#205295" }}>5 mins away</div>
                </div>
                <div className="box">
                  <div
                    style={{
                      float: "left",
                      paddingTop: "6.5px",
                      position: "relative",
                      left: "13px",
                    }}
                  >
                    {/* {((basePrice / 10 ** 5) * car.priceMultiplier).toFixed(5)} */}
                    {(
                      (car.priceMultiplier * Number(newDistance)) /
                      100000
                    ).toFixed(5)}
                  </div>
                  <Image src="/eth.png" alt="" height={25} width={40} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RideSelector;
