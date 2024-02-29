import React, { useState, createContext } from 'react';

export const RouteContext = createContext();

export const RouteContextProvider = (props) => {
    const [transitInfo, setTransitInfo] = useState([]);
    const [selectedTransit, setSelectedTransit] = useState(null);

    const addRoute = (route) => {
        setTransitInfo([...transitInfo, route]);
    };

    return (
        <RouteContext.Provider value={{ transitInfo, setTransitInfo, selectedTransit, setSelectedTransit }}>
            {props.children}
        </RouteContext.Provider>
    );
};
