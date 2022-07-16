// Constant
const { PORT, MONGOOSE_URL } = require("../Constants/index");
// Router
const router = require("../Routes/index");
// Express
const express = require("express");
// Cors
const cors = require("cors");
// Mongoose
const mongoose = require("mongoose");
// App
const app = express();
const http = require("http");
const server = http.createServer(app);
// Socket io
const io = require("socket.io").listen(server, {
	cors: {
		origin: '',
		methods: ["GET", "POST"],
	},
});
// Socket Logics
const messageInit = require("../Socket/message");
const readStoryInit = require("../Socket/readStory");
const connectAndDisconnectInit = require("../Socket/onlineUser");
// Dot Env
require("dotenv").config();

// Others
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
	req.io = io;
	next();
});
app.use("/", router);

// Connect to mongoose
mongoose.connect(
	MONGOOSE_URL,
	(error) => {
		if (error) {
			throw error;
		} else {
			console.log("Connected To DB");
		}
	},
	{
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	}
);

// Socket
io.on("connection", (socket) => {
	// Logics and events, listeners
	connectAndDisconnectInit(io, socket);
	messageInit(io, socket);
	readStoryInit(io, socket);
});

// Server
server.listen(PORT, () => {
	console.log(`Server is running on Port-${PORT}`);
});

