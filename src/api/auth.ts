import { request, send,  getConnectionId } from './socket';

let isAuthenticated = false;
let ensuringPromise: Promise<boolean> | null = null;

export const register = (user: string, pass: string) =>
    request('REGISTER', { user, pass });

export async function login(user: string, pass: string) {
    const connId = getConnectionId();
    const res = await request('LOGIN', { user, pass, connectionId: connId });

    localStorage.setItem('user', user);
    localStorage.setItem('reLoginCode', res.data.RE_LOGIN_CODE);
    isAuthenticated = true;
}
export const logout = () => {
    isAuthenticated = false;
    localStorage.removeItem('user');
    localStorage.removeItem('reLoginCode');
    return send('LOGOUT');
};

export async function ensureLogin(): Promise<boolean> {
    if (isAuthenticated) return true;
    if (ensuringPromise) return ensuringPromise;

    const user = localStorage.getItem('user');
    const code = localStorage.getItem('reLoginCode');

    if (!user || !code) {
        return Promise.reject(new Error('Chưa đăng nhập'));
    }

    ensuringPromise = (async () => {
        try {
            const res = await request('RE_LOGIN', { user, code });
            if (res.data?.RE_LOGIN_CODE) {
                localStorage.setItem('reLoginCode', res.data.RE_LOGIN_CODE);
            }
            isAuthenticated = true;
            return true;
        } catch (error) {
            isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('reLoginCode');
            throw error;
        } finally {
            ensuringPromise = null;
        }
    })();

    return ensuringPromise;
}