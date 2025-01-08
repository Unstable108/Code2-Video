const { v4: uuidv4 } = require("uuid");

const generateRoomId = () => uuidv4();

module.exports = { generateRoomId };
