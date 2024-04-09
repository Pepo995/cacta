import type { AWS } from "@serverless/typescript";
import { handlerPath } from "@utils/handlerPath";

type AWSFunction = AWS["functions"][0];

const worker: AWSFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 600,
  events: [
    // {
    //   schedule: {
    //     enabled: true,
    //     rate: ["rate(10 minutes)"],
    //   },
    // },
  ],
};

export default worker;
