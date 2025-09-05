export interface MessageType {
  id?: number;
  text?: string;
  time?: string;
  sender?: "user" | "teacher";
  type?: "text" | "voice" | "image";
  duration?: string;
  imageUrl?: string;
  senderId?: string;
  senderRole?: string;
  receiverId?: string;
  receiverRole?: string;
  content?: string;
  isRead?: boolean;
}