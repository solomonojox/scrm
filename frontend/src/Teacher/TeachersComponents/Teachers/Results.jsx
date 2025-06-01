import { useEffect, useState } from 'react';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASEURL;

const Students = () => {
  // ───────────────────────────────────────────────────────────────────────────
  // 1) State for “Add Result” response
  const [data, setData] = useState('');

  // 2) State to hold all existing results (GET /api/Result/GetAllStudentsResult)
  const [allResults, setAllResults] = useState([]);

  // 3) Messages for “Add Result” and “Add Subject”
  const [messageForm, setMessageForm] = useState({ text: '', type: '' });
  const [messageSubject, setMessageSubject] = useState({ text: '', type: '' });

  // 4) All students (for populating the student dropdown)
  const [student, setStudent] = useState([]);

  // 5) formData for “Add Result”
  const [formData, setFormData] = useState({
    session: '',
    dateTaken: '',
    term: '',
    studentId: '',
  });

  // 6) formsData for “Add Subject”
  const [formsData, setFormsData] = useState({
    subjectName: '',
    ca: '',
    exam: '',
    term: '',
    remarks: '',
    resultId: '',
    standingPercentage: '',
  });

  // Convenience: next 10 years
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  // ───────────────────────────────────────────────────────────────────────────
  // Clear “Add Result” message after 3s
  useEffect(() => {
    if (!messageForm.text) return;
    const id = setTimeout(() => setMessageForm({ text: '', type: '' }), 3000);
    return () => clearTimeout(id);
  }, [messageForm.text]);

  // Clear “Add Subject” message after 3s
  useEffect(() => {
    if (!messageSubject.text) return;
    const id = setTimeout(() => setMessageSubject({ text: '', type: '' }), 3000);
    return () => clearTimeout(id);
  }, [messageSubject.text]);

  // ───────────────────────────────────────────────────────────────────────────
  // 1) Fetch all students on mount
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/Student/GetAllStudent`);
        setStudent(res.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudent();
  }, []);

  // 2) Fetch all results on mount
  useEffect(() => {
    const fetchAllResults = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/Result/GetAllStudentsResult`);
        setAllResults(res.data || []);
      } catch (error) {
        console.error('Error fetching all results:', error);
      }
    };
    fetchAllResults();
  }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // Handle “Add Student Result”
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${baseUrl}/api/Result/AddResult`, formData);
      console.log('AddResult response:', res.data);
      setData(res.data);
      setMessageForm({ text: 'Result added successfully', type: 'success' });

      // Grab the new resultId (adjust if your backend returns a different property)
      const newResultId = res.data.resultId || res.data.id || '';
      setFormsData((prev) => ({
        ...prev,
        resultId: newResultId.toString(),
      }));

      // Also insert this new result into allResults so the dropdown stays up-to-date
      if (newResultId) {
        const matchedStudent = student.find((s) => s.studentId === formData.studentId);
        setAllResults((prev) => [
          ...prev,
          {
            resultId: newResultId,
            studentId: formData.studentId,
            session: formData.session,
            term: formData.term,
            dateTaken: formData.dateTaken,
            // Provide a nested student object so we can show firstname/lastname later
            student: {
              firstname: matchedStudent?.firstname || '',
              lastname: matchedStudent?.lastname || '',
            },
          },
        ]);
      }
    } catch (error) {
      console.error('Error in AddResult:', error);
      setMessageForm({
        text: 'Something went wrong adding the result. Please try again.',
        type: 'error',
      });
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Handle “Add Subject”
  const submitFormsData = async (e) => {
    e.preventDefault();

    // Convert numeric fields
    const caNum = Number(formsData.ca);
    const examNum = Number(formsData.exam);
    const termNum = Number(formsData.term);
    const standingNum = Number(formsData.standingPercentage);

    if (isNaN(caNum) || isNaN(examNum) || isNaN(termNum) || isNaN(standingNum)) {
      setMessageSubject({ text: 'CA, Exam, Term, and Standing must be valid numbers', type: 'error' });
      return;
    }
    if (!formsData.resultId) {
      setMessageSubject({ text: 'Please select a Result before adding a subject.', type: 'error' });
      return;
    }

    try {
      const payload = {
        subjectName: formsData.subjectName,
        ca: caNum,
        exam: examNum,
        term: termNum,
        remarks: formsData.remarks,
        resultId: formsData.resultId,            // string GUID is fine
        standingPercentage: standingNum,
      };

      // Log payload so you can inspect it in console if “Bad Request” persists:
      console.log('AddSubject payload:', payload);

      const res = await axios.post(`${baseUrl}/api/Result/AddSubject`, payload);
      console.log('AddSubject response:', res.data);
      setMessageSubject({ text: 'Subject added successfully', type: 'success' });

      // Clear only the subject-fields, but keep resultId so user can add multiple subjects
      setFormsData((prev) => ({
        ...prev,
        subjectName: '',
        ca: '',
        exam: '',
        term: '',
        remarks: '',
        standingPercentage: '',
        // keep resultId
      }));
    } catch (error) {
      console.error('Error in AddSubject:', error);
      setMessageSubject({
        text: 'Failed to add subject. Please check your input and try again.',
        type: 'error',
      });
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Filter to only those results belonging to the chosen student in “Add Result”
  const availableResultsForThisStudent = allResults.filter(
    (r) => String(r.studentId) === String(formData.studentId)
  );

  return (
    <div className="max-w-6xl mx-auto mt-14 p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Wrap both forms side by side */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* ─────────── LEFT: Add Student Result ─────────── */}
        <div className="flex-1 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            Add Student Result
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Session */}
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

            {/* Date Taken */}
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

            {/* Term */}
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

            {/* Select Student */}
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                Select Student
              </label>
              <select
                id="studentId"
                value={formData.studentId}
                onChange={(e) => {
                  // whenever student changes, clear any prior resultId
                  setFormData((prev) => ({ ...prev, studentId: e.target.value }));
                  setFormsData((prev) => ({ ...prev, resultId: '' }));
                }}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                required
              >
                <option value="">Select Student</option>
                {student.map((s) => (
                  <option key={s.studentId} value={s.studentId}>
                    {s.firstname} {s.lastname}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white font-semibold py-3 rounded-lg shadow-md"
            >
              Add Student Result
            </button>

            {messageForm.text && (
              <p
                className={`mt-4 text-center font-semibold ${
                  messageForm.type === 'error' ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {messageForm.text}
              </p>
            )}
          </form>
        </div>

        {/* ─────────── RIGHT: Add Subject Result ─────────── */}
        <div className="flex-1 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            Add Subject Result
          </h2>
          <form onSubmit={submitFormsData} className="space-y-6">
            {/* Select which existing result this subject belongs to */}
            <div>
              <label htmlFor="selectResult" className="block text-sm font-medium text-gray-700 mb-1">
                Select Result
              </label>
              <select
                id="selectResult"
                value={formsData.resultId}
                onChange={(e) =>
                  setFormsData((prev) => ({ ...prev, resultId: e.target.value }))
                }
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                required
              >
                <option value="">Select a Result</option>
                {availableResultsForThisStudent.map((r) => (
                  <option key={r.resultId} value={r.resultId}>
                    {r.student?.firstname} {r.student?.lastname} 
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Name */}
            <div>
              <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700 mb-1">
                Subject Name
              </label>
              <input
                id="subjectName"
                type="text"
                value={formsData.subjectName}
                onChange={(e) =>
                  setFormsData((prev) => ({ ...prev, subjectName: e.target.value }))
                }
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                required
              />
            </div>

            {/* CA Score */}
            <div>
              <label htmlFor="ca" className="block text-sm font-medium text-gray-700 mb-1">
                CA Score
              </label>
              <input
                id="ca"
                type="number"
                value={formsData.ca}
                onChange={(e) =>
                  setFormsData((prev) => ({ ...prev, ca: e.target.value }))
                }
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                required
              />
            </div>

            {/* Exam Score */}
            <div>
              <label htmlFor="exam" className="block text-sm font-medium text-gray-700 mb-1">
                Exam Score
              </label>
              <input
                id="exam"
                type="number"
                value={formsData.exam}
                onChange={(e) =>
                  setFormsData((prev) => ({ ...prev, exam: e.target.value }))
                }
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                required
              />
            </div>

            {/* Term (for this subject) */}
            <div>
              <label htmlFor="termSubject" className="block text-sm font-medium text-gray-700 mb-1">
                Term
              </label>
              <select
                id="termSubject"
                value={formsData.term}
                onChange={(e) =>
                  setFormsData((prev) => ({ ...prev, term: e.target.value }))
                }
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                required
              >
                <option value="">Select term</option>
                <option value="1">First Term</option>
                <option value="2">Second Term</option>
                <option value="3">Third Term</option>
              </select>
            </div>

            {/* Remarks */}
            <div>
              <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <select
                id="remarks"
                value={formsData.remarks}
                onChange={(e) =>
                  setFormsData((prev) => ({ ...prev, remarks: e.target.value }))
                }
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                required
              >
                <option value="">Select remarks</option>
                <option value="A">A — Excellent</option>
                <option value="B">B — Very Good</option>
                <option value="C">C — Good</option>
                <option value="D">D — Fair</option>
                <option value="E">E — Pass</option>
                <option value="F">F — Fail</option>
              </select>
            </div>

            {/* Standing Percentage */}
            <div>
              <label htmlFor="standingPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                Standing Percentage
              </label>
              <input
                id="standingPercentage"
                type="number"
                value={formsData.standingPercentage}
                onChange={(e) =>
                  setFormsData((prev) => ({
                    ...prev,
                    standingPercentage: e.target.value,
                  }))
                }
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white font-semibold py-3 rounded-lg shadow-md"
            >
              Add Subject Result
            </button>

            {messageSubject.text && (
              <p
                className={`mt-4 text-center font-semibold ${
                  messageSubject.type === 'error' ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {messageSubject.text}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Students;
