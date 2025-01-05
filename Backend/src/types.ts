declare global {
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}

export interface createAccountInterface {
  username: string;
  email: string;
  password: string;
}

export interface createClassInterface {
  name: string;
  description?: string;
  teacherName: string;
}
