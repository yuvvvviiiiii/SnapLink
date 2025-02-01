import React, { useEffect } from 'react'
import styles from './Navbar.module.css'
import { logo, sun_img } from '../assets';
import { GoPlus } from "react-icons/go";
import { IoSearchSharp } from "react-icons/io5";

const Navbar = ({openModal}) => {

  function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const [weekday, month, day] = formattedDate.split(' ');
    return `${weekday} ${month}${day}`;
}

const date = new Date();

useEffect(() => {
  formatDate(date);
}, [])

const userName = localStorage.getItem('userName');

const getIntitals = (userName) => {
  if(userName.includes(' ')){
    return userName.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
  } else {
    return userName.slice(0, 2).toUpperCase();
  }
}



  return (
    <div className={styles.navbar}>
     <div className={styles.logo}>
      <img src={logo} alt="" />
     </div>
     <div className={styles.content}>
        <div className={styles.greet}>
          <div className={styles.greetTxt}>
            <img src={sun_img} alt="" />
            <span>Good morning, {userName}</span>
          </div>
          <p>{formatDate(date)}</p>
        </div>
        <div className={styles.navbtn} 
        >
          <div className={styles.create} onClick={(e) =>
          {
             e.stopPropagation();
             openModal();
          }
        }>
            <GoPlus className={styles.plusIcon}/>
            <p>Create New</p>
          </div>
          <div className={styles.search}>
            <IoSearchSharp className={styles.searchIcon}/>
            <input type="text" placeholder='Search by remarks'/>
          </div>
          <div className={styles.initials}>
            <p>{getIntitals(userName)}</p>
          </div>
        </div>
     </div>
    </div>
  )
}

export default Navbar
