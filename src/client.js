import grpc from "@grpc/grpc-js";
import { getProtoFile } from "./protos.js";
import readline from "node:readline";
import os from "os";

const packageDef = getProtoFile("hello");

const grpcObject = grpc.loadPackageDefinition(packageDef);
const examplePackage = grpcObject.example;

const ips = ["192.168.1.7", "192.168.1.13"];

const getMessage = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`Please insert message to share\n`, async (message) => {
      resolve(message);
      rl.close();
    });
  });
};
const hostname = os.hostname();
console.log(hostname);

getMessage().then((message) => {
  ips.forEach((ip) => {
    const client = new examplePackage.Greeter(
      `${ip}:40000`,
      grpc.credentials.createInsecure()
    );
    client.sayHello({ name: message, host: hostname }, (error, response) => {
      console.log(response.message);
    });
  });
});
