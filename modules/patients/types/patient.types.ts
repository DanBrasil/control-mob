import { AuditFields, EntityId } from "@/shared/types/common";

export type Patient = {
  id: EntityId;
  name: string;
  phone: string | null;
  notes: string | null;
} & AuditFields;

export type CreatePatientInput = {
  name: string;
  phone?: string;
  notes?: string;
};

export type UpdatePatientInput = CreatePatientInput;
