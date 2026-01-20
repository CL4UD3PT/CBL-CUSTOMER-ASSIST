import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../store/appContext";
import { useLocation } from "react-router-dom";
import { SidebarAdmin } from "../roles/admin/SidebarAdmin"
import { SidebarCustomer } from "../roles/customer/SidebarCustomer";
import { SidebarEmployee } from "../roles/employee/SidebarEmployee";

export const Sidebar = () => {
    const { store, actions } = useContext(Context);
    const currentLocation = useLocation();
    const [pathname, setPathname] = useState(currentLocation.pathname);

    useEffect(() => {
        setPathname(currentLocation.pathname)
    });

    if (pathname === '/') {
        return ''
    }
    else {
        return (
            store.userProfile.user_info.user_type === "customer" ? <SidebarCustomer />
                : store.userProfile.user_info.user_type === "admin" ? <SidebarAdmin />
                    : store.userProfile.user_info.user_type === "engineer" ? <SidebarEmployee />
                        : store.userProfile.user_info.user_type === "technician" ? <SidebarEmployee />
                            : ""
        );
    }

}