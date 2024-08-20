import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import '../../styling/main.css';

/* List of the following routes */
import Login from '../../pages/auth/login';
import ForgetPassword from '../../pages/auth/forgetPassword';
import Register from '../../pages/auth/register';
import ManageUser from '../../pages/userManagement/manageUser';
import ViewUser from '../../pages/userManagement/viewUser';
import ViewBooking from '../../pages/bookings/viewBooking';
import Homepage from '../../pages/bookings/homepage';
import MyBookings from '../../pages/bookings/myBookings';
import ChangePassword from '../../pages/auth/changePassword';
import PendingBookings from '../../pages/bookings/pendingBookings';
import CompletedBookings from '../../pages/bookings/completedBookings';

import CreateBooking from '../../pages/bookings/createBooking';
import CreateBookingApproverForm from '../bookings/createBookingApproverForm';
import NoMatch from '../../pages/error/noMatch';
import Confirmation from '../../pages/bookings/confirmation';

/* Define the specified routes */
import PrivateRoute from './privateRoute';
import PublicRoute from './publicRoute';
import AdminRoute from './adminRoute';
import AuthAction from '../../pages/auth/authAction';
import MuseumHomePage from '../../pages/bookings/museum_homepage';

/**
 * @function routes
 * 
 * It's a function that is for setting the routes/navigation
 * to different web pages.
 * @returns The return is a list of paths. 
 */

const Paths = () => {
    const navigate = useNavigate();
    
    return (
        <Routes>
            <Route element={<PrivateRoute navigate={navigate} />}> 
                <Route exact path="/homepage" element={<Homepage />} />
                <Route exact path="/homepage/:name" element={<MuseumHomePage />} />
                <Route exact path="/changePassword" element={<ChangePassword />} />
                <Route exact path="/createBooking" element={<CreateBooking/>}/>
                <Route exact path="/createBooking" element={<CreateBookingApproverForm/>}/>
                <Route exact path='/myBooking' element={<MyBookings/>}/>
                <Route exact path="/pendingApproval" element={<PendingBookings/>}/>
                <Route exact path='/completedApproval' element={<CompletedBookings/>}/>
                <Route exact path="/booking/:bkId" element={<ViewBooking/>}/>
                <Route exact path='/confirmation/:bkId/:action' element={<Confirmation/>}/>
            </Route>

            <Route element={<PublicRoute navigate={navigate} />}> 
                <Route path="/" element={<Login />} />
                <Route exact path="/forgetPassword" element={<ForgetPassword />} />
                <Route exact path='/authAction' element={<AuthAction/>}/>
            </Route>

            <Route element={<AdminRoute navigate={navigate} />}> 
                <Route exact path="/manageUser" element={<ManageUser />} />
                <Route exact path="/user/:userId" element={<ViewUser />} />
                <Route exact path="/createUser" element={<Register />} />
            </Route>

            <Route path='*' element={<NoMatch/>} />
        </Routes>        
    )
}

export default Paths


