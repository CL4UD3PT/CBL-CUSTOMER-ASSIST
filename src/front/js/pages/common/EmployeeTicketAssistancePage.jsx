import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { Navigate, useNavigate } from "react-router-dom";
import { CustomerInfo } from "../../component/ticket_assistance/CustomerInfo";
import { TicketInfo } from "../../component/ticket_assistance/TicketInfo";
import { InterventionTypes } from "../../constants/interventionTypes";
import { useGoogleMapsScript } from "../../hooks/useGoogleMapsScript";
import { MapInfo } from "../../component/ticket_assistance/MapInfo";
import { EquipmentInfoCard } from "../../component/ticket_assistance/EquipmentInfoCard";
import { ModalEquipmentHistory } from "../../component/ticket_assistance/ModalEquipmentHistory";
import { VehicleInfoCard } from "../../component/ticket_assistance/VehicleInfoCard";
import { KnowledgeAssistanceReport } from "../../component/ticket_assistance/KnowledgeAssistanceReport";

export const EmployeeTicketAssistancePage = () => {
    const { store, actions } = useContext(Context);

    const ticketStage = store.ticketStage;
    const customerInfo = store.assignedTicket.customer;

    const mapInfo = {
        origin: store.manufacturerAddress,
        destination:
            customerInfo.address_1 +
            ", " +
            customerInfo.address_2 +
            " " +
            customerInfo.zipcode +
            " " +
            customerInfo.city,
    };

    // 🔥 Carrega o script do Google Maps apenas nesta página
    const scriptLoaded = useGoogleMapsScript("AIzaSyCkyaErg173zIQoEmdsruVsHllNYLGlczk");

    useEffect(() => {
        actions.getCategories();
        actions.getKnowledgeList();

        const localStorageTicketStage = localStorage.getItem("ticketStage")
            ? JSON.parse(localStorage.getItem("ticketStage"))
            : null;

        localStorageTicketStage
            ? actions.setTicketStage(localStorageTicketStage)
            : actions.setTicketStage(0);
    }, []);

    return (
        <main className="bd-main" data-debug="employee-ticket-assistance-page">
            {ticketStage > 0 ? (
                <>
                    <CustomerInfo />
                    <TicketInfo />
                    <EquipmentInfoCard />

                    {/* Só renderiza o mapa quando o script estiver carregado */}
                    {scriptLoaded 
                        ? (<MapInfo addresses={mapInfo} isMarkerShown />)
                        : (<div>A carregar o mapa...</div>)
                    }
                    
                    <VehicleInfoCard />
                </>
            ) : null}

            {ticketStage >= 3 ? <KnowledgeAssistanceReport /> : null}

            <ModalEquipmentHistory />
        </main>
    );
};
