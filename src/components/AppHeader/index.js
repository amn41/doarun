import React from 'react'
import logo from '../../assets/doarun-logo.svg'
import styles from './AppHeader.css' // eslint-disable-line

const AppHeader = (props) => {
  return (
    <header className='app-header'>
      <div className='app-title-wrapper'>
        <div className='app-title-wrapper'>
          <div className='app-left-nav'>
            <img src={logo} className='app-logo' alt='logo' />
          </div>
        </div>
      </div>
    </header>
  )
}

export default AppHeader
