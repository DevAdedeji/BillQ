import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";
import clsx from "clsx";

interface CurrencyInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <DollarSign
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />
        <Input ref={ref} className={clsx("pl-9", className)} {...props} />
      </div>
    );
  },
);

CurrencyInput.displayName = "CurrencyInput";
export default CurrencyInput;
