type TLoggedOutSectionProps = {
  signIn: () => void;
}

const LoggedOutSection = ({ signIn }: TLoggedOutSectionProps) => {
  return (
    <div className="relative ml-3">
      <a
        onClick={() => signIn()}
        href="#"
        className="link-secondary rounded-md px-3 py-2 text-sm font-medium"
        role="menuitem"
        tabIndex={-1}
        id="user-menu-item-2"
      >
        Register / Sign in
      </a>
    </div>
  );
};

export default LoggedOutSection;
