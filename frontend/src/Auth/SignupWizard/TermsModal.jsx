import React from 'react';
import assets from "../../Assets/assets";
const TermsModal = ({ isOpen, onAgree, onDecline }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-xl shadow-lg p-8 w-full max-w-5xl max-h-[90vh] overflow-hidden">
        
       
        <button
          onClick={onDecline}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          &times;
        </button>
             
     <div className="flex items-center mb-4">
  <img
    src={assets.scrm}
    alt="SCRM Logo"
    className="w-12 h-12.5 mr-4"
  />
  <h2 className="text-2xl  text-center font-semibold">
    Terms and Conditions for School Registration
  </h2>
</div>


       
        <div className="text-md text-gray-800 overflow-y-auto pr-4 space-y-4" style={{ maxHeight: '65vh' }}>
          <p><strong>Effective Date:</strong> [Insert Date]</p>
          <p>Welcome to EduCat (“Platform”, “We”, “Us”, “Our”). These Terms and Conditions (“Terms”) govern the registration and use of EduCat by schools, institutions, and their authorized representatives (“School”, “You”, “Your”). By registering your school on EduCat, you agree to comply with and be bound by these Terms.</p>
          
          <h3 className="font-semibold">1. Registration is Free</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Registration of schools on EduCat is completely free of charge.</li>
            <li>No upfront or setup fees are required to create a School account.</li>
            <li>Registration grants access to EduCat’s onboarding process and management tools.</li>
          </ul>

          <h3 className="font-sem`ibold">2. Usage Fees</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>EduCat operates a pay-per-term model.</li>
            <li>Schools will be charged a fee of ₦500 (Five Hundred Naira) per student, per academic term.</li>
            <li>Charges are calculated based on the total number of active student records for each term.</li>
            <li>Once a student is registered for a given term, the corresponding fee becomes due and payable for that term, regardless of student withdrawal or transfer after registration.</li>
            <li>Payment schedules, invoices, and account statements will be made available on the Platform.</li>
            <li>All payments must be made in accordance with EduCat’s billing policies and timelines.</li>
            <li>Failure to settle outstanding invoices may result in account suspension, limited access to features, or termination of service.</li>
          </ul>

          <h3 className="font-semibold">3. Eligibility</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Only authorized representatives of properly accredited schools or recognized educational institutions may register on EduCat.</li>
            <li>The person completing the registration confirms that they have legal authority to enter into this agreement on behalf of the School.</li>
          </ul>

          <h3 className="font-semibold">4. Account Setup and Verification</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Schools are required to provide complete, accurate, and verifiable information during the registration process.</li>
            <li>EduCat reserves the right to request official documents to verify the identity, accreditation status, or ownership of the school.</li>
            <li>Schools are responsible for keeping their account information current.</li>
          </ul>

          <h3 className="font-semibold">5. Acceptance of Terms</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>By registering, the School acknowledges that it has read, understood, and agreed to these Terms.</li>
            <li>If the School does not agree to any part of these Terms, registration should not proceed.</li>
          </ul>

          <h3 className="font-semibold">6. Use of Platform</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>EduCat provides tools to manage students, staff, academic records, and other school operations.</li>
            <li>The School is solely responsible for all activities conducted through its account.</li>
            <li>The School agrees not to misuse or abuse the Platform, violate laws, infringe rights, or interfere with system integrity.</li>
          </ul>

          <h3 className="font-semibold">7. Data Privacy</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>EduCat is committed to protecting the privacy and confidentiality of school and student data.</li>
            <li>Data collected is used strictly for providing services, account management, analytics, and platform improvement.</li>
            <li>Full data handling procedures are outlined in our Privacy Policy.</li>
          </ul>

          <h3 className="font-semibold">8. Intellectual Property</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>All software, designs, content, and intellectual property of EduCat remain the sole property of EduCat.</li>
            <li>Schools are granted a limited, non-exclusive, non-transferable license to use the Platform strictly in accordance with these Terms.</li>
          </ul>

          <h3 className="font-semibold">9. Termination and Suspension</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>EduCat reserves the right to suspend or terminate accounts that violate these Terms, breach payment obligations, or engage in misuse or illegal activity.</li>
            <li>Schools may request termination of their account at any time, subject to settlement of any outstanding payments.</li>
          </ul>

          <h3 className="font-semibold">10. Modifications</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>EduCat reserves the right to update or modify these Terms at any time.</li>
            <li>Notice of material changes will be provided via email or Platform notifications.</li>
            <li>Continued use of the Platform after such changes constitutes acceptance of the revised Terms.</li>
          </ul>

          <h3 className="font-semibold">11. Limitation of Liability</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>EduCat shall not be liable for any indirect, incidental, or consequential damages arising from your use or inability to use the Platform.</li>
            <li>EduCat’s total liability shall not exceed the amount of fees paid by the School for the specific term or service period in question.</li>
          </ul>

          <h3 className="font-semibold">12. Governing Law</h3>
          <p>These Terms shall be governed by and interpreted in accordance with the laws of the Federal Republic of Nigeria.</p>

          <h3 className="font-semibold">13. Contact Information</h3>
          <p>
            For support or inquiries, please contact: <br />
            <strong>Email:</strong> info@educat.com.ng <br />
            <strong>Phone:</strong> +2347026790425
          </p>
          <p className="mt-4 font-medium">
            By clicking “Accept”, you confirm that you have read, understood, and agreed to abide by these Terms and Conditions.
          </p>
        </div>

        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onDecline}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Decline
          </button>
          <button
            onClick={onAgree}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;