// MainLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
