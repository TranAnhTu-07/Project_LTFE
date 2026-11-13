import { request, getConnectionId } from './socket';

export const register = (user: string, pass: string) =>
    request('REGISTER', { user, pass });

export async function login(user: string, pass: string) {
    const connId = getConnectionId();
    const res = await request('LOGIN', { user, pass, connectionId: connId });

    localStorage.setItem('user', user);
    localStorage.setItem('reLoginCode', res.data.RE_LOGIN_CODE);
}