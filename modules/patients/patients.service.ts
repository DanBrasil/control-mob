import { patientsRepository } from "@/modules/patients/repositories/patients.repository";
import {
  CreatePatientInput,
  Patient,
  UpdatePatientInput,
} from "@/modules/patients/types/patient.types";

export const patientsService = {
  list(search?: string): Promise<Patient[]> {
    return patientsRepository.list(search);
  },

  getById(id: number): Promise<Patient | null> {
    return patientsRepository.findById(id);
  },

  async create(input: CreatePatientInput): Promise<Patient | null> {
    const id = await patientsRepository.create(input);
    return patientsRepository.findById(id);
  },

  async update(id: number, input: UpdatePatientInput): Promise<Patient | null> {
    await patientsRepository.update(id, input);
    return patientsRepository.findById(id);
  },

  remove(id: number): Promise<void> {
    return patientsRepository.remove(id);
  },
};
