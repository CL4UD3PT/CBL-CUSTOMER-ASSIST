import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { Navigate, useNavigate, useParams } from "react-router-dom";


export const AdminViewUser = () => {
    const { id } = useParams();
    const { store, actions } = useContext(Context);
    const [user, setUser] = useState(true)
    const navigate = useNavigate();

    useEffect(() => {
        console.log("admin/view/user/id: ", id);
    }, [])

    const handleUser = (event) => {
        setUser(event.target.value === "1")
    }

    return (
        <div className="container mx-auto mt-5">
            {/* Drop Down Select */}
            <h1>Select User</h1>
            <select className="form-select my-4" aria-label="Default select example" onChange={handleUser}>
                <option value="1">Customer</option>
                <option value="2">Employee</option>
            </select>

            {user === true ? <>

            </>

                : null}
        </div>
    );
};