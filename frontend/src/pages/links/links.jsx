import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import NewlinkModal from '../../components/newlinkModal';
import SideBar from '../../components/SideBar';
import styles from './links.module.css';
import toast from 'react-hot-toast';
import { deleteUrl, getAllUrls } from '../../apis';
import { IoCopyOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditLinkModal from '../../components/EditLinkModal';
import DeleteModal from '../../components/DeleteModal';

export default function Links () {

  const [newLinkModal, setNewLinkModal] = useState(false);
  const [editLinkModal, setEditLinkModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [urlId, setUrlId] = useState('');
  const [deleteUrlId, setDeleteUrlId] = useState('');

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const openCreateLinkModal = () => setNewLinkModal(true);
  const closeCreateLinkModal = () => setNewLinkModal(false);
  const openEditLinkModal = () => setEditLinkModal(true);
  const closeEditLinkModal = () => setEditLinkModal(false);
  const openDeleteModal = () => setDeleteModal(true);
  const closeDeleteModal = () => setDeleteModal(false);

  useEffect(() => {
    fetchAllUrls();
  }, [newLinkModal, editLinkModal, deleteModal])

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

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url)
    .then(() => {
      toast.success('URL Copied to Clipboard');
    })
    .catch((err) => {
      toast.error('Failed to copy');
    })
  }


  if(loading){
    return (
      <div>
        loading...
      </div>
    )
  }

  return(

      <div className={styles.container} >
        <Navbar openModal={openCreateLinkModal}/>
        <div className={styles.content}>
          <SideBar/>
          <div className={styles.pageContent}>
            <div className={styles.linktable}>
              <table className={styles.table}>
                <thead>
                <tr>
                  <th>Date</th>
                  <th>Original Link</th>
                  <th>Short Link</th>
                  <th>Clicks</th>
                  <th>Remarks</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>
                  {data && data.map((arr) => (
                    <tr key={arr._id}>
                      <td className={styles.tableDate}>{formatDate(arr.createdAt)}</td>
                      <td className={styles.originalUrl}>{arr.originalUrl}</td>
                      <td className={styles.hashedUrl}>{`${BACKEND_URL}/api/shortUrl/${arr.hashedUrl}`}
                        <button className={styles.copy} onClick={() => handleCopy(`${BACKEND_URL}/api/shortUrl/${arr.hashedUrl}`)}><IoCopyOutline className={styles.copyIcon}/></button>
                      </td>
                      <td className={styles.tableClicks}>{arr.clicks}</td>
                      <td className={styles.tableRemarks}>{arr.remarks}</td>
                      <td className={styles.active}>Active</td>
                      <td className={styles.action}>
                        <MdEdit className={styles.editBtn} onClick={(e) => {
                            e.stopPropagation();
                            openEditLinkModal();
                            setUrlId(arr._id);
                        }}/>
                        <RiDeleteBin6Line className={styles.deleteBtn} onClick={(e) => {
                          e.stopPropagation();
                          setDeleteUrlId(arr._id);
                          openDeleteModal();
                        }}/>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {newLinkModal && (<>
          <div className={styles.background} onClick={() => closeCreateLinkModal()}></div>
          <NewlinkModal  closeModal={closeCreateLinkModal}/>
        </>)}
        {editLinkModal && (<>
          <div className={styles.background} onClick={() => closeEditLinkModal()}></div>
          <EditLinkModal  closeModal={closeEditLinkModal} urlId={urlId}/>
        </>)}
        {deleteModal && (<>
          <div className={styles.background} onClick={() => closeDeleteModal()}></div>
          <DeleteModal urlId={deleteUrlId} closeModal={closeDeleteModal}/>
        </>)}
      </div>
  )
}