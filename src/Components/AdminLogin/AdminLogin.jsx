import React, { useState } from 'react'
import * as Yup from 'yup'
import axios from 'axios'
import {  useFormik } from 'formik'
import {  Link, useNavigate} from 'react-router-dom'
import {Helmet} from "react-helmet";
import { Icon } from 'react-icons-kit';
import {eye} from 'react-icons-kit/feather/eye';
import {eyeOff} from 'react-icons-kit/feather/eyeOff'
import {login} from 'react-icons-kit/entypo/login'
import ApiBaseUrl from '../ApiBaseUrl';

export default function AdminLogin({saveAdminData}) {
  const[isLoading,setIsLoading]=useState(false)
  const [passwordShown, setPasswordShown] = useState(false);
  const [ErrMsg, setErrMsg] = useState()
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  let navigate = useNavigate()

  async function makeAdminLogged(values){
    setIsLoading(true)
    setErrMsg(null)
    try {
      let {data} = await axios.post(ApiBaseUrl + 'administrators/login',values);
      setIsLoading(false)
      formik.resetForm();
      localStorage.setItem("AdminToken",data.token)
      saveAdminData()
      navigate("/")
    } catch (error) {
      console.error(error);
      setIsLoading(false)
      setErrMsg('Login Failed: Your user Name or password is incorrect')
    }
  }
  let mySchema =Yup.object( {
    username:Yup.string().required("User Name is required"),
    password:Yup.string().required("password is required")
  })
  let formik = useFormik({
  initialValues:{
    username:"",
    password:"",
  },
  validationSchema:mySchema,
  onSubmit:(values)=> makeAdminLogged(values)
  })
  return <>
  <Helmet>
    <title>
    El7a2ny | Admin Login
    </title>
  </Helmet>
  <div className="container login w-75 ">
      
      <form action=""  onSubmit={formik.handleSubmit} className='row text-center '>
      <div className="col-8 offset-2 m-auto bg-light my-5 rounded border shadow-sm w-auto p-4">
      <h2 className='text-muted'>Admin</h2>
      <div className="row">
          <div className="col-12  form-floating">
            <input type="string"  placeholder='Username' className='mb-2 form-control' name='username' id='username' value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
            <label className='ms-2' htmlFor="username">Username</label>
            {formik.errors.username && formik.touched.username ?<div className="alert alert-danger">{formik.errors.username}</div>: null}
          </div>
          <div className="col-12  ">
            <div className="passwordField position-relative form-floating">
              <input type={passwordShown ? "text" : "password"} placeholder='Password' className='mb-2 form-control' name='password' id='password'  onChange={formik.handleChange} onBlur={formik.handleBlur}/>
              <span onClick={togglePassword} className='togglePassword position-absolute top-0 end-0 me-3 mt-3 cursor-pointer'>{passwordShown ? <Icon className='text-danger' icon={eye}></Icon>:<Icon className='text-main' icon={eyeOff}></Icon>}</span>
              <label htmlFor="password">Password</label>
            </div>
            {formik.errors.password && formik.touched.password ?<div className="alert alert-danger">{formik.errors.password}</div>: null}
          </div>
        </div>
        <div className="col-12">
        {ErrMsg ? <div className="Err alert alert-danger">{ErrMsg}</div> : null }
        </div>
        <div className="btns col-12 my-2">
          {isLoading?
          <button type="button" className='btn bg-main text-light me-2 w-100'><i className=' fa fa-spin fa-spinner'></i></button>
          :<>
          <button type="submit" disabled={!(formik.isValid && formik.dirty)} className='btn bg-main text-light me-2 w-100 d-flex align-items-center justify-content-center'><span className='me-2'>LOG IN</span><Icon className='pb-1' size={20}  icon={login}></Icon></button>
          </>
          }
        </div>
        <div className="col-12">
          <Link id='forgetPass' to={'/AdminForgetPassword'} className="btn p-0 mb-2 text-main">Forgot password ? </Link>
        </div>

      </div>

      </form>
    </div>
  </>
}