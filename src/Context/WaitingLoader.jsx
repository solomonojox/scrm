import { useContext } from 'react';
import { AppContext } from './AppContext';

import '../Styles/loader2.css'

function WaitingLoader() {
  const { isOverlayVisible } = useContext(AppContext);

  if (!isOverlayVisible) return null;
  
  return (
    <div className='flex fixed z-50 top-0 left-0 items-center justify-center w-full h-[100vh] bg-[#ffffffb3]'>
      <div>
        <div className=' flex flex-col'>
          <div className="waiting-loader"></div>
        </div>
      </div>
    </div>
  )
}

export default WaitingLoader