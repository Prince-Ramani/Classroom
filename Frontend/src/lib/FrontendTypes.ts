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
  attchedPdfs: string[];
  commentLength: number;
  content: string;
  createdAt: string;
  isPinned: boolean;

  uploadedBy: {
    _id: string;
    profilePicture: string;
    username: string;
  };
  _id: string;
}
