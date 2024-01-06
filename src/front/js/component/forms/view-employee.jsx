import React from "react";

export const ViewEmployee = (props) => {
    const { user } = props;

    return (
        <>
            <p>{user.type}</p>
        </>
    )
}