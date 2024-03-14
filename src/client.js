import os from "os";
import grpc from "@grpc/grpc-js";
import { getProtoFile } from "./protos.js";

const packageDef = getProtoFile("service");

const [otherMachineIP, message] = process.argv.slice(2);

if (!message || !otherMachineIP) {
  console.error("You must provide an IP address and a message");
  process.exit(1);
}

const grpcObject = grpc.loadPackageDefinition(packageDef);
const cpPackage = grpcObject.cp;

const hostname = os.hostname();

const client = new cpPackage.CP(
  `${otherMachineIP}:40000`,
  grpc.credentials.createInsecure()
);

client.send({ name: message, host: hostname }, (error, response) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log(response.message);
});
