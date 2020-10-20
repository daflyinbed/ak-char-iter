import { HandbookData } from "./schema";
declare module "*.json" {
  const value: HandbookData[];
  export default value;
}
