import { CheckCircle2, Circle } from "lucide-react";

interface CheckItemProps {
  label: string;
  checked?: boolean;
}

export function CheckItem({ label, checked = false }: CheckItemProps) {
  return (
    <div className="flex items-center gap-2">
      {checked ? (
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      ) : (
        <Circle className="h-5 w-5 text-gray-300" />
      )}
      <span className="text-sm">{label}</span>
    </div>
  );
}
