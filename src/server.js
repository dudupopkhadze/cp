import grpc from "@grpc/grpc-js";
import { getProtoFile } from "./protos.js";

const packageDef = getProtoFile("hello");

const grpcObject = grpc.loadPackageDefinition(packageDef);
const examplePackage = grpcObject.example;

const server = new grpc.Server();
server.addService(examplePackage.Greeter.service, {
  sayHello: (call, callback) => {
    callback(null, { message: "Hey Blah Blah 2 " + call.request.name });
  },
});

server.bindAsync(
  "0.0.0.0:40000",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
  }
);
