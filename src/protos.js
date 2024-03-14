import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

// Convert the URL object to a path string
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getProtoFile = (name) => {
  return protoLoader.loadSync(path.join(__dirname, `protos/${name}.proto`), {});
};
