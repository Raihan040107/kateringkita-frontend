import { ChefHat } from "lucide-react";
export default function Logo({ sub }: { sub?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-[10px] bg-orange-600 flex items-center justify-center text-white">
        <ChefHat size={17} />
      </div>
      <div className="leading-tight">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-[17px] tracking-tight text-gray-900">
            Katering<span className="text-orange-600">Kita</span>
          </span>
          <span className="text-[9px] font-bold tracking-wide text-orange-600 border border-orange-300 bg-orange-50 rounded px-1.5 py-[3px]">COMMAND CENTER</span>
        </div>
        {sub && <div className="text-[10px] text-gray-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}
