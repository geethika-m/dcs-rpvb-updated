import React from 'react';
import DCSLogo from '../../images/DCS Logo.png'
import { Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

/**
 * @function Header
 * 
 * It returns a header element with an image element inside of it. 
 * The image element has a className of 'headerLogo' and a source of the SDCLogo variable. 
 * The image element also has an alt attribute of 'DCS Logo'.
 * @returns The Header component is being returned.
 */

const Header = () => {
    return (
      <header>
        <div style={{width: '100%' ,display: 'flex', justifyContent:'center', 'alignItems': 'center'}}>
          <img className='headerLogo' src={DCSLogo} alt='DCS Logo' />
        </div>
        <br />
        <div className='museum_buttons'>
          <a  href="/homepage/museum_1">
            <button type="button">Museum 1</button>
          </a>
          <a  href="/homepage/museum_2">
            <button type="button">Museum 2</button>
          </a>
          <a  href="/homepage/museum_3">
            <button type="button">Museum 3</button>
          </a>
        </div>
      </header>
    )
  }
  
  export default Header