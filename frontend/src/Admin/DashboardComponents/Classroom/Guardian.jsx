import React from 'react'
import assets from '../../../Assets/assets'

const Guardian = () => {
    return (
        <div className='p-6'>
            <div className="w-full h-36 bg-white p-4 rounded-lg flex items-center gap-4 relative">
                <div className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center">
                    <img
                        src={assets.avatar}
                        alt="guardian"
                        className="w-32 h-32 object-cover rounded-lg"
                    />
                </div>
                <div>
                    <p className="text-lg font-semibold">
                        John Doe
                    </p>
                    <p className="text-gray-600">johndoe@gmail.com</p>
                    <p className="text-gray-600">08150982738</p>
                    <p className="text-gray-600">24, Alakija Road, Efon</p>
                </div>
            </div>
        </div>
    )
}

export default Guardian