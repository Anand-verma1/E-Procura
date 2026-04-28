import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardPI from "./landing_page/dashboard_pi/DashboardPI";
import DashboardRND from "./landing_page/dashboard_rnd/DashboardRND";
import DashboardDean from "./landing_page/dashboard_dean/DashboardDean";
import ProjectBifurcationForm from "./landing_page/dashboard_pi/ProjectBifurcationForm";
import ProjectSummary from "./landing_page/project_summary/ProjectSummary";
import FundBookingOption from "./landing_page/FundBookingOption";

import NavBar from "./NavBar";
import Footer from "./Footer";
import HomePage from "./landing_page/home/HomePage";
import GenerateKey from "./landing_page/key_gen/GenerateKey";

import PIProjectList from "./landing_page/dashboard_pi/PIProjectList";
import FundBifurcationList from "./landing_page/dashboard_pi/FundBifurcationList";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          }
        />

        <Route path="/generate-key" element={<GenerateKey />} />

        <Route
          path="/pi-dashboard"
          element={
            <ProtectedRoute allowedRole="PI">
              <DashboardPI />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rnd-dashboard"
          element={
            <ProtectedRoute allowedRole="RND">
              <DashboardRND />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dean-dashboard"
          element={
            <ProtectedRoute allowedRole="DEAN">
              <DashboardDean />
            </ProtectedRoute>
          }
        />

        <Route path="/projects/:id" element={<ProjectBifurcationForm />} />
        <Route path="/summary/:id" element={<ProjectSummary />} />
        <Route path="/projects" element={<FundBifurcationList />} />
        <Route path="/projects-list" element={<PIProjectList />} />

        <Route
          path="/fund-booking/:projectId"
          element={<FundBookingOption />}
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
