import { useEffect, useState } from "react";
import"../styles/Homepage.css";
import LocationCard from "../components/homepage/LocationCard";
import AttendanceCard from "../components/homepage/AttendanceCard";
import WallDashboard from "../components/homepage/WallDashboard";
import clockinclockoutservice from "../services/clockinclockoutservice";



function HomePage() {
  const [homeData, setHomeData] = useState(null);
const fetchHomeInfo = async () => {
  try {
    const { data } = await clockinclockoutservice.getHomeInfo();
    setHomeData(data);
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchHomeInfo();
}, []);

const handleClockAction = async () => {
  if (!window.isSecureContext) {
    console.error(
      "Geolocation blocked because Secure Context is false."
    );
    alert(
      "Location access requires HTTPS. Please use a secure connection."
    );
    return;
  }

  try {
    const permission = await navigator.permissions.query({
      name: "geolocation",
    });

    if (permission.state === "denied") {
      alert(
        "Location permission is blocked. Please enable location access from browser settings."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const response =
            await clockinclockoutservice.clockInOut({
              clock_status: homeData.clock_status,
              latitude,
              longitude,
              address: "",
              mock_location: 1,
              android_id: "46346436",
            });

          console.log("API Response:", response);
          console.log("Response Data:", response.data);

          if (
            response.data?.status === true ||
            response.data?.success === true
          ) {
            await fetchHomeInfo();
          } else {
            alert(
              response.data?.message ||
                "You are outside the office location. Please come to the office and login."
            );
          }
        } catch (error) {
          console.log("Clock In/Out Error:", error);

          alert(
            error.response?.data?.message ||
              "You are outside the office location. Please come to the office and login."
          );
        }
      },
      (error) => {
        console.log("Geolocation Error:", error);

        alert(
          "Location permission is required for Clock In / Clock Out."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } catch (error) {
    console.log("Permission Error:", error);
  }
};
  return (
    <div className="HomePage-Section">
      <LocationCard />
   <AttendanceCard
      homeData={homeData}
      onClockAction={handleClockAction}
    />
      <WallDashboard/>
    
    </div>
  );
}

export default HomePage;
