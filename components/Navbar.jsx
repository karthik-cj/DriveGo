import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [showDrawer, setShowDrawer] = useState(false);

  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };

  return (
    <>
      <nav id="navbar">
        <a className="navlogo">DriveGo</a>
        <div className="navlinks-container">
          <a href="/myTrips" className="navlink">
            My Trips
          </a>
          <a href="/wallet" className="navlink">
            Wallet
          </a>
          <a href="/profile" className="navlink">
            Profile
          </a>
        </div>
        <div className="menu-icon" onClick={toggleDrawer}>
          {showDrawer ? <FaTimes /> : <FaBars />}
        </div>
      </nav>
      <div className={`drawer${showDrawer ? " open" : ""}`}>
        <a href="/" className="drawer-link" onClick={toggleDrawer}>
          Ride Now
        </a>
        <a href="/myTrips" className="drawer-link" onClick={toggleDrawer}>
          My Trips
        </a>
        <a href="/wallet" className="drawer-link" onClick={toggleDrawer}>
          Wallet
        </a>
        <a href="/profile" className="drawer-link" onClick={toggleDrawer}>
          Profile
        </a>

        <a href="/about" className="drawer-link" onClick={toggleDrawer}>
          About
        </a>
      </div>
    </>
  );
};

export default Navbar;
