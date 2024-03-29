import grpc from "@grpc/grpc-js";
import notifier from "node-notifier";
import { getProtoFile } from "./protos.js";
import clipboard from "clipboardy";
import os from "os";

const packageDef = getProtoFile("service");
const grpcObject = grpc.loadPackageDefinition(packageDef);
const cpPackage = grpcObject.cp;

const server = new grpc.Server();
server.addService(cpPackage.CP.service, {
  send: (call, callback) => {
    notifier.notify({
      title: "Message from: " + call.request.host,
      message: call.request.message,
      time: 10000,
      type: "info",
      sound: true,
    });

    clipboard.writeSync(call.request.message);

    callback(null, {
      message: "Response from: " + os.hostname() + " " + call.request.name,
    });
  },
});

server.bindAsync(
  "0.0.0.0:40000",
  grpc.ServerCredentials.createInsecure(),
  (err) => console.log(err)
);

const shutdown = () => {
  console.log("Shutting down server...");
  server.tryShutdown(() => {
    console.log("Server stopped");
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
