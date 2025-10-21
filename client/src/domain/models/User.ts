export type User = {
  id?: string;
  username: string;
  token?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  options?: {
    color?: string;
    theme?: 'light' | 'dark';
  };
};
