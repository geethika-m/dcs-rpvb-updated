import React from 'react';
import DCSLogo from '../../images/DCS Logo.png'

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
        <img className='headerLogo' src={DCSLogo} alt='DCS Logo' />
      </header>
    )
  }
  
  export default Header