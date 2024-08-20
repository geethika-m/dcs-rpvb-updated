import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { decryptData } from '../../global/utils';

/**
 * If the user is logged in and is an admin, it will render the route. If the user is not logged in or
 * is not an admin, it will redirect the user to the homepage
 * @param props - The props that are passed to the component.
 * @returns The AdminRoute component is being returned.
 */
const AdminRoute = (props) => {
  const { currentUser } = useAuth();
  const userType = JSON.parse(decryptData(localStorage.getItem('admin') ?? 'false'));

  if (currentUser === undefined) {
    return null;
  }

  return currentUser && userType ? <Outlet/> : <Navigate to="/homepage" />

};

export default AdminRoute;
