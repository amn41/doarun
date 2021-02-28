import React from 'react'
import logo from '../../assets/doarun-logo.svg'
import styles from './AppHeader.css' // eslint-disable-line
import { Link } from 'react-router-dom';

const AppHeader = (props) => {
  return (
    <header className='app-header'>
      <div className='app-title-wrapper'>
        <div className='app-title-wrapper'>
          <div className='app-left-nav'>
            <img src={logo} className='app-logo' alt='logo' />
          </div>
        </div>
        <div className='app-right-nav'>
          <Link to="/profile">
            <img alt="profile" className="avatar" title="View Profile" src="https://dgalywyr863hv.cloudfront.net/pictures/athletes/296399/461322/2/medium.jpg"/>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default AppHeader
