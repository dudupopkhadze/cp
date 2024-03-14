import grpc from "@grpc/grpc-js";
import { getProtoFile } from "./protos.js";

const packageDef = getProtoFile("hello");

const grpcObject = grpc.loadPackageDefinition(packageDef);
const examplePackage = grpcObject.example;

// Server setup
const server = new grpc.Server();
server.addService(examplePackage.Greeter.service, {
  sayHello: (call, callback) => {
    callback(null, { message: "Hey " + call.request.name });
  },
});
const serverPort = "0.0.0.0:40000";
server.bindAsync(serverPort, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Server running at ${serverPort}`);
  server.start();
});

// Assuming otherMachineIP is the IP of the other machine you want to connect to
const otherMachineIP = "localhost"; // Change to actual IP address for real scenario
const clientPort = "40000";
const client = new examplePackage.Greeter(
  `${otherMachineIP}:${clientPort}`,
  grpc.credentials.createInsecure()
);

// Example client call
setTimeout(() => {
  // Delay to ensure server is up; adjust as necessary in real use
  client.sayHello({ name: "Dudu" }, (error, response) => {
    if (!error) {
      console.log("Greeting:", response.message);
    } else {
      console.error(error);
    }
  });
}, 1000);
