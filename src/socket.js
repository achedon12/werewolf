import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production'
    ? 'https://yourdomain.com'
    : 'http://localhost:3000';

export const socket = io(URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});