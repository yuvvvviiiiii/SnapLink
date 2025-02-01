import React from 'react';
import styles from './DeleteModal.module.css';
import { RxCross2 } from "react-icons/rx";
import toast from 'react-hot-toast';
import { deleteUrl } from '../apis';

const DeleteModal = ({ urlId, closeModal }) => {

  const handleDelete = async () => {
    try {
      const response = await deleteUrl(urlId);
      toast.success(response?.message);
      closeModal();
    } catch (error) {
      console.log(error);
      toast.error('Error in Deleting URL')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <RxCross2 className={styles.crossIcon} onClick={() => closeModal()}/>
      </div>
      <p className={styles.deleteText}>Are you sure, you want to remove it ?</p>
      <div className={styles.buttons}>
        <button className={styles.noBtn} onClick={() => closeModal()}>No</button>
        <button className={styles.yesBtn} onClick={handleDelete}>Yes</button>
      </div>
    </div>
  )
}

export default DeleteModal
