import { io, type Socket } from 'socket.io-client';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
let socket: Socket | null = null;

export function connect(token?: string) {
  if (socket && socket.connected) return socket;
  socket = io(API_BASE, {
    path: '/socket.io',
    auth: token ? { token } : undefined,
  });
  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnect() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
