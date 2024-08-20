import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

/**
 * If the currentUser is undefined, return null. If the currentUser is null, render the Route
 * component. If the currentUser is not null, redirect to the homepage
 * @param props - The props that are passed to the component.
 * @returns A function that returns a component.
 */
const PublicRoute = ({children, ...rest}) => {
  const { currentUser } = useAuth();

  if (currentUser === undefined) {
    return null;
}

  return currentUser === null ? <Outlet/> : <Navigate to="/homepage" />
  
}

export default PublicRoute;
