import { type GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";

import { authOptions } from "src/pages/api/auth/[...nextauth]";
// import { getMockUser } from "src/libs/mockUser";
// import { getMockRole } from "src/pages/api/mock-role";
// import type Roles from "src/utils/constants";

/**
 * Wrapper for unstable_getServerSession https://next-auth.js.org/configuration/nextjs
 * See example usage in trpc createContext or the restricted API route
 */
// export const getServerAuthSession = async (ctx: {
//   req: GetServerSidePropsContext["req"];
//   res: GetServerSidePropsContext["res"];
// }) => {
// ! This is a hack to get around the fact that we can't mock unstable_getServerSession session in tests
//   if (process.env.NEXT_PUBLIC_MOCK_NEXT_AUTH) {
//     return {
//       user: getMockUser((await getMockRole()) as Roles),
//     };
//   } else {
//   return await unstable_getServerSession(ctx.req, ctx.res, authOptions);
//   }
// };

export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return await unstable_getServerSession(ctx.req, ctx.res, authOptions);
};
