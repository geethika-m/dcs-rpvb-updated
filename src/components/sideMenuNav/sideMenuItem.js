import React, { useState } from "react";
import { NavLink } from "react-router-dom";

/**
 * @function SideMenuItem
 * 
 * It's a function that returns a list item that contains a link to a page, and if the link has
 * submenus, it will render those submenus as well.
 * 
 * The function takes in a few props:
 * 
 * index: the index of the menu item
 * name: the name of the menu item
 * subMenus: an array of submenus
 * icons: the icon of the menu item
 * path: the path of the menu item
 * exact: whether the path is exact or not
 * The function also uses the useState hook to keep track of whether the menu item is expanded or not.
 * 
 * The function has two main parts:
 * 
 * The first part is the main menu item. It's a link that has a class of menu-item. If the menu item is
 * expanded, it will also have a class of active.
 * 
 * The
 * @param props - {
 * @returns A React component that renders a list item.
 */

const SideMenuItem = (props) => {
    const { index, name, subMenus, icons, path, exact } = props;
    const [expand, setExpand] = useState(false);
    
    /**
     * If expand is true, return "active", otherwise return ""
     * @returns the string "active" if the expand variable is true, otherwise it is returning an empty
     * string.
     */
    function checkExpand() {
        if(expand) {
            return "active";
        }
        return "";
    }

    return (
        <li onClick={props.onClick} key={index} >
            {path
                ? (
                    <NavLink
                        to={path}
                        exact={exact.toString()}
                        className={`menu-item ${checkExpand()}`}
                        onClick={() => setExpand(!expand)}
                    ><div className={`menu-icon`}>
                            {icons}
                        </div>
                        <span>{name}</span>
                    </NavLink>
                )
                : (
                    <a
                        className={`menu-item ${checkExpand()}`}
                        onClick={() => setExpand(!expand)}
                    >
                        <div className={`menu-icon`}>
                            {icons}
                        </div>
                        <span>{name}</span>
                    </a>
                )
            }
            
            {subMenus && subMenus.length > 0 ? (
                <ul className={`sub-menu ${checkExpand()}`} onClick={() => setExpand(!expand)}>
                    {subMenus.map((menu, i) => (
                        <li key={i}>
                            <NavLink to={menu.path} exact={menu.exact}>{menu.icons} {menu.name}</NavLink>
                        </li>
                    ))}
                </ul>
            ) : null}
        </li>
    );
};

export default SideMenuItem;