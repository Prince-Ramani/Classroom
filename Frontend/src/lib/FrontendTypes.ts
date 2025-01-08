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
}
