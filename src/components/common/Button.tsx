export const Button = ({
  label,
  onClick,
  color,
}: {
  label: string;
  onClick: () => void;
  color: "green" | "red";
}) => {
  return (
    <div
      className={`border-2 rounded-lg px-3 py-1 cursor-pointer border-${color}-700 text-${color}-700`}
    >
      <button onClick={onClick}>{label}</button>
    </div>
  );
};
