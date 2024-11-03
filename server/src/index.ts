import http from "http";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import url from "url";

const server = http.createServer();
const wss = new WebSocketServer({ server });
const port = 3000;

const connections: any = {};
const users: any = {};

const broadcast = () => {
  Object.keys(connections).forEach((uuid) => {
    const connection = connections[uuid];
    const message = JSON.stringify(users);

    connection.send(message);
  });
};

const handleMessage = (bytes: any, uuid: any) => {
  const message = JSON.parse(bytes.toString());
  const user = users[uuid];

  user.state = message;

  broadcast();

  console.log(
    `${user.username} updated their state: ${JSON.stringify(user.state)}`
  );
};

const handleClose = (uuid: any) => {
  console.log(`${users[uuid].username} disconnected`);

  delete connections[uuid];
  delete users[uuid];

  broadcast();
};

wss.on("connection", (connection, req: Request) => {
  const { username } = url.parse(req.url, true).query;
  const uuid = uuidv4();
  console.log(username, uuid);

  connections[uuid] = connection;

  users[uuid] = {
    username,
    state: {},
  };

  connection.on("message", (message) => handleMessage(message, uuid));
  connection.on("close", () => handleClose(uuid));
});

server.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
