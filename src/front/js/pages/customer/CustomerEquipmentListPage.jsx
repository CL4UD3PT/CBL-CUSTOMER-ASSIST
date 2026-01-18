import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { EquipmentListCard } from "../../component/EquipmentListCard";
import { useLocation } from "react-router-dom";
import Select from 'react-select';

export const CustomerEquipmentListPage = () => {
    const { actions, store } = useContext(Context);
    const equipmentList = store.equipmentList;
    const location = useLocation();
    const [filteredEquipment, setFilteredEquipment] = useState([]);

    useEffect(() => {
        actions.getCustomerEquipment();
    }, []);

    const handleEquipment = (options, action) => {
        setFilteredEquipment(options.map(option => option));
    }

    return (
        <>
            <main className="bd-main order-1 pe-4">
                <div className="bd-intro border-bottom d-flex justify-content-end">

                    {/* <!-- Button trigger modal --> */}
                    <div>
                        <strong typeof="button" className="bd-links-heading btn d-flex w-100 align-items-center fw-semibold" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                            <i className="fa-solid fa-circle-question me-1" style={{ color: "blue" }}></i>Help
                        </strong>
                    </div>
                </div>
                <div className="bd-content">
                    <div>
                        <div className="d-flex flex-column">
                            <h5 className="me-3 mt-2">Equipment:</h5>

                            {/* FILTER EQUIPMENTS */}
                            <Select
                                id="selectEquipment"
                                isMulti
                                className="basic-single mb-2"
                                classNamePrefix="select"
                                isSearchable={false}
                                isClearable={true}
                                isDisabled={false}
                                // components={animatedComponents}
                                options={equipmentList}
                                getOptionLabel={(option) => `${option.model}`}
                                getOptionValue={(option) => `${option.model}`}
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                    }),
                                }}
                                onChange={(newValue, actionMeta) => {
                                    handleEquipment(newValue, actionMeta);
                                    // if (actionMeta.action === 'clear') handleDismissEquipment(newValue, actionMeta);
                                }}
                            />
                        </div>
                    </div>
                    <div className="bd-content ">
                        <div className="border rounded p-4 flex-fill">
                            <div>
                                {filteredEquipment.length > 0
                                    ? filteredEquipment.map((item, i) => { return <EquipmentListCard key={i} data={item} /> })
                                    : equipmentList.map((item, i) => { return <EquipmentListCard key={i} data={item} /> })
                                }
                            </div>
                        </div>
                    </div>
                    {/* <!-- Modal --> */}
                    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-fullscreen">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="staticBackdropLabel">Equipment List Explained</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body d-flex">
                                    <div >
                                        <img className="p-2 me-4 border rounded-3" src="https://res.cloudinary.com/dsonpr8ip/image/upload/v1689793345/Equipment-History-Google-Docs_t62efj.png" />
                                    </div>
                                    <div >
                                        <img className="border rounded-3" style={{ height: "620px", width: "1200px" }} src="https://res.cloudinary.com/dsonpr8ip/image/upload/v1689793345/Equipment-IMG_fy2owf.png" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};
