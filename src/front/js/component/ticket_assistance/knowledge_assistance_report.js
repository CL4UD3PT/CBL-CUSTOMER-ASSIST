import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Buffer } from "buffer";

export const KnowledgeAssistanceReport = () => {
    const { store, actions } = useContext(Context);
    const ticketStage = store.ticketStage;
    const categoryOptions = store.categoryOptions;
    const knowledgeList = store.knowledgeList;
    const customerInfo = store.assignedTicket.customer;
    const animatedComponents = makeAnimated();
    const [knowledgeFilter, setKnowledgeFilter] = useState([]);
    const [editObservations, setEditObservations] = useState(false);
    const [enableCloseReportButton, setEnableCloseReportButton] = useState(false);
    const [customerUserPassword, setCustomerUserPassword] = useState("");

    const [actionsTaken, setActionsTaken] = useState(localStorage.getItem('actions_taken') ? JSON.parse(localStorage.getItem('actions_taken')) : []);
    const [observationsValue, setObservationsValue] = useState(localStorage.getItem('observations_value') ? JSON.parse(localStorage.getItem('observations_value')) : "");

    useEffect(() => {
        (actionsTaken.length > 0 || observationsValue.length > 0) && !editObservations ? setEnableCloseReportButton(true) : setEnableCloseReportButton(false);
    }, [actionsTaken, observationsValue])

    useEffect(() => {
        if (ticketStage === 8) localStorage.clear();
    }, [ticketStage])

    const handleFilters = (options) => {
        const filter = options.map((opt) => opt.value);
        setKnowledgeFilter(filter);
    }

    const handleAddKnowledgeToReport = (knowledge) => {
        if (!actionsTaken.includes(knowledge)) {
            setActionsTaken(actionsTaken => [...actionsTaken, knowledge]);

            let actions = [...actionsTaken];
            actions.push(knowledge);
            localStorage.setItem('actions_taken', JSON.stringify(actions))
        }

    }

    const handleEditObservations = () => {
        setEditObservations(!editObservations);
        enableCloseReportButton ? setEnableCloseReportButton(!enableCloseReportButton)
            : !enableCloseReportButton && actionsTaken.length > 0 || observationsValue.length > 0 ? setEnableCloseReportButton(!enableCloseReportButton)
                : setEnableCloseReportButton(false);
    }

    const handleObservationsValue = (value) => {
        setObservationsValue(value)

        localStorage.setItem('observations_value', JSON.stringify(value));
    }

    const handleCloseReport = () => {
        actions.setTicketStage(4);
    }

    const handleCustomerReportAproval = () => {
        const encodedString = Buffer.from(customerUserPassword).toString('base64');
        encodedString === customerInfo.authentication.password ? actions.setTicketStage(5) : console.log('Not aproved!');
        console.log(customerInfo.authentication.password, encodedString)
    }

    const handleArrivedHomeFacilities = () => {
        actions.setTicketStage(6);
    }

    const handleFinishAssistance = () => {
        actions.setTicketStatus("Resolved");
        // actions.setTicketStage(8);
    }

    return (
        <div className="mb-3">
            <h4 className="border-bottom">Assistance Report</h4>

            {/* MULTISELECT CATEGORIES */}
            <div className="d-flex mb-3">
                <div
                    className="input-group-text rounded-end-0"
                    style={{ background: "var(--bs-primary-bg-subtle)", color: "var(--bs-primary-text-emphasis)", borderColor: "var(--bs-primary-border-subtle)" }}>
                    Knowledge base
                </div>
                <Select
                    className="react-select-container w-100"
                    placeholder="Select categories..."
                    id="selectCategories"
                    closeMenuOnSelect={true}
                    blurInputOnSelect={true}
                    components={animatedComponents}
                    isDisabled={ticketStage >= 5}
                    // defaultValue={[categoryOptions[0]]}
                    isMulti
                    options={categoryOptions}
                    styles={{
                        control: (baseStyles, state) => ({
                            ...baseStyles,
                            // borderColor: state.isFocused ? 'grey' : 'var(--bs-primary-border-subtle)',
                            borderColor: 'var(--bs-primary-border-subtle)',
                            borderRadius: '0 4px 4px 0'
                        }),
                    }}
                    onChange={(optionsSelected) => handleFilters(optionsSelected)}
                />
            </div>

            {/* FILTERED KNOWLEDGES */}
            <div>
                {knowledgeList.length > 0 ?
                    knowledgeList
                        .filter(knowledge => knowledgeFilter.includes(knowledge.category))
                        .map((knowledge) => {
                            return (
                                <ul className="list-group mb-3 shadow" key={'filtKnow' + knowledge.id}>

                                    {/* MALFUNCTION */}
                                    <li className="list-group-item d-flex justify-content-between align-items-center list-group-item-danger lh-1 fw-medium p-1">
                                        Malfunction
                                        <span className="badge text-warning bg-dark rounded-pill">{knowledge.category}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center list-group-item-danger lh-1 fst-italic p-1">
                                        {knowledge.malfunction}
                                    </li>

                                    {/* SOLUTION */}
                                    <li className="list-group-item d-flex justify-content-between align-items-center list-group-item-success lh-1 fw-medium p-1">
                                        Solution
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center list-group-item-success lh-1 fst-italic p-1">
                                        {knowledge.solution}
                                        <span
                                            className="btn badge text-bg-primary"
                                            onClick={() => handleAddKnowledgeToReport(knowledge)}
                                        >Add to report</span>
                                    </li>
                                </ul>
                            )
                        }) :
                    null
                }
            </div>

            {/* ACTIONS TAKEN: KNOWLEDGES ADDED TO REPORT */}
            {/* TODO: is there a way to do this below without having two actionsTaken.length? */}
            {/* Because the next line just needs to be rendered one time */}
            {actionsTaken.length > 0 ? <h6 className="border-bottom">Actions taken</h6> : ""}
            {actionsTaken.length > 0 ?
                actionsTaken.map((action, i) => {
                    return (
                        <ul className={`list-group mb-3 ${knowledgeFilter.length > 0 ? "opacity-50" : null}`} key={action.id}>

                            {/* MALFUNCTION */}
                            <li className="list-group-item d-flex justify-content-between align-items-center list-group-item-danger lh-1 fw-medium p-1">
                                Malfunction
                                <span className="badge text-warning bg-dark rounded-pill">{action.category}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center list-group-item-danger lh-1 fst-italic p-1">
                                {action.malfunction}
                            </li>

                            {/* SOLUTION */}
                            <li className="list-group-item d-flex justify-content-between align-items-center list-group-item-success lh-1 fw-medium p-1">
                                Solution
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center list-group-item-success lh-1 fst-italic p-1">
                                {action.solution}
                            </li>
                        </ul>
                    )
                }) :
                null
            }

            {/* OBSERVATIONS */}
            <div className="form-floating mb-1">
                <textarea className="form-control"
                    id="floatingTextarea"
                    placeholder="Leave a comment here"
                    style={{ minHeight: "500px" }}
                    disabled={!editObservations}
                    value={observationsValue}
                    onChange={(e) => handleObservationsValue(e.target.value)}
                ></textarea>
                <label htmlFor="floatingTextarea">Observations...</label>
            </div>

            {/* ALERT TO FILL IN KMs ON ARRIVAL TO HOME FACILITIES */}
            {ticketStage === 6 ?
                <div className="alert alert-warning" role="alert">
                    <i className="fa-solid fa-circle-info fa-beat me-3"></i> Please, <strong>fill in</strong> vehicle <strong>kilometers on arrival</strong> in <strong>Vehicle Information</strong>!
                </div>
                : null
            }
            
            {/* ALERTS ABOUT CUSTOMER APROVAL SUCCESS */}
            {ticketStage === 5 ?
                <div className="alert alert-success" role="alert">
                    <i className="fa-solid fa-circle-info fa-beat me-3"></i>
                    Report <strong>aprooved</strong> by customer!
                </div>
                : null
            }

            {/* BUTTON EDIT OBSERVATIONS TEXTAREA */}
            {ticketStage === 3 ?
                <div className="form-check">
                    <input
                        className="form-check-input me-2"
                        checked={editObservations}
                        value={observationsValue}
                        onChange={() => handleEditObservations()}
                        type="checkbox"
                        id="editObservations"
                    />
                    <label className="form-check-label" htmlFor="editObservations">Edit Observations</label>
                </div> :
                null
            }

            {/* BUTTON CLOSE REPORT */}
            {ticketStage === 3 ?
                <button type="button" className="btn btn-primary"
                    data-bs-toggle="modal" data-bs-target="#actionsTakenAndObservationsReportConfirmation"
                    style={{ "--bs-btn-padding-y": ".25rem", "--bs-btn-padding-x": ".5rem", "--bs-btn-font-size": ".75rem" }}
                    disabled={!enableCloseReportButton}>
                    Close Report
                </button> :
                null
            }

            {/* BUTTON CUSTOMER APROVAL */}
            {ticketStage === 4 ?
                <button type="button" className="btn btn-success"
                    data-bs-toggle="modal" data-bs-target="#customerReportAproval"
                    style={{ "--bs-btn-padding-y": ".25rem", "--bs-btn-padding-x": ".5rem", "--bs-btn-font-size": ".75rem" }}>
                    Customer Aproval
                </button> :
                null
            }


            {/* BUTTON: ARRIVED HOME FACILITIES */}
            {ticketStage === 5 ?
                <button type="button" className="btn btn-primary"
                    data-bs-toggle="modal" data-bs-target="#homeFacilitiesArrivalConfirmation"
                    style={{ "--bs-btn-padding-y": ".25rem", "--bs-btn-padding-x": ".5rem", "--bs-btn-font-size": ".75rem" }}>
                    Arrived Home Facilities
                </button> :
                null
            }

            {/* BUTTON: FINISH ASSISTANCE */}
            {ticketStage === 7 ?
                <button type="button" className="btn btn-primary"
                    data-bs-toggle="modal" data-bs-target="#finishesAssistanceConfirmation"
                    style={{ "--bs-btn-padding-y": ".25rem", "--bs-btn-padding-x": ".5rem", "--bs-btn-font-size": ".75rem" }}>
                    Finish Assistance
                </button> :
                null
            }

            {/* MODAL TO CONFIRM ACTIONS TAKEN AND OBSERVATIONS BY TECHNICIAN/ENGINEER */}
            <div className="modal fade" id="actionsTakenAndObservationsReportConfirmation" tabIndex="-1" aria-labelledby="customerReportAprovalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="customerReportAprovalLabel">Report Completion Confirmation</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            All filled in information in report is correct?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                            <button type="button" className="btn btn-success" data-bs-dismiss="modal"
                                onClick={() => handleCloseReport()}>
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL FOR CUSTOMER REPORT APROVAL */}
            <div className="modal fade" id="customerReportAproval" tabIndex="-1" aria-labelledby="actionsTakenAndObservationsReportConfirmationLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="actionsTakenAndObservationsReportConfirmationLabel">Customer Assistance Report Aproval Authentication</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                        <form className="was-validated">

                            {/* CUSTOMER USER EMAIL */}
                            <div className="form-floating mb-3">
                                <input type="email"
                                    className="form-control"
                                    id="customerUserEmail"
                                    placeholder="name@example.com"
                                    value={customerInfo.authentication.user_email}
                                    disabled
                                />
                                <label htmlFor="customerUserEmail">Customer User Email</label>
                            </div>

                            {/* CUSTOMER USER PASSWORD */}
                            <div className="form-floating">
                                <input type="password"
                                    className="form-control"
                                    id="floatingPassword"
                                    placeholder="Password required"
                                    value={customerUserPassword}
                                    onChange={(e) => setCustomerUserPassword(e.target.value)}
                                    required
                                />
                                <label className="form-label" htmlFor="floatingPassword">Password</label>
                                <div className="invalid-feedback">
                                    Please enter your password.
                                </div>
                            </div>
                        </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success flex-grow-1" data-bs-dismiss="modal"
                                onClick={() => handleCustomerReportAproval()}>
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL TO CONFIRM ARRIVAL TO HOME FACILITIES */}
            <div className="modal fade" id="homeFacilitiesArrivalConfirmation" tabIndex="-1" aria-labelledby="homeFacilitiesArrivalConfirmationLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="homeFacilitiesArrivalConfirmationLabel">Home Facilities Arrival Confirmation</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Did you arrived to home facilities?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                            <button type="button" className="btn btn-success" data-bs-dismiss="modal"
                                onClick={() => handleArrivedHomeFacilities()}>
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL TO CONFIRM ASSISTANCE FINISH */}
            <div className="modal fade" id="finishesAssistanceConfirmation" tabIndex="-1" aria-labelledby="finishesAssistanceConfirmationLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="finishesAssistanceConfirmationLabel">Finish Assistance Confirmation</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Do you confirm assistance finishing?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                            <button type="button" className="btn btn-success" data-bs-dismiss="modal"
                                onClick={() => handleFinishAssistance()}>
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}