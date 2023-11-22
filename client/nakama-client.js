const client = new Nakama.client();
// const Nakama = require('@heroiclabs/nakama-js');
// var client = new Nakama.Client("defaultkey", "127.0.0.1", 7350);
// client.ssl = false;
// client.timeout = 10000;
// console.log(client);

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
// const email = "email3@gmail.com";
// const password = "3bc8f72e95a9";
// let session = authenticateEmail(email, password);

// async function connectSocket(session) {
//     const socket = client.createSocket();
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
// session = connectSocket(session);

// async function createMatch() {
//     let match;
//     try {
//         match = await socket.createMatch();
//     }
//     catch (err) {
//         console.log(err);
//     }
//     console.log("Match:", match);
//     return match;
// }
// const match = createMatch();
// console.log(match);