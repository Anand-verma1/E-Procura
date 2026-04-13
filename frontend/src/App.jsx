import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "./landing_page/login/LoginPage";
import DashboardPI from "./landing_page/dashboard_pi/DashboardPI";
import DashboardRND from "./landing_page/dashboard_rnd/DashboardRND";
import DashboardDean from "./landing_page/dashboard_dean/DashboardDean";
import ProjectDivisionForm from "./landing_page/project_division_form/ProjectDivisionForm";
import ProjectSummary from "./landing_page/project_summary/ProjectSummary";
import FundBookingOption from "./landing_page/FundBookingOption"
import PurchaseRequisitionForm from "./landing_page/process_forms/PurchaseRequisitionForm"
// import NotFoundPage from "./NotFoundPage";
// import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./NavBar";
import Footer from "./Footer";
// import { AuthProvider, useAuth } from "./context/AuthContext";
import HomePage from "./landing_page/home/HomePage";
import GenerateKey from "./landing_page/key_gen/GenerateKey";
import PIProjectList from "./landing_page/dashboard_pi/PIProjectList";

function App() {
  return (
    <>
     <BrowserRouter>
     <NavBar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generate-key" element={<GenerateKey />} />
        <Route path="/pi-dashboard" element={<DashboardPI />} />
        <Route path="/rnd-dashboard" element={<DashboardRND/>}/>
        <Route path="/dean-dashboard" element={<DashboardDean/>}/>
        <Route path="/new-project" element={<ProjectDivisionForm />} />
        <Route path="/summary" element={<ProjectSummary />} />
        <Route path="/projects" element={<PIProjectList />} />
        <Route path ="/fund-booking/:projectId" element={<FundBookingOption/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
    
    </>
  );
}

export default App;
