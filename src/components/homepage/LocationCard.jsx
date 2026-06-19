import { useEffect, useState } from "react";
import "./LocationCard.css";
import { MapPin  } from "lucide-react";


export default function LocationCard() {
  const [address, setAddress] = useState("Fetching location...");

  useEffect(() => {
    getLocation();
        getLocations();

  }, []);
const getLocations = () => {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

        console.log(url);

        const response = await fetch(url);

        const data = await response.json();

        console.log(data);

        setAddress(data.display_name || "Address not found");
      } catch (error) {
        console.error(error);
        setAddress("Address not found");
      }
    },
    (error) => {
      console.error("Geolocation Error:", error);
      setAddress(error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    }
  );
};

const getLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log("SUCCESS");
      console.log(position.coords);
    },
    (error) => {
      console.log("ERROR", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
    }
  );
};

  return (
    <div className="location-card">
      <div className="location-card__content">
        <div className="location-card__details">
          <div className="map d-flex justify-content-center align-items-center">
            <MapPin style={{color:`#rgb(42 63 160)`}} size={30}/>
          </div>
          <div className="adress">
            <h3 className="location-card__title d-block">
              Now, You Are At:
            </h3>

            <p className="location-card__address">
              {address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}