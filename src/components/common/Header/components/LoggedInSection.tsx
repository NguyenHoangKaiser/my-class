import { trpc } from "src/utils/trpc";
import { MenuProps, Typography } from "antd";
import { Dropdown } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import Image from "next/image";
import profileImage from "src/assets/profile.jpeg";

const items: MenuProps["items"] = [
  {
    label: "Profile",
    key: "1",
    icon: <UserOutlined />,
  },
  {
    label: "Sign out",
    key: "2",
    icon: <LogoutOutlined />,
  },
];

function LoggedInSection({ image }: { image: string | undefined | null }) {
  const userQuery = trpc.user.getUser.useQuery();
  const router = useRouter();

  const user = userQuery.data;
  let displayName = "";
  if (user) {
    displayName = user.displayName ?? user.name ?? "";
  }
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    switch (e.key) {
      case "1":
        router.push("/profile");
        break;
      case "2":
        return signOut();
      default:
        break;
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <>
      <div className="ml-3 flex items-center justify-between">
        <div className="pr-4">{displayName}</div>
        <div>
          <Dropdown menu={menuProps} trigger={["hover"]}>
            <button
              id="user-menu-button"
              aria-expanded="false"
              aria-haspopup="true"
              className="flex rounded-full bg-gray-800 text-sm hover:outline-none hover:ring-2 hover:ring-white hover:ring-offset-2 hover:ring-offset-gray-800"
            >
              <span className="sr-only">Open user menu</span>
              <Image
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
                src={image ?? profileImage}
              />
            </button>
          </Dropdown>
        </div>
      </div>
    </>
  );
}

export default LoggedInSection;
