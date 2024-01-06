import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ViewCustomer } from "../../component/forms/view-customer.jsx";
import { ViewEmployee } from "../../component/forms/view-employee.jsx";


export const AdminViewUser = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state;

    useEffect(() => {
        console.log(user);
    }, [])


    return (
        <main className="bd-main order-1 pe-4">
            {user?.type === 'customer'
                ? <ViewCustomer user={user}/>
                : <ViewEmployee user={user}/>
            }
        </main >
    );
};