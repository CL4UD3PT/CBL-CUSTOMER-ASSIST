import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext.js";
import { useLocation, useNavigate } from "react-router-dom";
import { ViewCustomer } from "../../components/forms/ViewCustomer.jsx";
import { ViewEmployee } from "../../components/forms/ViewEmployee.jsx";


export const AdminViewUserPage = () => {
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