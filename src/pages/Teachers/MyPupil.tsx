import React, { useEffect } from 'react'
import PupilsList from './PupilsList'
import MyPupilCards from './MyPupilCards'
import { fetchTeacherFailure, fetchTeacherStart, fetchTeacherSuccess } from '../../Store/Teachers/teacherSlice';
import { AppDispatch, RootState } from '../../Store/store';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../Context/Auth/useAuth';
import { classroomService } from '../../Services/Classroom';
import { fetchClassroomsSuccess } from '../../Store/Admin/classroomSlice';

const MyPupil = () => {
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const [students, setStudents] = React.useState([]);
    const fetchedLoading = useSelector((state: RootState) => state.getTeacher.loading);
    const classrooms = useSelector((state: RootState) => state.getClassrooms.listRecords);

    // console.log(classrooms)

    useEffect(() => {
        // if (user?.id && !fetchedLoading) {
        // }
        fetchTeacher();
    }, [user, dispatch]);

    const fetchTeacher = async () => {
        dispatch(fetchTeacherStart());

        try {
            const data = await classroomService.getClassroomByTeacherId(user?.id);
            // console.log(data)
            if (data && data.length > 0) {
                const students = await classroomService.getClassroomTudentsByClassId(data[0]?.classroomId);
                // console.log(students)
                setStudents(students)
            }
            dispatch(fetchClassroomsSuccess(data));
        } catch (err: any) {
            dispatch(fetchTeacherFailure(err.message));
        }
    };
    return (
        <div>
            {/* <MyPupilCards /> */}
            <PupilsList classrooms={classrooms} students={students} />
        </div>
    )
}

export default MyPupil