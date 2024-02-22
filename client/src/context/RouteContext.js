import React, { useState, createContext } from 'react';

export const RouteContext = createContext();

export const RouteContextProvider = (props) => {

    const [Routes, setRoutes] = useState([]);

    const addRoute = (route) => {
        setRoutes([...Routes, route]);
    };

    return (
        <RouteContext.Provider value={{Routes, setRoutes, addRoute}}>
            {props.children}
        </RouteContext.Provider>
    )

};