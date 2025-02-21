import React from 'react'
import StudentFeePaymentTable from './StudentFeePaymentTable'

const SchoolFees = ({studentId}) => {
  return (
    <div>
        <StudentFeePaymentTable studentId={studentId}/>
    </div>
  )
}

export default SchoolFees