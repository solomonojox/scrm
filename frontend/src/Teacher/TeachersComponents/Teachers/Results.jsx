import { useEffect, useState } from 'react';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASEURL;

const Students = () => {

  const [data, setData] = useState('');

  const [messageForm, setMessageForm] = useState({ text: '', type: '' });

  const [messageSubject, setMessageSubject] = useState({ text: '', type: '' });

  const [student, setStudent] = useState([]);

  const [datas, setDatas] = useState('');


  const [formData, setFormData] = useState({
    session: '',
    dateTaken: '',
    term: '',
    studentId: '',
  });

  const [formsData, setFormsData] = useState({
    subjectName: '',
    ca: '',
    exam: '',
    term: '',
    remarks: '',
    resultId: '',
    standingPercentage: '',
  });


  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  console.log("Result Data:", data);
  console.log("Subject Data:", datas);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/api/Result/AddResult`, formData);
      console.log('AddResult response:', res);
      console.log(res.data);
      setData(res.data);
      setMessageForm({ text: 'Added successfully', type: 'success' });

      setFormsData((prev) => ({
        ...prev,
        resultId: res.data.resultId || res.data.id || '',
      }));
    } catch (error) {
      console.error('error', error);
      setMessageForm({ text: 'Something went wrong. Please try again.', type: 'error' });
    }
  };


  const submitFormsData = async (e) => {
    e.preventDefault();

    const caNum = Number(formsData.ca);
    const examNum = Number(formsData.exam);
    if (isNaN(caNum) || isNaN(examNum)) {
      setMessageSubject({ text: 'CA and Exam must be valid numbers', type: 'error' });
      return;
    }

    try {
      const payload = {
        ...formsData,
        ca: caNum,
        exam: examNum,
        term: Number(formsData.term),
      };
      const res = await axios.post(`${baseUrl}/api/Result/AddSubject`, payload);
      console.log('AddSubject response:', res);
      console.log('AddSubject response data:', res.data);
      setDatas(res.data);
      setMessageSubject({ text: 'Subject added successfully', type: 'success' });
    } catch (error) {
      console.error('error', error);
      setMessageSubject({ text: 'Failed to add subject. Please try again.', type: 'error' });
    }
  };


  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/Student/GetAllStudent`);
        console.log('GetAllStudent response:', res);
        console.log('GetAllStudent response data:', res.data);
        setStudent(res.data);
      } catch (error) {
        console.error('error', error);
      }
    };
    fetchStudent();
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-14 bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Add Student Result</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label htmlFor="session" className="block text-sm font-medium text-gray-700 mb-1">
            Session
          </label>
          <select
            id="session"
            value={formData.session}
            onChange={(e) => setFormData({ ...formData, session: e.target.value })}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
            required
          >
            <option value="">Select session</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>


        <div>
          <label htmlFor="dateTaken" className="block text-sm font-medium text-gray-700 mb-1">
            Date Taken
          </label>
          <input
            type="date"
            id="dateTaken"
            value={formData.dateTaken}
            onChange={(e) => setFormData({ ...formData, dateTaken: e.target.value })}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
            required
          />
        </div>

        <div>
          <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">
            Term
          </label>
          <select
            id="term"
            value={formData.term}
            onChange={(e) => setFormData({ ...formData, term: e.target.value })}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
            required
          >
            <option value="">Select term</option>
            <option value="1">First Term</option>
            <option value="2">Second Term</option>
            <option value="3">Third Term</option>
          </select>
        </div>


        <div>
          <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
            Select Student
          </label>
          <select
            id="studentId"
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
            required
          >
            <option value="">Select Student</option>
            {student.map((s, index) => (
              <option key={index} value={s.studentId}>
                {s.firstname} {s.lastname}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-gray-500 hover:bg-gray-600 transition-colors duration-200 text-white font-semibold py-3 rounded-lg shadow-md"
        >
          Add Student Result
        </button>


        {messageForm.text && (
          <p
            className={`mt-4 text-center font-semibold ${messageForm.type === 'error' ? 'text-red-600' : 'text-green-600'
              }`}
          >
            {messageForm.text}
          </p>
        )}
      </form>


      <h2 className="text-2xl font-bold text-gray-700 mt-10 mb-6 text-center">Add Subject Result</h2>
      <form onSubmit={submitFormsData} className="space-y-6">
        <div>
          <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700 mb-1">
            Subject Name
          </label>
          <input
            id="subjectName"
            type="text"
            value={formsData.subjectName}
            onChange={(e) => setFormsData({ ...formsData, subjectName: e.target.value })}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
            required
          />
        </div>

        <div>
          <label htmlFor="ca" className="block text-sm font-medium text-gray-700 mb-1">
            CA Score
          </label>
          <input
            id="ca"
            type="text"
            value={formsData.ca}
            onChange={(e) => setFormsData({ ...formsData, ca: e.target.value })}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
            required
          />
        </div>

        <div>
          <label htmlFor="exam" className="block text-sm font-medium text-gray-700 mb-1">
            Exam Score
          </label>
          <input
            id="exam"
            type="text"
            value={formsData.exam}
            onChange={(e) => setFormsData({ ...formsData, exam: e.target.value })}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
            required
          />
        </div>

        <div>
          <label htmlFor="termSubject" className="block text-sm font-medium text-gray-700 mb-1">
            Term
          </label>
          <select
            id="termSubject"
            value={formsData.term}
            onChange={(e) => setFormsData({ ...formsData, term: e.target.value })}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
            required
          >
            <option value="">Select term</option>
            <option value="1">First Term</option>
            <option value="2">Second Term</option>
            <option value="3">Third Term</option>
          </select>
        </div>

        <div>
          <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
            Remarks
          </label>
          <select
            id="remarks"
            value={formsData.remarks}
            onChange={(e) => setFormsData({ ...formsData, remarks: e.target.value })}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
            required
          >
            <option value="">Select remarks</option>
            <option value="A">A - Excellent</option>
            <option value="B">B - Very Good</option>
            <option value="C">C - Good</option>
            <option value="D">D - Fair</option>
            <option value="E">E - Pass</option>
            <option value="F">F - Fail</option>
          </select>
        </div>


        <div>
          <label htmlFor="standingPercentage" className="block text-sm font-medium text-gray-700 mb-1">
            Standing Percentage
          </label>
          <input
            id="standingPercentage"
            type="text"
            value={formsData.standingPercentage}
            onChange={(e) => setFormsData({ ...formsData, standingPercentage: e.target.value })}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gray-500 hover:bg-gray-600 transition-colors duration-200 text-white font-semibold py-3 rounded-lg shadow-md"
        >
          Add Subject Result
        </button>


        {messageSubject.text && (
          <p
            className={`mt-4 text-center font-semibold ${messageSubject.type === 'error' ? 'text-red-600' : 'text-green-600'
              }`}
          >
            {messageSubject.text}
          </p>
        )}
      </form>
    </div>
  );
};

export default Students;
