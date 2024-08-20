import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

/**
 * If the currentUser is undefined, return null. If the currentUser is defined, return the Route
 * component. If the currentUser is not defined, redirect to the home page
 * @param props - The props that are passed to the component.
 * @returns A function that returns a Route or Redirect component.
 */
const PrivateRoute = ({children, ...rest}) => {
  const { currentUser } = useAuth();
  
  if (currentUser === undefined) {
    return null;
  }
  
  return currentUser ? <Outlet/> : <Navigate to="/" />
  
}

export default PrivateRoute;
