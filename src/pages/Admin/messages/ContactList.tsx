import React, { useEffect } from "react";
import { TeacherType } from "../../../Types/Teacher/teacherType";
import { useAuth } from "../../../Context/Auth/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import {
  fetchMessageFailure,
  fetchMessageStart,
  fetchMessageSuccess,
} from "../../../Store/messageSlice";
import { messageService } from "../../../Services/message";
import { Guardian } from "../../../Types/Guardian/guardianTypes";

interface Props {
  teachers: TeacherType[];
  selectedTeacher: TeacherType | null;
  onSelectTeacher: (teacher: TeacherType) => void;
  selectedGuardian: Guardian | null;
  onSelectGuardian: (guardian: Guardian) => void;
  guardians: Guardian[]; // ✅ can be object or array
}

const ContactList: React.FC<Props> = ({
  teachers,
  selectedTeacher,
  onSelectTeacher,
  guardians,
  selectedGuardian,
  onSelectGuardian,
}) => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector((state: RootState) => state.getMessage.listRecords);
  const loading = useSelector((state: RootState) => state.getGuardianStudents.loading);
  const error = useSelector((state: RootState) => state.getGuardianStudents.error);

  // ✅ Normalize guardians into an array
  const adminList: Guardian[] = Array.isArray(guardians) ? guardians : guardians ? [guardians] : [];

  // Fetch messages for all teachers when component mounts or teachers list changes
  useEffect(() => {
    if (user && teachers.length > 0) {
      fetchAllTeacherMessages();
    }
  }, [dispatch, user, teachers.length]);

  const fetchAllTeacherMessages = async () => {
    dispatch(fetchMessageStart());
    try {
      let allMessages: any = [];
      const messagePromises = teachers.map((teacher) =>
        messageService.getMessageByUserId(teacher.teacherId, teacher.role)
      );
      const messagesByTeacher = await Promise.all(messagePromises);
      allMessages = messagesByTeacher.flat();
      dispatch(fetchMessageSuccess(allMessages));
    } catch (error) {
      console.error("Error fetching messages:", error);
      dispatch(fetchMessageFailure((error as Error).message));
    }
  };

  const sortMessagesAsc = (messages: any[]) => {
    if (!Array.isArray(messages)) return [];
    return [...messages].sort(
      (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
    );
  };

  const getUnreadCount = (id: any) => {
    if (!Array.isArray(messages)) return 0;
    return messages.filter(
      (msg) => (msg.senderId === id || msg.receiverId === id) && msg.isRead === false
    ).length;
  };

  const getLastMessage = (id: any) => {
    if (!Array.isArray(messages)) return "No messages";
    const filteredMessages = messages.filter((msg) => msg.senderId === id || msg.receiverId === id);
    if (filteredMessages.length === 0) return "No messages";

    const sortedMessages = sortMessagesAsc(filteredMessages);
    const lastMessage = sortedMessages[sortedMessages.length - 1];
    return lastMessage?.content || "No messages";
  };

  return (
    <div className="w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">All Messages</h2>
          {loading && <span className="text-sm text-gray-500">Loading...</span>}
        </div>
      </div>

      {/* Error display */}
      {error && <div className="p-4 bg-red-100 text-red-700">Error loading messages: {error}</div>}

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto">
        {/* ✅ Guardian */}
        {guardians.map((guardian) => {
          const unreadCount = getUnreadCount(guardian.guardianId);
          const lastMessage = getLastMessage(guardian.guardianId);

          return (
            <div
              key={guardian.guardianId}
              onClick={() => onSelectGuardian(guardian)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 mt-2 transition-colors 
                ${selectedGuardian?.guardianId === guardian.guardianId ? "bg-blue-100" : ""}
                ${unreadCount > 0 ? "" : ""}`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${guardian.firstname}`}
                    alt={guardian.firstname}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                  />
                  {guardian.firstname && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`font-medium truncate text-sm lg:text-base ${
                        unreadCount > 0 ? "text-gray-900 font-semibold" : "text-gray-900"
                      }`}
                    >
                      {guardian.firstname} {guardian.lastname}
                    </h3>
                    <span className="text-xs font-semibold px-2 bg-orange-100 rounded-full text-orange-500">
                      {"Duardian"}
                    </span>
                  </div>
                  <p
                    className={`text-xs lg:text-sm truncate mt-1 ${
                      unreadCount > 0 ? "text-gray-800 font-medium" : "text-gray-600"
                    }`}
                  >
                    {lastMessage}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* ✅ Teachers */}
        {teachers.map((teacher) => {
          const unreadCount = getUnreadCount(teacher.teacherId);
          const lastMessage = getLastMessage(teacher.teacherId);

          return (
            <div
              key={teacher.teacherId}
              onClick={() => onSelectTeacher(teacher)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 mt-2 transition-colors 
                ${selectedTeacher?.teacherId === teacher.teacherId ? "bg-blue-100" : ""}
                ${unreadCount > 0 ? "" : ""}`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${teacher.firstname}`}
                    alt={teacher.firstname}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                  />
                  {teacher.firstname && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`font-medium truncate text-sm lg:text-base ${
                        unreadCount > 0 ? "text-gray-900 font-semibold" : "text-gray-900"
                      }`}
                    >
                      {teacher.firstname} {teacher.lastname}
                    </h3>
                    <span className="text-xs font-semibold px-2 bg-green-100 rounded-full text-green-500">
                      {"Teacher"}
                    </span>
                  </div>
                  <p
                    className={`text-xs lg:text-sm truncate mt-1 ${
                      unreadCount > 0 ? "text-gray-800 font-medium" : "text-gray-600"
                    }`}
                  >
                    {lastMessage}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactList;
