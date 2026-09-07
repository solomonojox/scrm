import React, { useEffect, useState } from 'react';
import imageAssets from '../../../assets/imageAssets';
import AcademicPerfomance from './AcademicPerfomance';
import AssignmentCompletion from './AssignmentCompletion';
import { useNavigate } from 'react-router-dom';
import { guardianStudentService } from '../../../Services/Guardian/guardianStudent';
import { useAuth } from '../../../Context/Auth/useAuth';
import { AppDispatch, RootState } from '../../../Store/store';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchGuardiansStudentFailure,
    fetchGuardiansStudentStart,
    fetchGuardiansStudentSuccess,
} from '../../../Store/Guardian/guardianStudentSlice';
import { paymentService } from '../../../Services/Payment';
import FeeModal from './FeeModal';
import { sessionService } from '../../../Services/Session';
import {
    fetchSessionFailure,
    fetchSessionStart,
    fetchSessionSuccess,
} from '../../../Store/sessionSlice';


/* =========================================================
   Skeleton Loader
========================================================= */

const MyPupilsSkeleton = () => {
    return (
        <div className="bg-white p-6 animate-pulse">

            {/* Student Selector */}
            <div className="mb-6">
                <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>

                <div className="w-full bg-white border border-gray-200 rounded-lg py-3 px-3 shadow-sm">
                    <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 mr-3"></div>

                        <div className="h-4 w-40 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>


            {/* Student Information */}
            <div className="flex flex-col md:flex-row justify-between gap-6">

                {/* Profile + Details */}
                <div className="flex gap-4">

                    {/* Profile Image */}
                    <div className="h-52 w-52 rounded-2xl bg-gray-200 flex-shrink-0"></div>

                    {/* Student Details */}
                    <div className="space-y-3 pt-2">

                        {/* Name */}
                        <div className="h-7 w-52 bg-gray-200 rounded"></div>

                        {/* Class */}
                        <div className="h-4 w-36 bg-gray-200 rounded"></div>

                        {/* Age */}
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>

                        {/* Status */}
                        <div className="h-4 w-44 bg-gray-200 rounded"></div>

                        {/* Button */}
                        <div className="h-9 w-32 bg-gray-200 rounded-lg mt-3"></div>

                    </div>
                </div>


                {/* Fee Balance */}
                <div className="p-4 space-y-5 shadow-lg rounded-lg w-full md:w-auto md:min-w-[300px]">

                    <div className="space-y-3">

                        {/* Title */}
                        <div className="h-5 w-52 bg-gray-200 rounded"></div>

                        {/* School Fees */}
                        <div className="h-4 w-44 bg-gray-200 rounded"></div>

                        {/* Amount Paid */}
                        <div className="h-4 w-36 bg-gray-200 rounded"></div>

                        {/* Balance */}
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>

                    </div>


                    {/* Status */}
                    <div className="space-y-2">

                        <div className="h-4 w-16 bg-gray-200 rounded"></div>

                        <div className="flex gap-2">

                            <div className="h-8 flex-1 bg-gray-200 rounded-lg"></div>

                            <div className="h-8 flex-1 bg-gray-200 rounded-lg"></div>

                        </div>

                    </div>

                </div>

            </div>


            {/* Performance / Assignment Skeleton */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">

                {/* Academic Performance */}
                <div className="h-64 bg-gray-100 rounded-lg border border-gray-200 p-4">

                    <div className="h-5 w-40 bg-gray-200 rounded"></div>

                    <div className="flex items-end gap-3 h-44 px-6 pb-5">

                        <div className="w-8 h-20 bg-gray-200 rounded-t"></div>

                        <div className="w-8 h-32 bg-gray-200 rounded-t"></div>

                        <div className="w-8 h-24 bg-gray-200 rounded-t"></div>

                        <div className="w-8 h-40 bg-gray-200 rounded-t"></div>

                        <div className="w-8 h-28 bg-gray-200 rounded-t"></div>

                    </div>

                </div>


                {/* Assignment Completion */}
                <div className="h-64 bg-gray-100 rounded-lg border border-gray-200 p-4">

                    <div className="h-5 w-44 bg-gray-200 rounded"></div>

                    <div className="flex items-center justify-center h-48">

                        <div className="h-32 w-32 rounded-full border-[18px] border-gray-200"></div>

                    </div>

                </div>

            </div>

        </div>
    );
};


/* =========================================================
   My Pupils
========================================================= */

const MyPupils = () => {

    const navigate = useNavigate();

    const { user } = useAuth();

    const [selectedIndex, setSelectedIndex] = useState(0);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    /* =====================================================
       Redux
    ===================================================== */

    const dispatch = useDispatch<AppDispatch>();

    const students: any = useSelector(
        (state: RootState) => state.getGuardianStudents.listRecords
    );

    const sessions: any = useSelector(
        (state: RootState) => state.getSession.listRecords
    );

    const loading = useSelector(
        (state: RootState) => state.getGuardianStudents.loading
    );

    const error = useSelector(
        (state: RootState) => state.getGuardianStudents.error
    );


    /* =====================================================
       Fetch Pupils
    ===================================================== */

    useEffect(() => {

        if (user) {
            fetchPupils();
        }

    }, [user]);


    const fetchPupils = async () => {

        dispatch(fetchGuardiansStudentStart());

        dispatch(fetchSessionStart());

        try {

            if (user?.id) {

                const response =
                    await guardianStudentService.getAll(user.id);

                console.log('response');

                const session =
                    await sessionService.getAllRegisteredSessions(
                        localStorage.getItem('schoolId')
                    );

                dispatch(
                    fetchGuardiansStudentSuccess(response)
                );

                dispatch(
                    fetchSessionSuccess(session)
                );

            }

        } catch (error) {

            console.error(
                'Error fetching pupils:',
                error
            );

            dispatch(
                fetchGuardiansStudentFailure(
                    (error as Error).message
                )
            );

            dispatch(
                fetchSessionFailure(
                    (error as Error).message
                )
            );

        }

    };


    /* =====================================================
       Student Selection
    ===================================================== */

    const handleStudentChange = (index: number) => {

        setSelectedIndex(index);

        setIsDropdownOpen(false);

    };


    const toggleDropdown = () => {

        setIsDropdownOpen(!isDropdownOpen);

    };


    const selectedStudent =
        students[selectedIndex];


    console.log(selectedStudent);


    /* =====================================================
       Payment State
    ===================================================== */

    const [payments, setPayments] =
        useState<any>({});

    const [classSessionFee, setClassSessionFee] =
        useState<number>(0);

    const [studentBalance, setStudentBalance] =
        useState<any>({});

    const [studentTermFee, setStudentTermFee] =
        useState<number>(0);

    const [openPaymentModal, setOpenPaymentModal] =
        useState(false);


    /* =====================================================
       Fetch Student Payment Information
    ===================================================== */

    useEffect(() => {

        fetchStudentPayments();

        getClassFeeForSession();

        getStudentPaymentBalanceSession();

    }, [selectedStudent]);


    const fetchStudentPayments = async () => {

        try {

            if (selectedStudent) {

                const sessionPayment =
                    await paymentService
                        .getStudentPaymentForSession(
                            selectedStudent?.studentId,
                            selectedStudent?.currentSession
                        );

                setPayments(sessionPayment);

            }

        } catch (error) {

            console.error(
                'Error fetching student payments:',
                error
            );

        }

    };


    const getClassFeeForSession = async () => {

        try {

            if (selectedStudent) {

                const classSeesionFee =
                    await paymentService
                        .getClassFeeForSession(
                            selectedStudent?.classroomId,
                            selectedStudent?.currentSession
                        );

                setClassSessionFee(
                    classSeesionFee
                );

            }

        } catch (error) {

            console.error(
                'Error fetching student payments:',
                error
            );

        }

    };


    const getStudentPaymentBalanceSession = async () => {

        try {

            if (selectedStudent) {

                const studentBalance =
                    await paymentService
                        .getStudentPaymentBalanceForSessiozn(
                            selectedStudent?.studentId,
                            selectedStudent?.currentSession
                        );

                const studentFees =
                    await paymentService
                        .getStudentTermFee(
                            selectedStudent?.classroomId,
                            selectedStudent?.currentSession,
                            user?.termId
                        );


                setStudentTermFee(
                    studentFees
                );

                setStudentBalance(
                    studentBalance
                );

            }

        } catch (error) {

            console.error(
                'Error fetching student payments:',
                error
            );

        }

    };


    /* =====================================================
       Loading State
    ===================================================== */

    if (loading) {

        return <MyPupilsSkeleton />;

    }


    /* =====================================================
       Error State
    ===================================================== */

    if (error) {

        return (
            <div className="flex justify-center items-center h-64 text-red-500">
                <p className="text-lg font-semibold">An error occurred while fetching student data.</p>

                {/* retry */}
                <button
                    className="ml-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    onClick={fetchPupils}
                >
                    Retry
                </button>
            </div>
        );

    }


    /* =====================================================
       Empty State
    ===================================================== */

    if (
        (!students || students.length === 0) &&
        !loading
    ) {

        return (
            <div className="flex justify-center items-center h-64">
                No students found.
            </div>
        );

    }


    return (

        <div className="bg-white p-6">


            {/* =================================================
               Student Selector
            ================================================= */}

            <div className="mb-6">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Student:
                </label>


                <div className="relative">

                    <button
                        type="button"
                        className="relative w-full bg-white border border-gray-300 rounded-lg py-3 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        onClick={toggleDropdown}
                        aria-haspopup="listbox"
                        aria-expanded={isDropdownOpen}
                    >

                        <span className="flex items-center">

                            <div className="h-8 w-8 rounded-full overflow-hidden mr-3">

                                <img
                                    src={
                                        selectedStudent?.profilePicture ||
                                        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                                    }
                                    alt="Student"
                                    className="w-full h-full object-cover"
                                />

                            </div>


                            <span className="block truncate font-medium">

                                {selectedStudent?.firstname}{' '}
                                {selectedStudent?.lastname}

                            </span>

                        </span>


                        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">

                            <svg
                                className="h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >

                                <path
                                    fillRule="evenodd"
                                    d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />

                            </svg>

                        </span>

                    </button>


                    {/* Dropdown */}

                    {isDropdownOpen && (

                        <ul
                            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                            role="listbox"
                            tabIndex={-1}
                        >

                            {students.map(
                                (
                                    student: any,
                                    index: number
                                ) => (

                                    <li
                                        key={index}
                                        className={`text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-orange-50 ${
                                            selectedIndex === index
                                                ? 'bg-orange-100'
                                                : ''
                                        }`}
                                        role="option"
                                        aria-selected={
                                            selectedIndex === index
                                        }
                                        onClick={() =>
                                            handleStudentChange(
                                                index
                                            )
                                        }
                                    >

                                        <div className="flex items-center">

                                            <div className="h-6 w-6 rounded-full overflow-hidden flex-shrink-0 mr-3">

                                                <img
                                                    src={
                                                        student.profilePicture ||
                                                        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                                                    }
                                                    alt="Student"
                                                    className="w-full h-full object-cover"
                                                />

                                            </div>


                                            <span className="font-normal block truncate">

                                                {student.firstname}{' '}
                                                {student.lastname}

                                            </span>

                                        </div>


                                        {selectedIndex === index && (

                                            <span className="text-orange-600 absolute inset-y-0 right-0 flex items-center pr-4">

                                                <svg
                                                    className="h-5 w-5"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >

                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />

                                                </svg>

                                            </span>

                                        )}

                                    </li>

                                )
                            )}

                        </ul>

                    )}

                </div>

            </div>


            {/* =================================================
               Student Information
            ================================================= */}

            <div className="flex flex-col md:flex-row justify-between">

                <div className="flex gap-4">

                    {/* Student Image */}

                    <div className="h-52 w-52 rounded-2xl overflow-hidden">

                        <img
                            src={
                                selectedStudent?.profilePicture ||
                                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                            }
                            alt="Student"
                            className="w-full h-full object-cover"
                        />

                    </div>


                    {/* Student Details */}

                    <div className="space-y-1">

                        <h1 className="text-2xl font-semibold">

                            {selectedStudent?.firstname}{' '}
                            {selectedStudent?.lastname}

                        </h1>


                        <p className="text-gray-500">

                            Class:{' '}
                            {selectedStudent?.classroom?.name}

                        </p>


                        <p className="text-gray-500">

                            Age:{' '}

                            {selectedStudent?.dateOfBirth
                                ? (() => {

                                    const dob =
                                        new Date(
                                            selectedStudent.dateOfBirth
                                        );

                                    const today =
                                        new Date();

                                    let age =
                                        today.getFullYear() -
                                        dob.getFullYear();

                                    const m =
                                        today.getMonth() -
                                        dob.getMonth();

                                    if (
                                        m < 0 ||
                                        (
                                            m === 0 &&
                                            today.getDate() <
                                                dob.getDate()
                                        )
                                    ) {
                                        age--;
                                    }

                                    return age;

                                })()
                                : ''
                            }

                            {selectedStudent?.dateOfBirth &&
                                ' years'}

                        </p>


                        <p className="text-gray-500">

                            Current Status:{' '}
                            {selectedStudent?.attendanceStatus}

                        </p>


                        <button
                            className="rounded-lg py-1 px-6 text-white bg-orange-500 hover:bg-orange-600 transition-colors mt-2"
                            onClick={() =>
                                navigate(
                                    `/guardian/pupil/profile`,
                                    {
                                        state: selectedStudent,
                                    }
                                )
                            }
                        >

                            View Profile

                        </button>

                    </div>

                </div>


                {/* =================================================
                   Fee Information
                ================================================= */}

                <div className="p-4 space-y-4 shadow-lg rounded-lg">

                    <div className="space-y-1">

                        <h1 className="text-lg font-semibold">
                            Fee Balance/Payment Status
                        </h1>


                        <p className="text-gray-700">

                            Session School Fees: N
                            {studentTermFee?.toLocaleString() ||
                                '0.00'}

                        </p>


                        <p className="text-green-500">

                            Amount Paid: N
                            {studentBalance?.totalPaid}

                        </p>


                        <p className="text-gray-500">

                            Balance: N
                            {studentBalance?.balance?.toLocaleString() ||
                                '0.00'}

                        </p>

                    </div>


                    <div className="space-y-2">

                        <p className="text-orange-500">
                            Status
                        </p>


                        {studentBalance?.balance > 0 ? (

                            <div className="flex flex-col md:flex-row gap-2">

                                <span className="rounded-lg px-6 py-1 bg-red-500 text-white w-full text-center">

                                    Pending

                                </span>


                                <button
                                    className="rounded-lg px-6 py-1 bg-purple-500 hover:bg-purple-700 text-white w-full"
                                    onClick={() =>
                                        setOpenPaymentModal(true)
                                    }
                                >

                                    Pay Now

                                </button>

                            </div>

                        ) : (

                            <span className="rounded-lg px-6 py-1 bg-green-600 text-white">

                                Paid

                            </span>

                        )}

                    </div>

                </div>

            </div>


            {/* =================================================
               Academic Performance / Assignments
            ================================================= */}

            <div className="grid md:grid-cols-2 gap-4 mt-4">

                <AcademicPerfomance />

                <AssignmentCompletion />

            </div>


            {/* =================================================
               Fee Modal
            ================================================= */}

            <FeeModal
                onClose={() =>
                    setOpenPaymentModal(false)
                }
                open={openPaymentModal}
                studentId={
                    selectedStudent?.studentId
                }
                classroomId={
                    selectedStudent?.classroomId
                }
                sessionId={
                    selectedStudent?.currentSession
                }
                paymentTerm={
                    selectedStudent?.currentTerm
                }
            />

        </div>

    );
};


export default MyPupils;
