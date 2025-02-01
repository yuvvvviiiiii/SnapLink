import { useEffect, useState } from 'react';
import { getAllUrls } from '../../apis';
import Navbar from '../../components/Navbar';
import SideBar from '../../components/SideBar';
import styles from './analytics.module.css';
import toast from 'react-hot-toast';

export default function Analytics(){

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchAllUrls = async () => {
    try {
      setLoading(false);
      const response = await getAllUrls();
      setData(response?.allurls);
      toast.success(response?.message);
    } catch (error) {
      toast.error('Error in geting all urls');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllUrls();
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Extract parts
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  
    // Construct the formatted string
    return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
  }

  if(loading){
    return <h3>Loading...</h3>
  }

  return (
    <div className={styles.container}>
      <Navbar/>
      <div className={styles.content}>
        <SideBar/>
        <div className={styles.pageContent}>
            <div className={styles.linktable}>
          <table className={styles.table}>
            <thead>
            <tr>
              <th>Timestamp</th>
              <th>Original Link</th>
              <th>Short Link</th>
              <th>Ip Address</th>
              <th>User Device</th>
            </tr>
            </thead>
            <tbody>
              {data && data.map((arr) => (
                <tr key={arr._id}>
                  <td className={styles.tableDate}>{formatDate(arr.createdAt)}</td>
                  <td className={styles.originalUrl}>{arr.originalUrl}</td>
                  <td className={styles.hashedUrl}>{`${BACKEND_URL}/api/shortUrl/${arr.hashedUrl}`}
                  </td>
                  <td className={styles.ipAddress}>{arr.ipAddress}</td>
                  <td className={styles.device}>{arr.userDevice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  )
}