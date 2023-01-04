import { type DefaultSession } from "next-auth";

// Extend the built-in Session type to include your own custom properties
declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
  }
}
