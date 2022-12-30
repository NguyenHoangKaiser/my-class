const sizes = {
  lg: "w-6 h-6",
  md: "w-4 h-4",
  sm: "w-3 h-3",
};

type TIconWithSizeClass = {
  sizeClass: string;
};

const withSize = (Icon: React.FC<TIconWithSizeClass>) => {
  const component = ({ size = "md" }: { size?: keyof typeof sizes }) => (
    <Icon sizeClass={sizes[size]} />
  );
  component.displayName = Icon.displayName;
  return component;
};

export default withSize;
