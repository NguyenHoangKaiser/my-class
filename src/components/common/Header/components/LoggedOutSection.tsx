import { LoginOutlined } from "@ant-design/icons";
import { Button } from "antd";

type TLoggedOutSectionProps = {
  signIn: () => void;
};

function LoggedOutSection({ signIn }: TLoggedOutSectionProps) {
  return (
    <div className="ml-3">
      {/* <a
        onClick={() => signIn()}
        href="#"
        className="link-secondary rounded-md px-3 py-2 text-sm font-medium"
        role="menuitem"
        tabIndex={-1}
        id="user-menu-item-2"
      >
        Register / Sign in
      </a> */}
      <Button
        type="link"
        onClick={() => signIn}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Register / Sign in
        <LoginOutlined style={{ fontSize: 16, marginTop: 3 }} />
      </Button>
    </div>
  );
}

export default LoggedOutSection;
