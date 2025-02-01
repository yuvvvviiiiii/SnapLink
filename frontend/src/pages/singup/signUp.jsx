import { useState } from "react";
import { main_img,logo } from "../../assets";
import styles from './signUp.module.css';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { register } from "../../apis";

export default function SignUp() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobilenumber: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({
    email: null,
    password: null,
    mobilenumber: null,
    name: null,
    confirmPassword: null,
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    let errors = false;
    setFormError((formError) => {return {...formError, email: null, password: null, name: null, confirmPassword: null}});
    if(!formData.email || formData.email.length < 1 || !formData.email.includes("@") || !formData.email.includes(".")) {
      setFormError((formError) => {return {...formError, email: 'Email is required'}});
      errors = true;
    }
    if(!formData.password) {
      setFormError((formError) => {return {...formError, password: 'Password is required'}});
      errors = true;
    }
    if(!formData.name || formData.name.length === 0) {
      setFormError((formError) => {return {...formError, name: 'Name is required'}});
      errors = true;
    }
    if(!formData.mobilenumber || formData.mobilenumber.length === 0){
      setFormError((formError) => {return {...formError, mobilenumber: 'Mobile Number is required'}});
      errors = true;
    }
    if(!formData.confirmPassword) {
      setFormError((formError) => {return {...formError, confirmPassword: 'Confirm Password is required'}});
      errors = true;
    }
    if(formData.password !== formData.confirmPassword) {
      setFormError((formError) => {return {...formError, confirmPassword: 'enter same password in both fields'}});
      errors = true;
    }
    if(errors){
      return
    }

    try {
      setLoading(true);
      const response = await register(formData);
      toast.success(response.message);
      setFormData({name: '', email: '', password: '', confirmPassword: '', mobilenumber: ''});
      setFormError({email: null, password: null, name: null, confirmPassword: null, mobilenumber: null});
      if(response.token){
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  if(loading){
    return(
      <div>Loading...</div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img src={main_img} alt="" className={styles.mainImg}/>
        <img src={logo} alt="" className={styles.logo}/>
      </div>
      <div className={styles.right}>
        <div className={styles.buttons}>
          <button className={styles.signupBtn}>SignUp</button>
          <button className={styles.loginBtn} onClick={() => navigate('/')}>Login</button>
        </div>
        <div className={styles.headerTxt}>
        <p>Join us Today!</p>
        </div>
        <form className={styles.form} onSubmit={handleRegister}>
        <div className={styles.inputContainer}>
          <input type="text" placeholder='Name' onChange={(e) => setFormData({...formData, name: e.target.value})}/>
          {formError.name && <p className={styles.error}>{formError.name}</p>}
        </div>
        <div className={styles.inputContainer}>
        <input type="email" placeholder='Email id' onChange={(e) => setFormData({...formData, email: e.target.value})}/>
        {formError.email && <p className={styles.error}>{formError.email}</p>}
        </div>
        <div className={styles.inputContainer}>
        <input type="text" placeholder='Mobile number' onChange={(e) => setFormData({...formData, mobilenumber: e.target.value})}/>
        {formError.mobilenumber && <p className={styles.error}>{formError.mobilenumber}</p>}
        </div>
        <div className={styles.inputContainer}>
          <input type='password' placeholder='Password' onChange={(e) => setFormData({...formData, password: e.target.value})}/>
          {formError.password && <p className={styles.error}>{formError.password}</p>}
        </div>
        <div className={styles.inputContainer}>
          <input type='password' placeholder='Confirm Password' onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}/>
          {formError.confirmPassword && <p className={styles.error}>{formError.confirmPassword}</p>}
        </div>
        <button type="submit" className={styles.signUpBtn} >Sign Up</button>
        <p className={styles.login}>Don’t have an account? <span onClick={() => navigate('/')}>Login</span></p>
      </form>
      </div>
    </div>
  )
}