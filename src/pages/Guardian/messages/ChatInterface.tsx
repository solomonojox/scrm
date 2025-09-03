import React, { useEffect, useRef, useState } from "react";
import { Phone, Mic, Send, Paperclip, ArrowLeft } from "lucide-react";
import CameraInterface from "../../../components/Guardian/messages/modal/CameraInterface";
import PictureGallery from "../../../components/Guardian/messages/modal/PictureGallery";
import AttachmentMenu from "../../../components/Guardian/messages/modal/AttachmentMenu";
import VoiceRecordingInterface from "../../../components/Guardian/messages/modal/VoiceRecordingInterface";
import { TeacherType } from "../../../Types/Teacher/teacherType";
import { messageService } from "../../../Services/message";
import { useAuth } from "../../../Context/Auth/useAuth";
import { MessageType } from "../../../Types/message";
import {
  fetchMessageFailure,
  fetchMessageStart,
  fetchMessageSuccess,
} from "../../../Store/messageSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";

interface Props {
  selectedTeacher: TeacherType | null;
  onStartCall: () => void;
  onStartRecording: () => void;
  onBack: () => void;
}

const ChatInterface: React.FC<Props> = ({
  selectedTeacher,
  onStartCall,
  onStartRecording,
  onBack,
}) => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const message: any = useSelector((state: RootState) => state.getMessage.listRecords);
  const loading = useSelector((state: RootState) => state.getGuardianStudents.loading);
  const error = useSelector((state: RootState) => state.getGuardianStudents.error);

  useEffect(() => {
    if (!loading || user || selectedTeacher) {
      fetchMessage();
    }
  }, [dispatch, user, selectedTeacher, trigger]);

  const fetchMessage = async () => {
    dispatch(fetchMessageStart());

    try {
      if (selectedTeacher) {
        const messageResponse = await messageService.getMessageByUserId(
          selectedTeacher?.teacherId,
          selectedTeacher?.role
        );

        dispatch(fetchMessageSuccess(messageResponse));
      }
    } catch (error) {
      console.error("Error fetching pupils:", error);
      dispatch(fetchMessageFailure((error as Error).message));
    }
  };

  const sortMessagesAsc = (messages: any[]) => {
    if (!Array.isArray(messages)) return [];
    return [...messages].sort((a, b) => {
      return new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime();
    });
  };

  const sortedMessage = sortMessagesAsc(message);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessage]);

  if (!selectedTeacher) {
    return (
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50 p-4">
        <p className="text-gray-500 text-base">Select an admin or teacher to start chatting</p>
      </div>
    );
  }

  const payload = {
    senderId: user?.id,
    senderRole: user?.role,
    receiverId: selectedTeacher?.teacherId,
    receiverRole: selectedTeacher?.role,
    content: newMessage,
  };

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      return;
    }

    try {
      const res = await messageService.create(payload);
      //   console.log(res)
      if (res.status === true) {
        setTrigger((prev) => !prev);
        setNewMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStopRecording = () => setIsRecording(false);

  const handleAttachmentSelect = (type: string) => {
    setShowAttachments(false);
    if (type === "camera") setShowCamera(true);
    if (type === "gallery") setShowGallery(true);
  };

  function formatTime(isoString: string): string {
    const d = new Date(isoString);

    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12

    return `${hours}:${minutes} ${ampm}`;
  }

  return (
    <div className="relative flex-1 flex flex-col bg-white">
      {/* Back button (mobile only) */}
      {onBack && (
        <button
          onClick={onBack}
          className="lg:hidden flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      )}

      {/* Header */}
      <div className="px-4 py-2 border-b border-gray-200 bg-orange-100">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <img
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${selectedTeacher?.firstname}`}
              alt={selectedTeacher.firstname}
              className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium text-gray-900 text-sm lg:text-base">
                {selectedTeacher.firstname} {selectedTeacher.lastname}
              </h3>
              <p className="text-xs lg:text-sm text-gray-600">Online 2 hrs ago</p>
            </div>
          </div>
          <Phone
            className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600 cursor-pointer hover:text-orange-600 transition-colors"
            onClick={onStartCall}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto parent-scrollbar p-3 lg:p-4 space-y-3 lg:space-y-4">
        {sortedMessage.map((m) => (
          <div
            key={m.messageId}
            className={`flex ${m.senderRole === "Guardian" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] lg:max-w-xs px-3 lg:px-4 py-2 rounded-lg ${
                m.senderRole === "Guardian"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {m.type === "voice" ? (
                <div className="flex items-center gap-2 lg:gap-3 min-w-28 lg:min-w-40">
                  <button className="w-7 h-7 lg:w-8 lg:h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                    <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-b-2 border-t-transparent border-b-transparent ml-1"></div>
                  </button>
                  <span className="text-xs">{m.duration || "0:15"}</span>
                </div>
              ) : m.type === "image" ? (
                <img src={m.imageUrl} alt="Shared" className="max-w-32 lg:max-w-48 rounded-lg" />
              ) : (
                <p className="text-xs lg:text-sm whitespace-pre-line">{m?.content}</p>
              )}
              <div
                className={`text-[10px] lg:text-xs mt-1 ${
                  m.senderRole === "Guardian" ? "text-orange-100" : "text-gray-500"
                }`}
              >
                {formatTime(m.sentAt)}
                {m.isRead === true && <span className="ml-2 text-orange-200">Seen</span>}
              </div>
            </div>
          </div>
        ))}
        {/* invisible marker to scroll into */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 lg:p-4 border-t border-gray-200 flex items-center gap-2 relative"
      >
        <button
          title="Attachment"
          onClick={() => setShowAttachments((prev) => !prev)}
          className="p-1 lg:p-2 text-gray-400 hover:text-gray-600"
        >
          <Paperclip className="w-4 h-4 lg:w-5 lg:h-5" />
        </button>

        <input
          title="Message"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage(e)}
          placeholder="Type a message..."
          className="flex-1 px-3 lg:px-4 py-2 border rounded-full text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          title="Voice Recording"
          onClick={() => {
            setIsRecording(true);
            onStartRecording();
          }}
          className="p-1.5 lg:p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-orange-500 hover:text-white"
        >
          <Mic className="w-4 h-4 lg:w-5 lg:h-5" />
        </button>
        <button
          title="Send"
          type="submit"
          className="p-1.5 lg:p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
        >
          <Send className="w-4 h-4 lg:w-5 lg:h-5" />
        </button>

        {/* Modals */}
        {showCamera && (
          <CameraInterface
            onClose={() => setShowCamera(false)}
            onCapture={() => setShowCamera(false)}
          />
        )}
        {showGallery && <PictureGallery onClose={() => setShowGallery(false)} />}
        {showAttachments && <AttachmentMenu onSelect={handleAttachmentSelect} />}
        {isRecording && (
          <VoiceRecordingInterface isRecording={isRecording} onStop={handleStopRecording} />
        )}
      </form>
    </div>
  );
};

export default ChatInterface;
