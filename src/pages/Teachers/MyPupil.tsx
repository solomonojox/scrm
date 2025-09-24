import React, { useEffect } from 'react'
import PupilsList from './PupilsList'
import MyPupilCards from './MyPupilCards'
import { fetchTeacherFailure, fetchTeacherStart, fetchTeacherSuccess } from '../../Store/Teachers/teacherSlice';
import { AppDispatch, RootState } from '../../Store/store';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../Context/Auth/useAuth';
import { classroomService } from '../../Services/Classroom';

const MyPupil = () => {
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const [students, setStudents] = React.useState([]);
    const fetchedLoading = useSelector((state: RootState) => state.getTeacher.loading);

    // console.log(students)

    useEffect(() => {
        // if (user?.id && !fetchedLoading) {
        // }
        fetchTeacher();
    }, [user, dispatch]);

    const fetchTeacher = async () => {
        dispatch(fetchTeacherStart());

        try {
            const data = await classroomService.getClassroomByTeacherId(user?.id);
            if (data && data.length > 0) {
                const students = await classroomService.getClassroomTudentsByClassId(data[0]?.classroomId);
                // console.log(students)
                setStudents(students)
                // dispatch(fetchTeacherSuccess(students));
            }
        } catch (err: any) {
            dispatch(fetchTeacherFailure(err.message));
        }
    };
    return (
        <div>
            <MyPupilCards />
            <PupilsList students={students} />
        </div>
    )
}

export default MyPupil