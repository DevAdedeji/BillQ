"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
}

export const PasswordInput = ({ label, ...props }: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="relative">
            {label && (
                <label htmlFor={props.id} className="block text-sm font-medium mb-1">
                    {label}
                </label>
            )}
            <Input
                {...props}
                type={showPassword ? "text" : "password"}
                className="pr-10"
            />
            <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
            >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    )
}
