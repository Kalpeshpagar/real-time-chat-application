import React, { useContext } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {
  const [currState, setCurrState] = React.useState('Sign up') // login, signup, forgotpassword
  const [fullName, setFullName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [bio, setBio] = React.useState('')
  const [isDataSubmitted, setIsDataSubmitted] = React.useState(false)

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (currState === 'Sign up' && !isDataSubmitted) {
      // submit the signup data
      setIsDataSubmitted(true);
      return;
    } 
    login(currState === 'Sign up' ? 'signup' : 'login',{fullName, email, password, bio})
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center 
    justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* ------------ left side ------------ */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw, 250px)] ' />

      {/* -------------- right side ------------  */}
       
      <form onSubmit={onSubmitHandler} action="" className='border-2 bg-white/8 text-white border-gray-500 p-6 flex 
      flex-col gap-6rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && <img onClick={()=> setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />}
          <img src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />
        </h2>

        {currState === 'Sign up' && !isDataSubmitted && (
          <input type="text" onChange={(e)=> setFullName(e.target.value)} value={fullName} className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='
        Full Name' required />
        )}

        {!isDataSubmitted && (
          <>
            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} required
              placeholder='Email address' className='p-2 border border-gray-500 rounded-md focus:outline-none 
           focus:ring-2 focus:ring-indigo-500'  />
            
             <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} required
              placeholder='Password' className='p-2 border border-gray-500 rounded-md focus:outline-none 
           focus:ring-2 focus:ring-indigo-500'  />
          </>
        )}

        {currState === 'Sign up' && isDataSubmitted && (
          <textarea rows="4" onChange={(e) => setBio(e.target.value)} value={bio}
            placeholder='Bio' className='p-2 border border-gray-500 rounded-md focus:outline-none 
           focus:ring-2 focus:ring-indigo-500' ></textarea>
        )}

        <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600
         text-white py-3 rounded-md cursor-pointer'
         >{
          currState === 'Sign up' ? 'Create Account' : 'Login Now'
          }</button>
        
        <div className='text-sm text-gray-500 flex items-center gap-2'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currState === 'Sign up' ? (
            <p className='text-sm text-gray-600'>Already have an account? <span onClick={()=>setCurrState('Login')}
            className='font-medium text-violet-500 cursor-pointer'>Login here</span></p>
          ) : (
              <p className='text-sm text-gray-600'>Create an account <span onClick={() => setCurrState('Sign up')}
               className='font-medium text-violet-500 cursor-pointer'>Click here</span></p>
          )
          
          }
        </div>

      </form>
    </div>
  )
}

export default LoginPage
