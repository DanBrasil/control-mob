export type EntityId = number;

export type AuditFields = {
  created_at: string;
  updated_at: string;
};

export type ListState = "idle" | "loading" | "success" | "error";
