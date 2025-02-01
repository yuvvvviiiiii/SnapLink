import { useEffect, useState } from "react";
import { fetchAnalytics } from "../../apis";
import Navbar from "../../components/Navbar";
import SideBar from "../../components/SideBar";
import styles from './dashboard.module.css';
import {toast} from 'react-hot-toast'


export default function Dashboard() {

  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({});

 const getAnalytics = async() => {
  try {
    setLoading(true);
    const response = await fetchAnalytics();
    // toast.success(response?.message);
    setAnalytics(response?.analytics);
    setLoading(false)
  } catch (error) {
    console.log(error);
    toast.error('No analytics Found')
  } finally{
    setLoading(false);
  }
 }

 const totalClicks = analytics.totalClicks;

 useEffect(() => {
  getAnalytics();
 }, [])

 if(loading)
  return(
    <div>Loading...</div>
  )

  return (
    <div className={styles.container}>
      <Navbar/>
      <div className={styles.content}>
        <SideBar/>
        <div className={styles.pageContent}>
        {analytics && (
            <div className={styles.dashboard}>
              <div className={styles.header}>
                <p>Total Clicks</p>
                <span>{analytics.totalClicks}</span>
              </div>
              <div className={styles.clickAnalysis}>
                <div className={styles.datewise}>
                  <div className={styles.dateHeader}>
                    <p>Date-wise Clicks</p>
                  </div>
                  {analytics.clicksByDate && analytics.clicksByDate.map((arr) => (
                    <div key={arr._id} className={styles.date}>
                      <p className={styles.datetext}>{arr.date}</p>
                      <div className={styles.bargraph}>
                        <div
                        style={{
                          backgroundColor: "#0038FF",
                          height: "20px",
                          marginRight: "10px",
                          width: `${(arr.clicks / totalClicks) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className={styles.clicks}>{arr.clicks}</p>
                    </div>
                  ))}
                </div>
                <div className={styles.datewise}>
                  <div className={styles.dateHeader}>
                    <p>Click Devices</p>
                  </div>
                  {analytics.clicksByDevice && analytics.clicksByDevice.map((arr) => (
                    <div key={arr._id} className={styles.date}>
                      <p className={styles.datetext}>{arr.device}</p>
                      <div className={styles.bargraph}>
                          <div
                            style={{
                              backgroundColor: "#0038FF",
                              height: "20px",
                              marginRight: "10px",
                              width: `${(arr.clicks / totalClicks) * 100}%`, // Scale width by maxValue
                            }}
                          ></div>
                      </div>
                    <p className={styles.clicks}>{arr.clicks}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

