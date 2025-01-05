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
