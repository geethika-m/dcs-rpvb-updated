import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { database } from "../../firebase";
import { decryptData } from "../../global/utils";
import * as BsIcons from 'react-icons/bs'
import * as GoIcons from 'react-icons/go'
import SideMenuItem from "./sideMenuItem";
import { AdminMenuItems, MenuItems, ApproverMenuItems } from "./menuItem";

/**
 * @function SideMenu
 * It renders a side menu that contains a list of menu items
 * @param props - {
 * @returns The SideMenu component is being returned.
 */

const SideMenu = (props) => {
    const [inactive, setInactive] = useState(props.state);
    const [name, setName] = useState('');
    const [menu, setMenu] = useState([]);
    const [load, setLoad] = useState(false);
    const { logout } = useAuth();
    const userId = decryptData(localStorage.getItem('userId') ?? '');

    // /**
    //  * When the user clicks the sign out button, the logout function is called, and the user is
    //  * redirected to the home page.
    //  */
    function signOut() {
        logout();
    } 

    // /**
    //  * If the menu is inactive, remove the active class from all sub-menus.
    //  */
    const removeActiveClassFromSubMenu = () => {
        document.querySelectorAll(".sub-menu").forEach((el) => {
            el.classList.remove("active");
        });
    };  
        
    useEffect(() => {
        if (inactive) {
            removeActiveClassFromSubMenu();
        }

        props.onCollapse(inactive);
    }, [props, inactive]);
      
    /* Adding an event listener to each menu item. */
    useEffect(() => {
        let menuItems = document.querySelectorAll(".menu-item");
        const clickHandler = (event) => {
          const next = event.target.nextElementSibling;
          removeActiveClassFromSubMenu();
          menuItems.forEach((el) => el.classList.remove("active"));
          event.target.classList.toggle("active");
      
          if (next !== null) {
            next.classList.toggle("active");
          }
        };
      
        menuItems.forEach((element) => {
          element.addEventListener("click", clickHandler);
        });
      
        // Cleanup function
        return () => {
          menuItems.forEach((element) => {
            element.removeEventListener("click", clickHandler);
          });
        };
      }, []);
               

    useEffect(() => {
        if (userId !== '') {
          /* Getting the user data from the database. */
          const unsubscribe = database.usersRef.doc(userId).onSnapshot((snapshot) => {
            const fullName = snapshot.data().fullName;
            setName(fullName);
            
            const userType = JSON.parse(decryptData(localStorage.getItem('admin') ?? 'false'));
            let menuItems = [];
      
            if (userType) {
              menuItems = AdminMenuItems;
            } else {
              const userRole = snapshot.data().userType;
              
              if (userRole === 'User') {
                menuItems = MenuItems;
              } else if (userRole === 'Approver') {
                menuItems = ApproverMenuItems;
              }
            }
      
            setMenu(menuItems);
            setLoad(true);
          });
      
          return unsubscribe;
        }
      }, [userId]);    

    return (
        <React.Fragment>
            {load &&
                <div className={`side-menu ${inactive ? "inactive" : ""}`}>

                    <div className="top-section">
                        <div onClick={() => setInactive(!inactive)} className="toggle-menu-btn">
                            {inactive ? ( <BsIcons.BsArrowRightSquareFill /> ) : ( <BsIcons.BsArrowLeftSquareFill /> )}
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="main-menu">
                        <ul>
                            {menu.map((menuItem) => (
                                <SideMenuItem
                                    key={menuItem.index}
                                    index={menuItem.index}
                                    name={menuItem.name}
                                    path={menuItem.path}
                                    exact={menuItem.exact}
                                    subMenus={menuItem.subMenus || []}
                                    icons={menuItem.icons}
                                    onClick={() => {
                                        if (inactive) {
                                            setInactive(false);
                                        }
                                    }}
                                />
                            ))}

                            <div className="divider2"></div>

                            <li>
                                <div className="menu-item">
                                    <div className="menu-icon">
                                        <GoIcons.GoSignOut onClick={signOut} />
                                    </div>
                                    <span onClick={signOut}>Sign Out</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="side-menu-footer">
                        <div className="user-info">
                            <p>User: {name !== '' && name}</p>
                        </div>
                    </div>
                </div>
            }
        </React.Fragment>
    );
};

export default SideMenu;