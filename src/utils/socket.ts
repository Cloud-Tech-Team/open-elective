import { io } from 'socket.io-client';

// Initialize Socket.IO client
const socket = io(import.meta.env.VITE_URL, {
  withCredentials: true,
  transports: ['websocket'],
});

export default socket;