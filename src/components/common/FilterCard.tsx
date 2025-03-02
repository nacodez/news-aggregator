import { FilterCardProps } from "../../types/types";

const FilterCard: React.FC<FilterCardProps> = ({ title, children, gap }) => {
  return (
    <div className="rounded-lg border-2 border-gray-900 p-4 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className={`flex flex-wrap justify-center ${gap}`}>{children}</div>
    </div>
  );
};

export default FilterCard;
