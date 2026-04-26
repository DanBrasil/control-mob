import { AuditFields, EntityId } from "@/shared/types/common";

export const APPOINTMENT_STATUSES = ["agendado", "concluido", "cancelado"] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export type Appointment = {
  id: EntityId;
  patient_id: EntityId;
  patient_name: string;
  patient_phone: string | null;
  title: string;
  notes: string | null;
  start_date: string;
  end_date: string | null;
  status: AppointmentStatus;
} & AuditFields;

export type CreateAppointmentInput = {
  patient_id: EntityId;
  title: string;
  notes?: string;
  start_date: string;
  end_date?: string;
  status: AppointmentStatus;
};

export type UpdateAppointmentInput = CreateAppointmentInput;

export type AppointmentFilters = {
  startDate: string;
  endDate: string;
  status?: AppointmentStatus;
};

export type AppointmentPatientOption = {
  id: EntityId;
  name: string;
};
