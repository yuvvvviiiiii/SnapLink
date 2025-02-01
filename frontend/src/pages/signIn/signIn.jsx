import { useState } from "react";
import { main_img,logo } from "../../assets";
import toast from 'react-hot-toast';
import styles from './signIn.module.css'
import { useNavigate } from "react-router-dom";
import { login } from "../../apis";

export default function SignIn() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({
    email: null,
    password: null,
  });

  const handleLogin = async (e) => {
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
    if(errors){
      return
    }

    try {
      setLoading(true);
      const response = await login(formData);
      toast.success(response?.message);
      setFormData({email: '', password: ''});
      setFormError({email: null, password: null});
      if(response?.token) {
        localStorage.setItem('token', response?.token);
        localStorage.setItem('userId', response?.id);
        localStorage.setItem('userName', response?.username);
        navigate(`/dashboard`);
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
          <button className={styles.signupBtn}
           onClick={() => navigate('/signup')}>SignUp</button>
          <button className={styles.loginBtn}
           onClick={() => navigate('/')}>Login</button>
        </div>
        <div className={styles.headerTxt}>
        <p>Join us Today!</p>
        </div>
        <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles.inputContainer}>
        <input type="email" placeholder='Email id' onChange={(e) => setFormData({...formData, email: e.target.value})}/>
        {formError.email && <p className={styles.error}>{formError.email}</p>}
        </div>
        <div className={styles.inputContainer}>
          <input type='password' placeholder='Password' onChange={(e) => setFormData({...formData, password: e.target.value})}/>
          {formError.password && <p className={styles.error}>{formError.password}</p>}
        </div>
        <button type="submit" className={styles.signUpBtn} >Log In</button>
        <p className={styles.login}>Don’t have an account? <span onClick={() => navigate('/signup')}>SignUp</span></p>
      </form>
      </div>
    </div>
  )
}
