import type { User } from '../../domain/models/User';
import * as api from '../../infrastructure/http/apiClient';

export async function login(email: string, password: string): Promise<User> {
    const user: User = await api.post('/auth/login', { email, password });
    localStorage.setItem('user', JSON.stringify(user));
    return user;
}

export async function register(firstname: string, lastname: string, email: string, username: string, password: string) {
    const data = await api.post('/auth/register', { firstname, lastname, email, username, password });
    return data;
}

export function getToken() {
    const user = localStorage.getItem('user');
    if (user) {
        const parsedUser: User = JSON.parse(user);
        return parsedUser.token;
    }
    return undefined;
}

export function checkTokenExpiry(): boolean {
    const token = getToken();
    if (!token) return false;

    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return false;

    try {
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);
        const exp = payload.exp;
        if (!exp) return false;

        const now = Math.floor(Date.now() / 1000);
        return now < exp;
    } catch (e) {
        console.error('Failed to parse token payload', e);
        return false;
    }
}

export function logout() {
    localStorage.removeItem('user');
}

export function getUser(): User | null {
    const user = localStorage.getItem('user');
    if (user) {
        return JSON.parse(user) as User;
    }
    return null;
}
