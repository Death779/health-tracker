/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  dosageUnit: string; // 'таб.', 'капс.', 'капли', 'инъекция', 'мл'
  frequency: 'daily' | 'odd_days' | 'specific_days';
  specificDays?: number[]; // 0 for Sunday, 1 for Monday, etc.
  times: string[]; // e.g. ["08:00", "20:00"] or ["Утро", "День", "Вечер"]
  withFood: 'before' | 'during' | 'after' | 'any';
  stockRemaining: number;
  stockTotal: number;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface VitalLog {
  id: string;
  timestamp: string; // ISO String
  systolic?: number; // mmHg
  diastolic?: number; // mmHg
  pulse?: number; // bpm
  temperature?: number; // °C
  bloodSugar?: number; // mmol/L
  notes?: string;
}

export interface SymptomLog {
  id: string;
  timestamp: string; // ISO String
  overallFeeling: number; // 1 (критическое) - 5 (отличное)
  symptoms: string[]; // e.g. ["Головная боль", "Тошнота", "Усталость"]
  severity: 'mild' | 'moderate' | 'severe'; // легкая, умеренная, сильная
  notes?: string;
}

export interface MedicationTakeLog {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  dosageUnit: string;
  plannedTime: string; // "09:00" or "Утро"
  takenAt: string; // ISO String or "missed"
  dateStr: string; // "YYYY-MM-DD" for indexing
}

export interface Patient {
  id: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  phone: string;
  email?: string;
  diagnosis?: string;
  doctorInCharge?: string;
  medications: Medication[];
  vitalsLogs: VitalLog[];
  symptomLogs: SymptomLog[];
  medicationTakeLogs: MedicationTakeLog[];
}
