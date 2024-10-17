import React from "react";
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as MdIcons from 'react-icons/md';
import * as RiIcons from 'react-icons/ri';
import * as FiIcons from 'react-icons/fi';


/* An array of objects for admin menu items. */
export const AdminMenuItems = [
    {
        index: 1,
        name: "Home",
        path: "/homepage",
        exact: true,
        icons: <AiIcons.AiFillHome />,
        subMenus: [
            { name: "Create Booking", path: "/createBooking", exact:"true" , icons: <RiIcons.RiFolderAddLine /> },
            { name: "My Booking", path: "/myBooking", exact:"true", icons: <RiIcons.RiFolderSettingsLine /> },
        ],
    },
    {
        index: 2,
        name: "VB Approval Management ",
        exact: true, 
        icons: <MdIcons.MdApproval />,
        subMenus: [
            { name: "Completed Approval", path: "/completedApproval", exact:"true", icons: <AiIcons.AiOutlineFileDone /> },
            { name: "Pending Approval", path: "/pendingApproval", exact:"true", icons: <MdIcons.MdOutlinePendingActions /> },            
            { name: "Dashboard", path: "/dashboard", exact:"true", icons: <MdIcons.MdDashboard /> },            
        ],
    },
    {
        index: 3,
        name: "User Management",
        icons: <FaIcons.FaUser />,
        subMenus: [
            { name: "Create User", path: "/createUser", exact:"true", icons: <FiIcons.FiUserPlus /> },
            { name: "Manage User", path: "/manageUser", exact:"true", icons: <MdIcons.MdOutlineManageAccounts /> },
        ],
    },
    {
        index: 4,
        name: "Settings",
        icons: <RiIcons.RiSettings4Fill />,
        subMenus: [
            { name: "Change Password", path: "/changePassword", exact:"true", icons: <MdIcons.MdPassword /> },
        ],
    }
];

/* An array of objects for approver menu items. */
export const ApproverMenuItems = [
    {
        index: 1,
        name: "Home",
        path: "/homepage",
        exact: true,
        icons: <AiIcons.AiFillHome />,
        subMenus: [
            { name: "Create Booking", path: "/createBooking", exact:"true" , icons: <RiIcons.RiFolderAddLine /> },
            { name: "My Booking", path: "/myBooking", exact:"true", icons: <RiIcons.RiFolderSettingsLine /> },
        ],
    },
    {
        index: 2,
        name: "VB Approval Management ",
        exact: true, 
        icons: <MdIcons.MdApproval />,
        subMenus: [
            { name: "Completed Approval", path: "/completedApproval", exact:"true", icons: <AiIcons.AiOutlineFileDone /> },
            { name: "Pending Approval", path: "/pendingApproval", exact:"true", icons: <MdIcons.MdOutlinePendingActions /> },            
        ],
    },
    {
        index: 3,
        name: "Settings",
        icons: <RiIcons.RiSettings4Fill />,
        subMenus: [
            { name: "Change Password", path: "/changePassword", exact:"true", icons: <MdIcons.MdPassword /> },
        ],
    }
];

/* An array of objects for non-admin menu items. */
export const MenuItems = [
    {
        index: 1,
        name: "Home",
        path: "/homepage",
        exact: true, 
        icons: <AiIcons.AiFillHome />,
        subMenus: [
            { name: "Create Booking", path: "/createBooking", exact:"true", icons: <RiIcons.RiFolderAddLine /> },
            { name: "My Booking", path: "/myBooking", exact:"true", icons: <RiIcons.RiFolderSettingsLine /> },        
        ],
    },
    {
        index: 2,
        name: "Settings",
        icons: <RiIcons.RiSettings4Fill />,
        subMenus: [
            { name: "Change Password", path: "/changePassword", exact:"true", icons: <MdIcons.MdPassword /> },
        ],
    }
];