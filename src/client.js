import grpc from "@grpc/grpc-js";
import { getProtoFile } from "./protos.js";

const packageDef = getProtoFile("hello");

const grpcObject = grpc.loadPackageDefinition(packageDef);
const examplePackage = grpcObject.example;

const client = new examplePackage.Greeter(
  "localhost:40000",
  grpc.credentials.createInsecure()
);

client.sayHello({ name: "Dudu" }, (error, response) => {
  console.log("Greeting:", response.message);
});
