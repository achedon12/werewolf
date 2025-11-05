import {getGameRoom} from '../utils/roomManager.js';
import {startRoleCallSequence} from '../utils/roleTurnManager.js';

export const handleStartRoleCalls = (socket, io, gameId, perRoleSeconds = 30) => {
  const room = getGameRoom(gameId);
  if (!room) {
    socket.emit('game-error', `Partie ${gameId} introuvable`);
    return;
  }

  if (room.roleCallController && typeof room.roleCallController.stop === 'function') {
    try { room.roleCallController.stop(); } catch (e) {}
  }

  room.roleCallController = startRoleCallSequence(io, gameId, perRoleSeconds, {
      onFinished: room.onRoleCallFinished // optionnel si configuré
  });
  socket.emit('admin-confirm-action', `Role-call démarré (${perRoleSeconds}s par rôle)`);
};

export const handleStopRoleCalls = (socket, io, gameId) => {
  const room = getGameRoom(gameId);
  if (!room || !room.roleCallController) {
    socket.emit('game-error', 'Aucune séquence role-call en cours');
    return;
  }
  room.roleCallController.stop();
  delete room.roleCallController;
  socket.emit('admin-confirm-action', 'Role-call stoppé');
};

export const handleNextRoleCall = (socket, io, gameId) => {
  const room = getGameRoom(gameId);
  if (!room || !room.roleCallController) {
    socket.emit('game-error', 'Aucune séquence role-call en cours');
    return;
  }
  room.roleCallController.next();
  socket.emit('admin-confirm-action', 'Passé au rôle suivant');
};

export const handleGetRoleCallStatus = (socket, io, gameId) => {
  const room = getGameRoom(gameId);
  if (!room || !room.roleCallController) {
    socket.emit('role-call-status', { running: false });
    return;
  }
  socket.emit('role-call-status', room.roleCallController.getStatus());
};