import grpc from "@grpc/grpc-js";
import notifier from "node-notifier";
import { getProtoFile } from "./protos.js";
import os from "os";

const packageDef = getProtoFile("hello");

const grpcObject = grpc.loadPackageDefinition(packageDef);
const examplePackage = grpcObject.example;

const server = new grpc.Server();
server.addService(examplePackage.Greeter.service, {
  sayHello: (call, callback) => {
    notifier.notify({
      title: "Message from: " + call.request.host,
      message: `Hey ${call.request.name}`,
      time: 5000,
      type: "info",
      sound: true,
    });
    callback(null, {
      message: "Response from: " + os.hostname() + " " + call.request.name,
    });
  },
});

server.bindAsync(
  "0.0.0.0:40000",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
  }
);
