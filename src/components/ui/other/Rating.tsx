import { formatNumber } from "@/utils/helpers";
import { Star } from "@/utils/icons";

export interface RatingProps {
  rate: number;
  count?: number;
}

const Rating: React.FC<RatingProps> = ({ rate = 0, count = 0 }) => {
  return (
    <div className="flex items-center gap-1 font-semibold text-warning-500">
      <Star />
      <p>
        {Number(rate || 0).toFixed(1)} {Number(count || 0) > 0 && `(${formatNumber(Number(count || 0))})`}
      </p>
    </div>
  );
};

export default Rating;
