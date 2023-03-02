import { useRef, useState } from "react";
import { trpc } from "src/utils/trpc";
import AccountMenu from "./AccountMenu";
import profileImage from "src/assets/profile.jpeg";
import Image from "next/image";
import { useClickOutside } from "src/hooks";
import { Avatar, Dropdown, MenuProps, message, theme } from "antd";
import { UserOutlined } from "@ant-design/icons";

const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  message.info("Click on left button.");
  console.log("click left button", e);
};

const handleMenuClick: MenuProps["onClick"] = (e) => {
  message.info("Click on menu item.");
  console.log("click", e);
};

const items: MenuProps["items"] = [
  {
    label: "1st menu item",
    key: "1",
    icon: <UserOutlined />,
  },
  {
    label: "2nd menu item",
    key: "2",
    icon: <UserOutlined />,
  },
  {
    label: "3rd menu item",
    key: "3",
    icon: <UserOutlined />,
    danger: true,
  },
  {
    label: "4rd menu item",
    key: "4",
    icon: <UserOutlined />,
    danger: true,
    disabled: true,
  },
];

const menuProps = {
  items,
  onClick: handleMenuClick,
};

function LoggedInSection({ image }: { image: string | undefined | null }) {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const openAccountMenuButtonRef = useRef<HTMLButtonElement>(null);
  const {
    token: { colorBgLayout, colorTextTertiary },
  } = theme.useToken();
  const userQuery = trpc.user.getUser.useQuery();

  function toggleAccountMenu() {
    setIsAccountMenuOpen(!isAccountMenuOpen);
  }

  function closeAccountMenu() {
    setIsAccountMenuOpen(false);
  }

  useClickOutside({
    ref: openAccountMenuButtonRef,
    onClose: closeAccountMenu,
  });

  const user = userQuery.data;
  let displayName = "";
  if (user) {
    displayName = user.displayName ?? user.name ?? "";
  }

  return (
    <>
      <div className="mr-3 text-white"></div>
      {/* 
      <div className="relative ml-3">
        <div className="flex items-center justify-between">
          <div className="pr-4">{displayName}</div>

          <button
            ref={openAccountMenuButtonRef}
            onClick={toggleAccountMenu}
            type="button"
            className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            id="user-menu-button"
            aria-expanded="false"
            aria-haspopup="true"
          >
            <span className="sr-only">Open user menu</span>

            <Image
              referrerPolicy="no-referrer"
              alt=""
              className="h-8 w-8 rounded-full"
              src={image ?? profileImage}
              width={40}
              height={40}
            />
          </button>
        </div>
        {isAccountMenuOpen && <AccountMenu />}
      </div> */}
      <div className="ml-3 flex items-center justify-between">
        <div className="pr-4">{displayName}</div>
        <div>
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Avatar src={image} />
          </Dropdown>
        </div>
      </div>
    </>
  );
}

export default LoggedInSection;
