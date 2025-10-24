import NextAuth, { DefaultSession } from "next-auth";

// Extend session and user types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      brandName?: string | null;
      brandEmail?: string | null;
      brandAddress?: string | null;
      note?: string | null;
      terms?: string | null;
      selectedTemplateId?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    password?: string | null;
    brandName?: string | null;
    brandEmail?: string | null;
    brandAddress?: string | null;
    note?: string | null;
    terms?: string | null;
    selectedTemplateId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
