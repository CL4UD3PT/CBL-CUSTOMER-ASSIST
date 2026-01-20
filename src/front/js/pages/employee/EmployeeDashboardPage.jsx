import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { PageTitle } from "../../components/ui/PageTitle"
import { TicketSmallEmployee } from "../../components/roles/employee/TicketSmallEmployee";

export const EmployeeDashboardPage = () => {
    const { store, actions } = useContext(Context);
    const ticket = store.assignedTicket;

    useEffect(()=>{
        actions.getEmployeeAssignedTicket();
    }, []);

    return (
        <main data-debug="employee-dashboard-page" className="bd-main order-1 pe-4">
            <div className="bd-intro">
                <PageTitle title={"Dashboard"} />
            </div>
            <div className="bd-content">
                {Object.keys(ticket).length > 0 ? <TicketSmallEmployee />
                    : <div className="alert alert-info" role="alert">
                        There is no ticket assigned!
                    </div>
                }
            </div>
        </main>
    );
};
