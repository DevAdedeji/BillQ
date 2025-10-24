import { Client } from "../types";
import { ClientSchemaInputs } from "../schemas";

export const fetchClients = async () => {
  const res = await fetch("/api/clients", { cache: "no-store" });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch clients");
  }
  const data = await res.json();
  return data.data as Client[];
};

export const fetchClientDetails = async (id: string) => {
  const res = await fetch(`/api/clients/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch clients details");
  }
  const data = await res.json();
  return data.data as Client;
};

export const createClient = async ({
  name,
  email,
  address,
}: ClientSchemaInputs) => {
  const res = await fetch("/api/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, address }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || error.message || "Unable to create client");
  }
  return res.json();
};

export const editClient = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<ClientSchemaInputs>;
}) => {
  const res = await fetch(`/api/clients/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to update client");
  }

  return res.json();
};

export const deleteClient = async (id: string) => {
  const res = await fetch(`/api/clients/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to delete client");
  }

  return res.json();
};
