import { createNextApiHandler } from "@trpc/server/adapters/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "src/env/server.mjs";
import { createContext } from "src/server/trpc/context";
import { appRouter } from "src/server/trpc/router/_app";

// TODO maybe add nextjs-cors to enable cors
// export API handler
const nextApiHandler = createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path}: ${error}`);
        }
      : undefined,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Modify `req` and `res` objects here
  // In this case, we are enabling CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }
  // pass the (modified) req/res to the handler
  return nextApiHandler(req, res);
}
