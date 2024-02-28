import React, { useEffect, useContext } from 'react';
import { RouteContext } from '../context/RouteContext';
import RouteFinder from '../apis/RouteFinder';

const RouteList = ({ from, to, date, travelerCount }) => {
    const { Routes, setRoutes, addRoute } = useContext(RouteContext);

    useEffect(() => {
        const fetchData = async () => {
            
        };

        fetchData();
    }, [from, to, date, travelerCount]); // Add dependencies to useEffect

    
};

export default RouteList;