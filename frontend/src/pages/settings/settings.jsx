import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import SideBar from "../../components/SideBar";
import styles from './settings.module.css';
import toast from "react-hot-toast";
import { deleteUser, fetchUser, updateUser } from "../../apis";
import { useNavigate } from "react-router-dom";


export default function Settings() {

  const navigate = useNavigate();

  const[formData, setFormData] = useState({
    name: '',
    email: '',
    mobilenumber: ''
  })
  const [loading, setLoading] = useState(false);

  const [formError, setFormError] = useState({
    name: null,
    email: null,
    mobilenumber: null
  })

  const getUser = async () => {
    try {
      const response = await fetchUser();
      setFormData({name: response?.user?.name, email: response?.user.email, mobilenumber: response?.user?.mobilenumber})
      if(response.status === 200){
        toast.success(response?.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getUser();
  }, [])

  const handleUpdate = async (e) => {
    e.preventDefault();
    let errors = false;
    setFormError((formError) => {return {...formError, email: null, password: null, name: null, confirmPassword: null}});
    if(!formData.email || formData.email.length < 1 || !formData.email.includes("@") || !formData.email.includes(".")) {
      setFormError((formError) => {return {...formError, email: 'Email is required'}});
      errors = true;
    }
    if(!formData.name) {
      setFormError((formError) => {return {...formError, name: 'Name is required'}});
      errors = true;
    }
    if(!formData.mobilenumber){
      setFormError((formError) => { return {...formError, mobilenumber: 'Mobile Number is required' }})
    }
    if(errors){
      return
    }

    try {
      setLoading(true);
      const response = await updateUser(formData);
      fetchUser();
      toast.success(response?.message);
      setFormError({email: null, password: null, mobilenumber: null});
      
    } catch (error) {
      toast.error('error updating user');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async () =>{
    try {
      const response = await deleteUser();
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName')
      toast.success(response?.message);
      navigate('/');
    } catch (error) {
      toast.error(error);
    }
  }

  if(loading){
    return (
      <p>Loading...</p>
    )
  }

  return (
    <div className={styles.container}>
      <Navbar/>
      <div className={styles.content}>
        <SideBar/>
        <div className={styles.pageContent}>
            <form onSubmit={handleUpdate} className={styles.form}>
              <div className={styles.inputContainer}>
                <p className={styles.inputTxt}>Name</p>
                <input type="text" value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}/>
                {formError.name && <p className={styles.error}>{formError.name}</p>}
              </div>
              <div className={styles.inputContainer}>
                <p className={styles.inputTxt}>Email id</p>
                <input type="email" value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}/>
                {formError.email && <p className={styles.error}>{formError.email}</p>}
              </div>
              <div className={styles.inputContainer}>
                <p className={styles.inputTxt}>Mobile No.</p>
                <input type="text" value={formData.mobilenumber || ''}
                onChange={(e) => setFormData({...formData, mobilenumber: e.target.value})}/>
                {formError.mobilenumber && <p className={styles.error}>{formError.mobilenumber}</p>}
              </div>
              <button type="submit" className={styles.signUpBtn} >Save Changes</button>
            </form>
            <button className={styles.deleteBtn} onClick={() => handleDelete()}>Delete Account</button>
        </div>
      </div>
    </div>
  )
}