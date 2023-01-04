/* eslint-disable react-hooks/rules-of-hooks */
import { useSession as useNextAuthSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getMockUser } from "src/libs/mockUser";

/**
 * We use this hook to mock the NextAuth session in development.
 * ! This should not be used in production. Will be removed in production builds.
 * @see https://next-auth.js.org/getting-started/client
 * @returns {import("next-auth").Session} session
 */
const useSession = () => {
  if (process.env.NEXT_PUBLIC_MOCK_NEXT_AUTH) {
    const [mockRole, setMockRole] = useState(null);

    useEffect(() => {
      fetch("/api/mock-role")
        .then((response) => response.json())
        .catch(() => {
          throw new Error(
            "Failed to fetch mock role, please choose a role in the mock role footer or remove the NEXT_PUBLIC_MOCK_NEXT_AUTH environment variable."
          );
        })
        .then(({ role }) => {
          setMockRole(role);
        });
    }, []);

    if (!mockRole) {
      return {
        data: undefined,
        status: "loading",
      };
    } else {
      return {
        data:
          mockRole === "unauthenticated"
            ? null
            : {
                user: getMockUser(mockRole),
              },
        status:
          mockRole === "unauthenticated" ? "unauthenticated" : "authenticated",
      };
    }
  } else {
    return useNextAuthSession();
  }
};

export default useSession;
