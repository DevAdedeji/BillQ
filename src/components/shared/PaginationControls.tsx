import { Button } from "@/components/ui/button"

interface PaginationProps {
    pagination: {
        page: number
        limit: number
        totalPages: number
        totalInvoices: number
        hasNextPage: boolean
        hasPreviousPage: boolean
    },
    onPageChange: (page: number) => void
}

export function PaginationControls({ pagination, onPageChange }: PaginationProps) {
    return (
        <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    disabled={!pagination.hasPreviousPage}
                    onClick={() => onPageChange(pagination.page - 1)}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    disabled={!pagination.hasNextPage}
                    onClick={() => onPageChange(pagination.page + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
