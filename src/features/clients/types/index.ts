export interface Client {
    id: string;
    name: string;
    email: string;
    address?: string | null;
    userId: string;
    createdAt: string;
    updatedAt: string;
}