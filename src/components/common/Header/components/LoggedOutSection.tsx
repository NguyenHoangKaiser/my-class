import { LoginOutlined } from "@ant-design/icons";
import { Button } from "antd";

type TLoggedOutSectionProps = {
  signIn: () => void;
};

function LoggedOutSection({ signIn }: TLoggedOutSectionProps) {
  return (
    <div className="ml-3">
      <Button
        type="link"
        onClick={signIn}
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
