import React from "react";
import { CapitalizeFirst } from "../../../utils/my-functions";

export const ViewEmployee = (props) => {
    const { user } = props;
    const editProfile = false;
    const title = 'Profile'

    return (
        <>
            <div className="bd-intro">
                <h3 className="border-bottom">{!editProfile ? title : 'Edit ' + title}</h3>
            </div>
            <div className="bd-content">
                <form onSubmit={e => e.preventDefault()} noValidate>

                    {/* PERSONAL INFO */}
                    <h5 className="mb-0">Personal Info</h5>
                    <hr className="mt-0"></hr>
                    <div className="row g-2">

                        {/* FIRST NAME */}
                        <div className="col-12 col-md-6">
                            <div className="form-floating">
                                <input type="text" className="form-control" id="firstNameInput" placeholder="your first name"
                                    disabled={!editProfile}
                                    value={user?.first_name}
                                    required />
                                <label htmlFor="firstNameInput">First Name</label>
                            </div>
                        </div>

                        {/* LAST NAME */}
                        <div className="col-12 col-md-6">
                            <div className="form-floating">
                                <input type="text" className="form-control" id="lastNameInput" placeholder="your last name"
                                    disabled={!editProfile}
                                    value={user?.last_name}
                                    required />
                                <label htmlFor="lastNameInput">Last Name</label>
                            </div>
                        </div>

                        {/* ROLE */}
                        <div className="col-12 col-md-6">
                            <div className="form-floating">
                                <input type="text" className="form-control" id="roleInput" placeholder="your role"
                                    disabled={!editProfile}
                                    value={user.role && CapitalizeFirst(user.role)}
                                    required />
                                <label htmlFor="roleInput">Role</label>
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div className="col-12 col-md-6">
                            <div className="form-floating">
                                <input type="email" className="form-control" id="emailInput" placeholder="your.email@adress.com"
                                    disabled={!editProfile}
                                    value={user?.email} />
                                <label htmlFor="emailInput">Email address</label>
                            </div>
                        </div>

                    </div>
                </form>
            </div>

        </>
    )
}