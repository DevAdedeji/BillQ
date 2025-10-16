import React, { forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { DollarSign } from "lucide-react"
import clsx from "clsx"

type CurrencyInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "ref"> & {
    value?: number
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    className?: string
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ className, value, onChange, ...rest }, ref) => {
        return (
            <div className="relative">
                <DollarSign className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    className={clsx("pl-9", className)}
                    {...rest}
                />
            </div>
        )
    }
)

CurrencyInput.displayName = "CurrencyInput"
export default CurrencyInput
