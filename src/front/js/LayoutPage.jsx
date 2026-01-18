import React, {useState, useEffect} from "react";
import injectContext from "./store/appContext";
import { BrowserRouter, Route, Router, Routes, useLocation } from "react-router-dom";
import { Navbar } from "./component/Navbar";
import { Sidebar } from "./component/sidebar";
import { MainBdLayout } from "./component/MainDbLayout";
import { LandingPage } from "./pages/LandingPage";
import { AdminTicketsPage } from "./pages/admin/AdminTicketsPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminContactListPage } from "./pages/admin/AdminContactListPage";
import { AdminCreateTicketPage } from "./pages/admin/AdminCreateTicketPage";
import { AdminProcessTicketPage } from "./pages/admin/AdminProcessTicketPage";
import { AdminCreateCustomerPage } from "./pages/admin/AdminCreateCustomerPage";
import { AdminViewUserPage } from "./pages/admin/AdminViewUserPage";
import { EmployeeDashboardPage } from "./pages/common/EmployeeDashboardPage"
import { EmployeeEditProfilePage } from "./pages/common/EmployeeEditProfilePage";
import { CustomerDashboardPage } from "./pages/customer/CustomerDashboardPage";
import { CustomerEditProfilePage } from "./pages/customer/CustomerEditProfilePage";
import { CustomerCreateTicketPage } from "./pages/customer/CustomerCreateTicketPage";
import { CustomerEquipmentListPage } from "./pages/customer/CustomerEquipmentListPage";
import { CustomerEquipmentHistoryPage } from "./pages/customer/CustomerEquipmentHistory";
import { EmployeeTicketAssistancePage } from "./pages/common/EmployeeTicketAssistancePage";
import { LoadingData } from "./component/LoadingData";

import { Footer } from "./component/Footer"
// import { CustomerHelpGuide } from "./pages/customer/customer_help_guide"
// import { Home } from "./pages/home";
// import { Single } from "./pages/single";
// import { AdminCreateAdminPage } from "./pages/admin/admin-create";
// import { CreateTech } from "./pages/technician/tech-create";
// import { CreateCustomer } from "./pages/customer/customer-create.js";
// import {CapturePhoto} from "./pages/customer/capture_photo";


const LayoutPage = () => {
    const basename = process.env.BASENAME || "";
    const currentLocation = useLocation();
    const [pathname, setPathname] = useState(currentLocation.pathname);

    useEffect(()=>{
        setPathname(currentLocation.pathname)
    })

    // TODO: NEED TO REMOVE THIS LINE
    // if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;
    return (
        <div className="h-100">
            {/* <BrowserRouter basename={basename}> */}
                {pathname !== "/" && <Navbar />}
                <MainBdLayout>
                    <Sidebar />
                    <Routes>
                        {/* <Route element={<Login />} path="/" /> */}
                        <Route element={<LandingPage />} path="/" />
                        {/* <Route element={<Home />} path="/" /> */}
                        <Route element={<AdminDashboardPage />} path="/admin/dashboard" />
                        <Route element={<AdminTicketsPage />} path="/admin/tickets" />
                        <Route element={<AdminTicketsPage />} path="/admin/tickets/:filter" />
                        <Route element={<AdminProcessTicketPage />} path="/admin/process/ticket" />
                        <Route element={<AdminViewUserPage />} path="/admin/view/user/" />
                        <Route element={<AdminContactListPage />} path="/admin/contact/list" />
                        <Route element={<AdminCreateTicketPage />} path="/admin/create/ticket" />
                        <Route element={<AdminCreateCustomerPage/>} path="/admin/create/customer"/> 
                        {/* <Route element={<AdminCreateAdmin/>} path="/admin/create" /> */}
                        <Route element={<EmployeeDashboardPage />} path="/employee/dashboard" />
                        <Route element={<EmployeeEditProfilePage />} path="/employee/edit/profile" />
                        <Route element={<EmployeeTicketAssistancePage />} path="/employee/ticket/assistance" />
                        <Route element={<CustomerDashboardPage />} path="/customer/dashboard" />
                        <Route element={<CustomerEditProfilePage />} path="/customer/edit/profile" />
                        <Route element={<CustomerCreateTicketPage />} path="/customer/create/ticket" />
                        <Route element={<CustomerEquipmentListPage />} path="/customer/equipment/list" />
                        <Route element={<CustomerEquipmentHistoryPage />} path="/customer/equipment/history" />
                        <Route element={<LoadingData />} path="/loading" />
                        <Route element={<h1>Not found!</h1>} path="*" />
                        {/* <Route element={<Single />} path="/single/:theid" /> */}
                        {/* <Route element={<CreateTech/>} path="/tech/create"/> */}
                    </Routes>
                </MainBdLayout>
            {/* </BrowserRouter> */}
            {/* <Footer /> */}
        </div>
    );
};

export default injectContext(LayoutPage);
