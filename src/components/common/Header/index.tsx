const Header = () => {
  return (
    <header className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <p>Mobile Menu</p>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <p>Logo</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
