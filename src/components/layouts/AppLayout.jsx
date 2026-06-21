import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

function AppLayout() {
  return (
    <>
      <Navbar />

      <main className="app-content px-3">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
export default AppLayout;
