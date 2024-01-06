import React from "react";

export const ViewCustomer = (props) => {
    const { user } = props;
    const editProfile = 'false';
    const title = 'Profile'

    return (
        <>
            <div className="bd-intro">
                <h3 className="border-bottom">{!editProfile ? title : 'Edit ' + title}</h3>
            </div>
            <div className="bd-content">
                <form onSubmit={e => e.preventDefault()} noValidate>

                    {/* COMPANY INFO */}
                    <h5 className="mb-0">Company Info</h5>
                    <hr className="mt-0"></hr>

                    <div className="row g-2 mb-2">

                        {/* COMPANY NAME */}
                        <div className="col-12 col-md-6">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="companyName"
                                    placeholder="Company name"
                                    disabled={!editProfile}
                                    value={user?.company_name}
                                    required />
                                <label htmlFor="companyName">Company Name</label>
                            </div>
                        </div>

                        {/* CONTACT PERSON */}
                        <div className="col-12 col-md-6">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="contactPerson"
                                    placeholder="Contact person name"
                                    disabled={!editProfile}
                                    value={user?.contact_person} />
                                <label htmlFor="contactPerson">Contact person</label>
                            </div>
                        </div>
                    </div>
                    <div className="row g-2 mb-2">

                        {/* COMPANY EMAIL */}
                        <div className="col-12 col-md-6">
                            <div className="form-floating">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="companyEmail"
                                    placeholder="company.email@adress.com"
                                    disabled={!editProfile}
                                    value={user?.company_email} />
                                <label htmlFor="companyEmail">Company email address</label>
                            </div>
                        </div>

                        {/* PHONE NUMBER */}
                        <div className="col-12 col-md-6">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phone"
                                    placeholder="Phone number"
                                    disabled={!editProfile}
                                    value={user?.phone} />
                                <label htmlFor="phone">Phone number</label>
                            </div>
                        </div>
                    </div>

                    <div className="row g-2 mb-2">

                        {/* ADDRESS 1 */}
                        <div className="col-12 col-md-6">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="address_1"
                                    placeholder="Street..."
                                    disabled={!editProfile}
                                    value={user?.address_1} />
                                <label htmlFor="address_1">Adress 1</label>
                            </div>
                        </div>

                        {/* ADDRESS 2 */}
                        <div className="col-12 col-md-6">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="address_2"
                                    placeholder="Street..."
                                    disabled={!editProfile}
                                    value={user?.address_2} />
                                <label htmlFor="address_2">Adress 2</label>
                            </div>
                        </div>
                    </div>

                    <div className="row g-2 mb-2">

                        {/* ZIPCODE + CITY*/}
                        <div className="col-12 col-md-6">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="zipcode"
                                    placeholder="Enter zipcode"
                                    disabled={!editProfile}
                                    value={user?.zipcode}
                                    required />
                                <label htmlFor="zipcode">Zipcode</label>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="city"
                                    placeholder="Enter city"
                                    disabled={!editProfile}
                                    value={user?.city}
                                    required />
                                <label htmlFor="city">City</label>
                            </div>
                        </div>
                    </div>
                </form >
            </div >
        </>
    );
};