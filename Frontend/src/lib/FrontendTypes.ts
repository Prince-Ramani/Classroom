export interface UserInterface {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  classesJoined: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ClassInterface {
  _id: string;
  name: string;
  banner: string;
  description?: string;
  teacherName: string;
  members: number | string[];
  admins: number | string[];
}

export interface shortMessageInetrface {
  attachedImages: string[];
  attachedVideo: string;
  attachedPdfs: { fileName: string; link: string }[];
  commentLength: number;
  content: string;
  createdAt: string;
  isPinned: boolean;
  type: "Normal" | "Assignment" | "Classwork";
  classID: string;
  dueDate?: string;

  uploadedBy: {
    _id: string;
    profilePicture: string;
    username: string;
  };
  _id: string;
}

export interface ReplyInterface {
  replierId: {
    username: string;
    profilePicture: string;
    _id: string;
  };
  replyContent: string;
  RepliedAt: string;
  _id: string;
}

export interface CommenterInterface {
  profilePicture: string;
  username: string;
  _id: string;
}

export interface commentInterface {
  commenter: CommenterInterface;
  _id: string;
  likes: string[];
  commentContent: string;
  classID: string;
  messageID: string;
  commentedAt: string;
  replies: ReplyInterface[];
}

export interface FullMessageInterface {
  attachedImages: string[];
  attachedVideo: string;
  attachedPdfs: { fileName: string; link: string }[];
  comments: commentInterface[];
  content: string;
  createdAt: string;
  isPinned: boolean;
  dueDate: string;
  type: "Normal" | "Assignment" | "Classwork";
  classID: string;
  classname: string;
  isAdmin: boolean;

  uploadedBy: {
    _id: string;
    profilePicture: string;
    username: string;
  };
  _id: string;
}

export interface NotificationInterface {
  _id: string;
  message: string;
  class: string;
}
