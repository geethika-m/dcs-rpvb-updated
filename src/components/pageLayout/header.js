import React from "react";
import DCSLogo from "../../images/DCS Logo.png";
import { Button } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";

/**
 * @function Header
 *
 * It returns a header element with an image element inside of it.
 * The image element has a className of 'headerLogo' and a source of the SDCLogo variable.
 * The image element also has an alt attribute of 'DCS Logo'.
 * @returns The Header component is being returned.
 */

const Header = () => {
  const { pathname } = useLocation();
  //const path = pathname.split('/').pop();
  const sliced = pathname.slice(1);
  const isManageUser = pathname.includes("manageUser");
  const isCompletdApproval = pathname.includes("completedApproval");
  const isPendingApproval = pathname.includes("pendingApproval");

  return (
    <header>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img className="headerLogo" src={DCSLogo} alt="DCS Logo" />
      </div>
      <div className="museum_buttons">
        <a
          href={
            isManageUser
              ? `/manageUser/museum_1?src=${sliced}`
              : isCompletdApproval
              ? `/completedApproval/museum_1?src=${sliced}`
              : isPendingApproval
              ? `/pendingApproval/museum_1?src=${sliced}`
              : `/homepage/museum_1?src=${sliced}`
          }
        >
          <Button variant="outline-primary" type="button">
            Singapore Discovery Centre
          </Button>
        </a>
        <a
          href={
            isManageUser
              ? `/manageUser/museum_2?src=${sliced}`
              : isCompletdApproval
              ? `/completedApproval/museum_2?src=${sliced}`
              : isPendingApproval
              ? `/pendingApproval/museum_2?src=${sliced}`
              : `/homepage/museum_2?src=${sliced}`
          }
        >
          <Button variant="outline-primary" type="button">
            Singapore Navy Museum
          </Button>
        </a>
        <a
          href={
            isManageUser
              ? `/manageUser/museum_3?src=${sliced}`
              : isCompletdApproval
              ? `/completedApproval/museum_3?src=${sliced}`
              : isPendingApproval
              ? `/pendingApproval/museum_3?src=${sliced}`
              : `/homepage/museum_3?src=${sliced}`
          }
        >
          <Button variant="outline-primary" type="button">
            Singapore Air Force Museum
          </Button>
        </a>
      </div>
    </header>
  );
};

export default Header;
