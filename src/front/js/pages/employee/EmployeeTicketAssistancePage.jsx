import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { CustomerInfo } from "../../components/ticket_assistance/CustomerInfo";
import { TicketInfo } from "../../components/ticket_assistance/TicketInfo";
import { MapInfo } from "../../components/ticket_assistance/MapInfo";
import { EquipmentInfoCard } from "../../components/ticket_assistance/EquipmentInfoCard";
import { ModalEquipmentHistory } from "../../components/ticket_assistance/ModalEquipmentHistory";
import { VehicleInfoCard } from "../../components/ticket_assistance/VehicleInfoCard";
import { KnowledgeAssistanceReport } from "../../components/ticket_assistance/KnowledgeAssistanceReport";
import { useGoogleMapsScript } from "../../hooks/useGoogleMapsScript";
// TODO: import { Navigate, useNavigate } from "react-router-dom";
// TODO: import { InterventionTypes } from "../../constants/interventionTypes";

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
