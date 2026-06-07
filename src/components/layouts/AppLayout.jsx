import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";

function AppLayout() {
  return (
    <>
      <Navbar />

      <main className="app-content">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
export default AppLayout;
