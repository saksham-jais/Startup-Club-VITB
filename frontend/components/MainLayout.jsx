// MainLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import CustomCursor from "../components/cursor";

export default function MainLayout() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
