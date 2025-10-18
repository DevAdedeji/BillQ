"use client"
import {
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"

interface EmptyStateProps {
    title?: string
    description?: string
    colSpan?: number
}
export default function EmptyTableState({ title, description, colSpan }: EmptyStateProps) {
    return (
        <TableBody>
            <TableRow>
                <TableCell colSpan={colSpan}>
                    <div className="w-full p-10 bg-primary/10 rounded-lg flex flex-col items-center justify-center gap-4 ">
                        <svg className="feather feather-file-text text-primary" fill="none" height="48" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        <h3 className="text-xl font-bold mb-2">{title}</h3>
                        <p className="text-muted-light dark:text-muted-dark w-[90%] mx-auto">{description}</p>
                    </div>
                </TableCell>
            </TableRow>
        </TableBody>
    )
}