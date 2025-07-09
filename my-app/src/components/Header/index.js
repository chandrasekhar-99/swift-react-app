import './index.css';

import {Link} from 'react-router-dom';


const Header = () => {

  

  return (
      <nav className='navbar'>
        <div className='logo'>
          <div className='logo-letter-container'>
            <span className='logo-letter'>S</span>
          </div>
          <span className='logo-word'>WIFT</span>
        </div>
        
        <div className='userSection'>
          <div className='avatar'>LG</div> 
          <Link to="/user"><p className='username-styling'>Leanne Graham</p></Link>
        </div>
      
      </nav>
  );
}

export default Header;