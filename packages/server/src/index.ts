import { Elysia } from "elysia";

const app = new Elysia({
  serve: {
    hostname: "0.0.0.0",
    tls: {
      key: Bun.file("../../ca.key"),
      cert: Bun.file("../../ca.pem"),
      passphrase: Bun.env.passphrase,
    },
  },
})
  .decorate("openSockets", {} as Record<string, any>)
  .ws("/", {
    open(ws) {
      ws.data.openSockets[ws.id] = ws;
    },
    close(ws, code, message) {
      delete ws.data.openSockets[ws.id];
    },
    message(ws, message) {
      if (typeof message === "object" && !!message && "id" in message) {
        const socket = ws.data.openSockets[message.id as string];
        socket.send({ message, id: ws.id });
        return;
      }
      for (const socketId in ws.data.openSockets) {
        const socket = ws.data.openSockets[socketId];
        socket.send({ message, id: ws.id });
      }
    },
  })
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.url}`);

export type App = typeof app;
