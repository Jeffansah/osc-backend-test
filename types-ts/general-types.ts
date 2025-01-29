export interface ICourse {
  id: string;
  title: string;
  description: string;
  duration: string;
  outcome: string;
}

export interface UserTokenPayload {
  _id: string;
  email: string;
  role: string;
}
