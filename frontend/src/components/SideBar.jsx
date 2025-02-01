import React, { useEffect, useState } from 'react'
import styles from './SideBar.module.css';
import { RiHome3Line } from "react-icons/ri";
import { GoLink } from "react-icons/go";
import { HiArrowTrendingUp } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';


const SideBar = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [dashboard, setDashboard] = useState(false);
  const [link, setLink] = useState(false);
  const [analytics, setAnalytics] = useState(false)
  const [settings, setSettings] = useState(false);

  const pathCheck = () => {
    if(location.pathname === '/dashboard'){
      return setDashboard(true);
    }
    if(location.pathname === '/links'){
      return setLink(true);
    }
    if(location.pathname === '/analytics'){
      return setAnalytics(true);
    }
    if(location.pathname === '/settings'){
      return setSettings(true);
    }
  }

  useEffect(() => {
    pathCheck()
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.pages}>
        <div className={dashboard ? `${styles.active}`: `${styles.link}`} onClick={() => navigate('/dashboard')}>
          <RiHome3Line className={styles.icon}/>
          <p>Dashboard</p>
        </div>
        <div className={link ? `${styles.active}`: `${styles.link}`} onClick={() => navigate('/links')}>
          <GoLink className={styles.icon}/>
          <p>Links</p>
        </div>
        <div className={analytics ? `${styles.active}`: `${styles.link}`} onClick={() => navigate('/analytics')}>
          <HiArrowTrendingUp className={styles.icon}/>
          <p>Analytics</p>
        </div>
        <div className={styles.settings} onClick={() => navigate('/settings')}>
          <div className={settings ? `${styles.activeSetting}`: `${styles.setting}`}>
            <IoSettingsOutline className={styles.icon}/>
            <p>Settings</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideBar
