const Nakama = require('@heroiclabs/nakama-js');

var client = new Nakama.Client("defaultkey", "127.0.0.1", 7350);
client.ssl = false;
client.timeout = 10000;
console.log("Nakama server's client:", client);
const socket = client.createSocket();

// async function authenticateEmail(email, password) {
//     try {
//         const create = false;
//         const session = await client.authenticateEmail(email, password, create, "userName");
//         console.log("Successfully authenticated:", session);
//         return session;
//     }
//     catch (exception) {
//         console.log(exception);
//     }
// }
// const email = "testEmail@gmail.com";
// const password = "testPassword123";
// let session = authenticateEmail(email, password);

// async function connectSocket(socket, session) {
//     let connectedSession;
//     try {
//         var appearOnline = true;
//         connectedSession = await socket.connect(session, appearOnline);
//     }
//     catch (err) {
//         console.log("Error:", err);
//     }
//     console.log("Socket connected", connectedSession);
//     return connectedSession;
// }
// session = connectSocket(socket, session);

// async function createMatch(socket) {
//     let newMatch;
//     try {
//         newMatch = await socket.createMatch();
//     }
//     catch (err) {
//         console.log(err);
//     }
//     console.log("Match:", newMatch);
//     return newMatch;
// }
// const match = createMatch(socket)