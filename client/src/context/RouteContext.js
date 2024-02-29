import React, { useState, createContext } from 'react';

export const RouteContext = createContext();

export const RouteContextProvider = (props) => {
    const [transitInfo, setTransitInfo] = useState([]);
    const [selectedTransit, setSelectedTransit] = useState(null);
    const [clicked, setclicked] = useState("");

    const addRoute = (route) => {
        setTransitInfo([...transitInfo, route]);
    };

    return (
        <RouteContext.Provider value={{ transitInfo, setTransitInfo, selectedTransit, setSelectedTransit, clicked, setclicked }}>
            {props.children}
        </RouteContext.Provider>
    );
};
