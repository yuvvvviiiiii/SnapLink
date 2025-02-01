import React, { useEffect, useState } from 'react';
import styles from './NewlinkModal.module.css';
import { RxCross2 } from "react-icons/rx";
import toast from 'react-hot-toast';
import {  getUrl, updateShortUrl } from '../apis';

const EditLinkModal = ({ closeModal, urlId }) => {

  const [formData, setFormData] = useState({
    originalUrl: '',
    remarks: '',
    expirationDate: '',
  });

  const [formError, setFormError] = useState({
    originalUrl: null,
    remarks: null,
  })

  const [isEnabled, setIsEnabled] = useState(false);

  

  const fetchUrl = async() =>{
    try {
      const response = await getUrl(urlId);
      setFormData({ originalUrl: response?.singleUrl.originalUrl, remarks: response?.singleUrl.remarks, expirationDate: response?.singleUrl.expirationDate });
      toast.success(response?.message);
    } catch (error) {
     console.log(error);
     toast.error('Error in getting urls')
    }
  }

  useEffect(() => {
    fetchUrl();
  }, [])

  const handleToggle = () =>{
    setIsEnabled((prevMode) => {
      const newMode = !prevMode;
      return newMode
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = false;
    setFormError((formError) => {return {...formError, originalUrl: null, remarks: null}});

    if(!formData.originalUrl || formData.originalUrl.length < 1 || !formData.originalUrl.includes('.com') || !formData.originalUrl.includes("https://")){
      setFormError((formError) => {return {...formError, originalUrl: 'Please provide valid Url'}});
      errors = true;
    }
    if(!formData.remarks || formData.remarks.length < 1){
      setFormError((formError) => {return {...formError, remarks: 'Please provide remarks'}});
      errors = true;
    };
    if(errors){
      return
    };

    try {
       const response = await updateShortUrl(urlId, formData);
       toast.success(response?.message);
       closeModal()
       setFormData({
        originalUrl: '',
        remarks: '',
        expirationDate: '',
       })
       setFormError({
        originalUrl: null,
        remarks: null
       })
    } catch (error) {
      toast.error('error creating short url');
      console.log(error);
    }
  }

  return (
    <div className={styles.container}>
          <div className={styles.header}>
            <p>Edit Link</p>
            <RxCross2 className={styles.cross} onClick={() => closeModal()}/>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.url}>
              <p>Destination Url<span>*</span></p>
              <input type="text" value={formData.originalUrl || ''} placeholder='For example: https://web.whatsapp.com/'
              onChange={(e) => setFormData({...formData, originalUrl: e.target.value})}
              
              />
              {formError.originalUrl && <p className={styles.error}>{formError.originalUrl}</p>}
            </div>
            <div className={styles.remarks}>
              <p>Remarks<span>*</span></p>
              <textarea type="text" value={formData.remarks || ''} placeholder='https://web.whatsapp.com/'
              onChange={(e) => setFormData({...formData, remarks: e.target.value})}
              
              />
              {formError.remarks && <p className={styles.error}>{formError.remarks}</p>}
            </div>
            <div className={styles.expired}>
            <div className={styles.theme}>
              <p>Link Expiration</p>
                <div className={isEnabled ? styles.modeToggleNext : styles.modeToggle} onClick={handleToggle}>
                <div className={styles.modeCircle}></div>
              </div>
              </div>
              <input type="text" 
              disabled={!isEnabled}
              value={formData.expirationDate || ''}
              placeholder='For ex: 01-01-2024' className={styles.linkExpire }
              onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
              
              />
            </div>
    
            <div className={styles.footer}>
              <p className={styles.clear}>Clear</p>
              <button className={styles.new} type='submit'>Create New</button>
            </div>
          </form>
        </div>
  )
}

export default EditLinkModal
