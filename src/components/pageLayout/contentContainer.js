import React, { useState } from 'react';
import Header from './header';
import PageFooter from './footer';
import SideMenu from '../sideMenuNav/sideMenu';

/**
 * @function ContentContainer
 * 
 * The main component for all pages within the Oral History Web app.
 * 
 * It's a function that returns a div with a className of "page-gridlayout" and inside that div, there
 * are 4 other divs with classNames of "sidebar-gridarea", "header-gridarea", "content-gridarea", and
 * "footer-gridarea".
 * @returns The return statement is returning a JSX element.
 */

const ContentContainer = ({children}) => {
    const [inactive, setInactive] = useState(true);
    const currentLoc = window.location.href;

    return (
        <div className="page-gridlayout">
            <div className="sidebar-gridarea">
            <SideMenu
                state={inactive}
                onCollapse={() => setInactive(inactive)}
            />
            </div>
            <div className="header-gridarea">
                <Header />
            </div>
            <div className="content-gridarea">
                <div className={currentLoc.includes("booking") ? 'sub-container' : 'main-container'}>
                    {children}
                </div>
            </div>
           {/* <div className="footer-gridarea">
                <div className={window.scrollY > 0 ? "footer-scroll font-styling" : "footer-noscroll font-styling"}>
                    <PageFooter />
                </div>
    </div>*/}
        </div>
    )
}

export default ContentContainer