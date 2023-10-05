const utils = require('./utils');

const rooms = new Map();
const connp = new Map();


function createRoom() {
	const rid = utils.generateUIDWithCollisionChecking();
	const room_data = {
		id: rid,
		turn: 0,
		players: []
	};
	rooms.set(rid, room_data);
	return rid;
}


function insertPlayer(rid, player) {
	const room_data = rooms.get(rid);
	room_data.players.push(player);
	
	const player_data = {
		rid: rid
	}
	connp.set(player, player_data);
}


function removePlayer(rid, player) {
	const room_data = rooms.get(rid);
	room_data.players.filter(p => p !== player);
}


function getRoomPlayers(rid) {
	const room_data = rooms.get(rid);
	var list = [];
	
	room_data.players.forEach((player) => {
		list.push(connp.get(player).name);
	});
	return list;
}


function notifyRoomPlayers(rid, message) {
	const room_data = rooms.get(rid);
	room_data.players.forEach((player) => {
		player.send(message);
	});
}


function notifyRoomPlayersExcept(rid, player, message) {
	const room_data = rooms.get(rid);
	const others = room_data.players.filter(p => p !== player);
	others.forEach((p) => {
		p.send(message);
	});
}


function savePlayerData(player, key, value) {
	const player_data = connp.get(player);
	player_data[key] = value;
}


function getPlayerRoom(player) {
	const player_data = connp.get(player);
	return player_data.rid;
}


function getRoundPlayer(rid) {
	const room_data = rooms.get(rid);
	const player = room_data.players.at(room_data.turn);
	room_data.turn = (room_data.turn + 1) % room_data.players.length;
	return player;
}


module.exports = {
    createRoom,
    insertPlayer,
	removePlayer,
	getRoomPlayers,
	notifyRoomPlayers,
	notifyRoomPlayersExcept,
	savePlayerData,
	getPlayerRoom,
	getRoundPlayer
}