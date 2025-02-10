import img from '../../assets/cover.jpg'
import google from '../../assets/google.png'


const LoginPage = () => {

  return (
   
    <div className='flex justify-center my-5'>
      <img className='w-[30%] lg:flex hidden' src={img} alt="" />
      <div className='w-96 bg-base-100 shadow'>
        <div className='m-5'>
          <h2 className='text-3xl text-center text-primary'>Login</h2>
          <form action="">
            {/* ---- input email ---- */}
            <div className='form-control w-full max-w-xs'>
              <label className='label' htmlFor="">
                <span className='label-text'>Your Email</span>
              </label>
              <input type="email" 
              placeholder='Your Email'
              className='input input-bordered w-full max-w-xs'
              />
            </div>
            {/* ---- input password ---- */}
            <div className='form-control w-full max-w-xs'>
              <label className='label' htmlFor="">
                <span className='label-text'>Your Password</span>
              </label>
              <input type="password" 
              placeholder='Your Password'
              className='input input-bordered w-full max-w-xs'
              />
            </div>
            <div className='flex justify-start'> 
            <input type="submit" value="Sing in" className='btn btn-primary max-w-xs text-white w-full my-5' />
            </div>

          </form>

          <p>Are you new Here? please <a href="" className='text-primary'>SignUp</a></p>

          <div className='divider'>OR</div>
           
           <button className='btn btn-primary max-w-xs text-white w-full my-5'><img className='w-[20px]' src={google} alt="" /> Continue with Google</button>

        </div>
      </div>
    </div>

  )
}

export default LoginPage;