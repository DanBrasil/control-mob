import { appointmentsRepository } from "@/modules/appointments/repositories/appointments.repository";
import {
  Appointment,
  AppointmentFilters,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "@/modules/appointments/types/appointment.types";

export const appointmentsService = {
  list(filters: AppointmentFilters): Promise<Appointment[]> {
    return appointmentsRepository.list(filters);
  },

  getById(id: number): Promise<Appointment | null> {
    return appointmentsRepository.findById(id);
  },

  async create(input: CreateAppointmentInput): Promise<Appointment | null> {
    const id = await appointmentsRepository.create(input);
    return appointmentsRepository.findById(id);
  },

  async update(
    id: number,
    input: UpdateAppointmentInput,
  ): Promise<Appointment | null> {
    await appointmentsRepository.update(id, input);
    return appointmentsRepository.findById(id);
  },

  remove(id: number): Promise<void> {
    return appointmentsRepository.remove(id);
  },
};
