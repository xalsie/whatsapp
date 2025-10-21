export interface UserEntity {
    _id: string;
    username: string;
    password: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    options?: {
        color?: string;
        theme?: 'light' | 'dark';
    };
}
