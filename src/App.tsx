/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Pill, User, HeartPulse, Clock, CalendarHeart, Plus, Check, Github, Stethoscope, ChevronRight, AlertCircle, Thermometer, X, AlertTriangle, Sun, Moon, HelpCircle } from 'lucide-react';
import { INITIAL_PATIENTS, FEELINGS_RU, FOOD_RELATIONS_RU, SYMPTOM_OPTIONS, SYMPTOM_SEVERITY_RU, DOCTORS } from './data';
import { Patient, MedicationTakeLog, Medication, SymptomLog } from './types';

export default function App() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(INITIAL_PATIENTS[0].id);
  const [isSymptomModalOpen, setIsSymptomModalOpen] = useState(false);
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [newVitalsData, setNewVitalsData] = useState({
    systolic: '',
    diastolic: '',
    pulse: '',
    temperature: '',
    bloodSugar: '',
    notes: ''
  });
  const [isAddMedicationModalOpen, setIsAddMedicationModalOpen] = useState(false);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    name: '', dosage: '', dosageUnit: 'мг', frequency: 'daily', times: ['08:00'], withFood: 'any'
  });
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    name: '',
    birthDate: '',
    gender: 'male',
    phone: '',
    email: '',
    diagnosis: '',
    doctorSpecialty: '',
    customDoctorSpecialty: '',
    doctorName: ''
  });
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkTheme]);

  const [newSymptomEntry, setNewSymptomEntry] = useState<{
    overallFeeling: number;
    symptoms: string[];
    severity: 'mild' | 'moderate' | 'severe';
    notes: string;
  }>({
    overallFeeling: 3,
    symptoms: [],
    severity: 'mild',
    notes: ''
  });

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handlePatientSelect = (id: string) => {
    setSelectedPatientId(id);
  };

  const handleSavePatient = () => {
    if (!newPatientData.name || !newPatientData.birthDate) return;
    const newId = `pat-${Date.now()}`;
    
    const specialtyToUse = newPatientData.doctorSpecialty === 'Другая специальность...' 
      ? newPatientData.customDoctorSpecialty 
      : newPatientData.doctorSpecialty;

    const finalDoctor = specialtyToUse && newPatientData.doctorName 
      ? `${specialtyToUse}: ${newPatientData.doctorName}`
      : specialtyToUse || newPatientData.doctorName || '';

    const newPatient: Patient = {
      id: newId,
      name: newPatientData.name,
      birthDate: newPatientData.birthDate,
      gender: newPatientData.gender as 'male' | 'female',
      phone: newPatientData.phone,
      email: newPatientData.email,
      diagnosis: newPatientData.diagnosis,
      doctorInCharge: finalDoctor,
      medications: [],
      vitalsLogs: [],
      symptomLogs: [],
      medicationTakeLogs: []
    };
    setPatients([...patients, newPatient]);
    setSelectedPatientId(newId);
    setIsAddPatientModalOpen(false);
    setNewPatientData({
      name: '',
      birthDate: '',
      gender: 'male',
      phone: '',
      email: '',
      diagnosis: '',
      doctorSpecialty: '',
      customDoctorSpecialty: '',
      doctorName: ''
    });
  };

  const handleSaveVitals = () => {
    const newVital: any = {
      id: `v-${Date.now()}`,
      timestamp: new Date().toISOString(),
      notes: newVitalsData.notes || undefined
    };
    if (newVitalsData.systolic) newVital.systolic = Number(newVitalsData.systolic);
    if (newVitalsData.diastolic) newVital.diastolic = Number(newVitalsData.diastolic);
    if (newVitalsData.pulse) newVital.pulse = Number(newVitalsData.pulse);
    if (newVitalsData.temperature) newVital.temperature = Number(newVitalsData.temperature);
    if (newVitalsData.bloodSugar) newVital.bloodSugar = Number(newVitalsData.bloodSugar);

    setPatients(prev => prev.map(p => {
      if (p.id !== selectedPatientId) return p;
      return {
        ...p,
        vitalsLogs: [newVital, ...p.vitalsLogs]
      };
    }));
    
    setIsVitalsModalOpen(false);
    setNewVitalsData({
      systolic: '', diastolic: '', pulse: '', temperature: '', bloodSugar: '', notes: ''
    });
  };

  const handleSaveSymptom = () => {
    const newLog: SymptomLog = {
      id: `s-${Date.now()}`,
      timestamp: new Date().toISOString(),
      overallFeeling: newSymptomEntry.overallFeeling,
      symptoms: newSymptomEntry.symptoms,
      severity: newSymptomEntry.severity,
      notes: newSymptomEntry.notes,
    };
    setPatients(prev => prev.map(p => {
      if (p.id !== selectedPatient.id) return p;
      return {
        ...p,
        symptomLogs: [newLog, ...p.symptomLogs]
      };
    }));
    setIsSymptomModalOpen(false);
    setNewSymptomEntry({
      overallFeeling: 3,
      symptoms: [],
      severity: 'mild',
      notes: ''
    });
  };

  const handleSaveMedication = () => {
    if (!newMedication.name || !newMedication.dosage) return;
    const medToAdd: Medication = {
      id: `m-${Date.now()}`,
      name: newMedication.name,
      dosage: newMedication.dosage,
      dosageUnit: newMedication.dosageUnit || 'мг',
      frequency: newMedication.frequency as 'daily' | 'odd_days' | 'specific_days' || 'daily',
      times: newMedication.times || ['08:00'],
      withFood: newMedication.withFood as 'before' | 'during' | 'after' | 'any' || 'any',
      stockRemaining: 30,
      stockTotal: 30,
      startDate: new Date().toISOString().split('T')[0]
    };
    setPatients(prev => prev.map(p => {
      if (p.id !== selectedPatient.id) return p;
      return { ...p, medications: [...p.medications, medToAdd] };
    }));
    setIsAddMedicationModalOpen(false);
    setNewMedication({ name: '', dosage: '', dosageUnit: 'мг', frequency: 'daily', times: ['08:00'], withFood: 'any' });
  };

  const toggleSymptom = (symptom: string) => {
    setNewSymptomEntry(prev => {
      if (prev.symptoms.includes(symptom)) {
        return { ...prev, symptoms: prev.symptoms.filter(s => s !== symptom) };
      } else {
        return { ...prev, symptoms: [...prev.symptoms, symptom] };
      }
    });
  };

  const handleToggleMedicationMode = (medId: string, time: string, isTaken: boolean) => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    setPatients(prev => prev.map(p => {
      if (p.id !== selectedPatient.id) return p;
      
      let newLogs = [...p.medicationTakeLogs];
      if (isTaken) {
        // Remove the log if untoggling
        newLogs = newLogs.filter(log => !(log.medicationId === medId && log.plannedTime === time && log.dateStr === todayStr));
      } else {
        // Add a log
        const med = p.medications.find(m => m.id === medId);
        if (med) {
          const newLog: MedicationTakeLog = {
            id: `log-${Date.now()}`,
            medicationId: med.id,
            medicationName: med.name,
            dosage: med.dosage,
            dosageUnit: med.dosageUnit,
            plannedTime: time,
            takenAt: new Date().toISOString(),
            dateStr: todayStr
          };
          newLogs.push(newLog);
        }
      }
      return { ...p, medicationTakeLogs: newLogs };
    }));
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isTimePassed = (timeStr: string) => {
    if (!timeStr.includes(':')) return false;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const m = hours * 60 + minutes;
    const currentM = currentTime.getHours() * 60 + currentTime.getMinutes();
    return currentM >= m;
  };

  // Group today's medications by time
  const todayMedsByTime = useMemo(() => {
    const grouped: Record<string, { med: Medication; log?: MedicationTakeLog }[]> = {};
    
    selectedPatient.medications.forEach(med => {
      med.times.forEach(time => {
        if (!grouped[time]) grouped[time] = [];
        const log = selectedPatient.medicationTakeLogs.find(
          l => l.medicationId === med.id && l.plannedTime === time && l.dateStr === todayStr
        );
        grouped[time].push({ med, log });
      });
    });

    // Sort times
    const sortedTimes = Object.keys(grouped).sort();
    const sortedGrouped: Record<string, { med: Medication; log?: MedicationTakeLog }[]> = {};
    sortedTimes.forEach(t => { sortedGrouped[t] = grouped[t]; });
    return sortedGrouped;
  }, [selectedPatient, todayStr]);

  const calcAge = (birthDate: string) => {
    const diff = Date.now() - new Date(birthDate).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans text-slate-800 dark:text-slate-200 selection:bg-indigo-500/30">
      
      {/* Sidebar - Patient List */}
      <aside className="w-full md:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm z-10 md:min-h-screen">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20 text-white">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">Монитор Здоровья</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Контроль приёма препаратов</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsInstructionsOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title="Инструкция"
            >
              <HelpCircle size={18} />
            </button>
            <a 
              href="https://github.com/Death779/health-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="GitHub Repository"
            >
              <Github size={18} />
            </a>
            <button 
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
            >
              {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        <div className="p-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Пациенты</h2>
          <div className="space-y-2">
            {patients.map(patient => (
              <div
                key={patient.id}
                role="button"
                tabIndex={0}
                onClick={() => handlePatientSelect(patient.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handlePatientSelect(patient.id);
                  }
                }}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 border flex items-center gap-3 cursor-pointer
                  ${patient.id === selectedPatient.id 
                    ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0
                  ${patient.id === selectedPatient.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className={`font-semibold truncate text-sm ${patient.id === selectedPatient.id ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
                    {patient.name}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">{patient.diagnosis}</p>
                </div>
                {patient.id === selectedPatient.id && (
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       if (patients.length === 1) {
                         alert('Нельзя удалить единственного пациента.');
                         return;
                       }
                       if (confirm(`Удалить пациента ${patient.name}?`)) {
                         setPatients(prev => {
                           const remaining = prev.filter(p => p.id !== patient.id);
                           setSelectedPatientId(remaining[0].id);
                           return remaining;
                         });
                       }
                     }}
                     className="ml-auto text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-md shrink-0"
                     title="Удалить пациента"
                   >
                     <X size={16} />
                   </button>
                )}
              </div>
            ))}
            <button 
              onClick={() => setIsAddPatientModalOpen(true)}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 border border-indigo-200 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors border-dashed"
            >
              <Plus size={18} />
              Добавить пациента
            </button>
          </div>
        </div>

        <div className="mt-auto p-4 md:p-6 border-t border-slate-100 dark:border-slate-800 text-center">
           <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">С заботой о вашем здоровье</p>
        </div>
      </aside>

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-6xl mx-auto p-4 md:p-8 w-full overflow-y-auto">
        
        {/* Top Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 mb-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedPatient.name}</h2>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md"><CalendarHeart size={14} className="text-slate-400" /> Возраст: {calcAge(selectedPatient.birthDate)} лет</span>
                <span className="flex items-center gap-1.5"><Stethoscope size={14} className="text-slate-400 dark:text-slate-500" /> {selectedPatient.doctorInCharge}</span>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-200 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30 w-full md:max-w-xs text-sm">
            <div className="font-semibold flex items-center gap-2 mb-1"><AlertCircle size={14} className="text-amber-600 dark:text-amber-500"/> Диагноз</div>
            <div>{selectedPatient.diagnosis}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Medications Column */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            
            {/* Today's Schedule Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <Pill className="text-indigo-500" size={20} />
                  График приёма на сегодня
                </h3>
                <div className="flex items-center gap-3">
                  <span className="hidden md:inline-block text-sm font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                    {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                  <button
                    onClick={() => setIsAddMedicationModalOpen(true)}
                    className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors shadow-sm"
                  >
                    <Plus size={16} />
                    Добавить
                  </button>
                </div>
              </div>
              
              <div className="p-5 space-y-6">
                {Object.keys(todayMedsByTime).length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    На сегодня препаратов не назначено.
                  </div>
                ) : (
                  Object.entries(todayMedsByTime).map(([time, items]) => (
                    <div key={time} className="relative">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-md font-bold text-sm tracking-wide flex items-center gap-1.5">
                          <Clock size={14} /> {time}
                        </div>
                        <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></div>
                      </div>
                      
                      <div className="space-y-3">
                        {(items as { med: Medication; log?: MedicationTakeLog }[]).map(({ med, log }) => {
                          const isTaken = !!log && log.takenAt !== 'missed';
                          const isOverdue = !isTaken && isTimePassed(time);

                          return (
                            <div 
                              key={`${med.id}-${time}`} 
                              className={`flex items-start p-4 rounded-xl border transition-all ${
                                isTaken 
                                  ? 'bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' 
                                  : isOverdue ? 'bg-rose-50/50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-800 shadow-[0_0_15px_rgba(244,63,94,0.15)] animate-pulse' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-sm'
                              }`}
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <h4 className={`font-bold ${isTaken ? 'text-emerald-900 dark:text-emerald-400 line-through opacity-70' : isOverdue ? 'text-rose-900 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}`}>
                                    {med.name}
                                  </h4>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (confirm(`Удалить препарат ${med.name}?`)) {
                                        setPatients(prev => prev.map(p => {
                                          if (p.id !== selectedPatientId) return p;
                                          return { ...p, medications: p.medications.filter(m => m.id !== med.id) };
                                        }));
                                      }
                                    }}
                                    className="ml-auto text-slate-400 hover:text-rose-500 transition-colors"
                                    title="Удалить препарат"
                                  >
                                    <X size={16} />
                                  </button>
                                  {isOverdue && !isTaken && (
                                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30 px-2 py-0.5 rounded-full">
                                      <AlertTriangle size={10} />
                                      Пропущено
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1.5 text-sm">
                                  <span className="font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">{med.dosage} {med.dosageUnit}</span>
                                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                    {FOOD_RELATIONS_RU[med.withFood]}
                                  </span>
                                  {med.notes && (
                                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                      {med.notes}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => handleToggleMedicationMode(med.id, time, isTaken)}
                                className={`ml-4 shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                  isTaken 
                                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/20' 
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400'
                                }`}
                              >
                                {isTaken ? <Check size={20} className="stroke-[3]" /> : <div className="w-4 h-4 rounded-full border-2 border-current"></div>}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Symptoms Log */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <Activity className="text-rose-500" size={20} />
                  Журнал симптомов
                </h3>
                <button
                  onClick={() => setIsSymptomModalOpen(true)}
                  className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm"
                >
                  <Plus size={16} />
                  Добавить
                </button>
              </div>
              <div className="p-0">
                {selectedPatient.symptomLogs.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">Нет записей о симптомах.</div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedPatient.symptomLogs.slice(0, 3).map(log => (
                      <div key={log.id} className="p-5 flex flex-col sm:flex-row gap-4 justify-between items-start">
                        <div>
                          <div className="text-xs font-semibold text-slate-400 mb-1">
                            {new Date(log.timestamp).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="font-medium text-slate-800 dark:text-slate-200 mb-2">
                            Самочувствие: {FEELINGS_RU[log.overallFeeling as keyof typeof FEELINGS_RU]}
                          </div>
                          {log.symptoms.length > 0 && (
                            <div className="flex gap-2 flex-wrap mb-2">
                              {log.symptoms.map(s => (
                                <span key={s} className="px-2.5 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded-md text-xs font-medium border border-rose-100 dark:border-rose-900/30">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                          {log.notes && <div className="text-sm text-slate-600 dark:text-slate-400 italic">«{log.notes}»</div>}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          log.severity === 'severe' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30' : 
                          log.severity === 'moderate' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900/30' : 
                          'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30'
                        }`}>
                          {log.severity === 'severe' ? 'Сильная' : log.severity === 'moderate' ? 'Умеренная' : 'Легкая'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
          </div>

          {/* Vitals Column */}
          <div className="xl:col-span-1 space-y-6">
            
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <HeartPulse className="text-red-500" size={20} />
                  Жизненные показатели
                </h3>
                <button
                  onClick={() => setIsVitalsModalOpen(true)}
                  className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-sm"
                >
                  <Plus size={16} />
                  Добавить
                </button>
              </div>
              <div className="p-5 space-y-4">
                {selectedPatient.vitalsLogs.length === 0 ? (
                  <div className="text-center text-slate-500 text-sm py-4">Нет записей о показателях.</div>
                ) : (
                  selectedPatient.vitalsLogs.slice(0, 4).map(vital => (
                    <div key={vital.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/30">
                      <div className="text-xs font-semibold text-slate-400 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
                        {new Date(vital.timestamp).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {vital.systolic && vital.diastolic && (
                          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1"><HeartPulse size={12}/> АД (мм рт.ст.)</span>
                            <span className="font-bold text-slate-800 dark:text-slate-100 text-lg">{vital.systolic}/{vital.diastolic}</span>
                          </div>
                        )}
                        {vital.pulse && (
                          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Пульс (уд/мин)</span>
                            <span className="font-bold text-slate-800 dark:text-slate-100 text-lg flex items-baseline gap-1">{vital.pulse} <span className="text-xs text-slate-400 font-medium">уд/м</span></span>
                          </div>
                        )}
                        {vital.temperature && (
                          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1"><Thermometer size={12}/> Температура</span>
                            <span className="font-bold text-slate-800 dark:text-slate-100 text-lg flex items-baseline gap-1">{vital.temperature} <span className="text-xs text-slate-400 font-medium">°C</span></span>
                          </div>
                        )}
                        {vital.bloodSugar && (
                          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Сахар (ммоль/л)</span>
                            <span className="font-bold text-slate-800 dark:text-slate-100 text-lg">{vital.bloodSugar}</span>
                          </div>
                        )}
                      </div>
                      
                      {vital.notes && (
                        <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-2.5 rounded border border-slate-100 dark:border-slate-700 italic">
                          {vital.notes}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Add Medication Modal */}
      {isAddMedicationModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Pill size={20} className="text-indigo-500" />
                Назначить препарат
              </h2>
              <button 
                onClick={() => setIsAddMedicationModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
               >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Название препарата</label>
                <input
                  type="text"
                  value={newMedication.name}
                  onChange={e => setNewMedication({...newMedication, name: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="Например, Аспирин"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Дозировка</label>
                   <input
                    type="text"
                    value={newMedication.dosage}
                    onChange={e => setNewMedication({...newMedication, dosage: e.target.value})}
                    placeholder="Например, 500"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ед. измерения</label>
                   <select
                    value={newMedication.dosageUnit}
                    onChange={e => setNewMedication({...newMedication, dosageUnit: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="мг">мг</option>
                    <option value="мл">мл</option>
                    <option value="таб.">таб.</option>
                    <option value="капс.">капс.</option>
                    <option value="капли">капли</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Время приёма (ЧЧ:ММ)</label>
                   <input
                    type="time"
                    value={newMedication.times?.[0] || '08:00'}
                    onChange={e => setNewMedication({...newMedication, times: [e.target.value]})}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Связь с пищей</label>
                    <select
                      value={newMedication.withFood}
                      onChange={e => setNewMedication({...newMedication, withFood: e.target.value as any})}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="before">До еды</option>
                      <option value="during">Во время еды</option>
                      <option value="after">После еды</option>
                      <option value="any">Не важно</option>
                    </select>
                 </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3 shrink-0 rounded-b-2xl">
              <button
                onClick={() => setIsAddMedicationModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveMedication}
                disabled={!newMedication.name || !newMedication.dosage}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Назначить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {isAddPatientModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User size={20} className="text-indigo-500" />
                Новый пациент
              </h2>
              <button 
                onClick={() => setIsAddPatientModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
               >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">ФИО пациента</label>
                <input
                  type="text"
                  value={newPatientData.name}
                  onChange={e => setNewPatientData({...newPatientData, name: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="Иванов Иван Иванович"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Дата рождения</label>
                  <input
                    type="date"
                    value={newPatientData.birthDate}
                    onChange={e => setNewPatientData({...newPatientData, birthDate: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Пол</label>
                  <select
                    value={newPatientData.gender}
                    onChange={e => setNewPatientData({...newPatientData, gender: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Телефон</label>
                  <input
                    type="tel"
                    value={newPatientData.phone}
                    onChange={e => setNewPatientData({...newPatientData, phone: e.target.value})}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">E-mail</label>
                  <input
                    type="email"
                    value={newPatientData.email}
                    onChange={e => setNewPatientData({...newPatientData, email: e.target.value})}
                    placeholder="email@example.com"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Диагноз / Причина наблюдения</label>
                <textarea
                  value={newPatientData.diagnosis}
                  onChange={e => setNewPatientData({...newPatientData, diagnosis: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                  rows={2}
                  placeholder="Например: Артериальная гипертензия"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Лечащий врач (Специальность и ФИО)</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    {newPatientData.doctorSpecialty === 'Другая специальность...' ? (
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Ваша специальность..."
                          value={newPatientData.customDoctorSpecialty || ''}
                          onChange={e => setNewPatientData({...newPatientData, customDoctorSpecialty: e.target.value})}
                          className="w-full rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                        <button
                          onClick={() => setNewPatientData({...newPatientData, doctorSpecialty: '', customDoctorSpecialty: ''})}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <select
                        value={newPatientData.doctorSpecialty}
                        onChange={e => setNewPatientData({...newPatientData, doctorSpecialty: e.target.value})}
                        className={`w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010L12%2015L17%2010%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:24px_24px] bg-[position:right_8px_center] bg-no-repeat pr-10 ${newPatientData.doctorSpecialty ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                      >
                        <option value="" disabled>Специальность (выберите)</option>
                        {DOCTORS.map(d => (
                          <option key={d} value={d} className="text-slate-900 dark:text-slate-100">{d}</option>
                        ))}
                        <option value="Другая специальность..." className="text-slate-900 dark:text-slate-100 font-bold border-t border-slate-100 dark:border-slate-700">Другая специальность...</option>
                      </select>
                    )}
                  </div>
                  <div className="flex-[1.5]">
                    <input
                      type="text"
                      placeholder="ФИО врача (Иванов И.И.)"
                      value={newPatientData.doctorName}
                      onChange={e => setNewPatientData({...newPatientData, doctorName: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

            </div>
            
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex gap-3 shrink-0">
              <button 
                onClick={() => setIsAddPatientModalOpen(false)}
                className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
               >
                Отмена
              </button>
              <button 
                onClick={handleSavePatient}
                disabled={!newPatientData.name || !newPatientData.birthDate}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Symptom Modal */}
      {isSymptomModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity size={20} className="text-rose-500" />
                Новая запись
              </h2>
              <button 
                onClick={() => setIsSymptomModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
               >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Самочувствие</label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setNewSymptomEntry({...newSymptomEntry, overallFeeling: rating})}
                      className={`flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all ${
                        newSymptomEntry.overallFeeling === rating
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="text-xl mb-1">{FEELINGS_RU[rating as keyof typeof FEELINGS_RU].split(' ')[1]}</span>
                      <span className="text-[10px] font-bold text-center leading-tight w-full break-words px-1">
                        {FEELINGS_RU[rating as keyof typeof FEELINGS_RU].split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Наблюдаемые симптомы</label>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOM_OPTIONS.map(symptom => {
                    const isSelected = newSymptomEntry.symptoms.includes(symptom);
                    return (
                      <button
                        key={symptom}
                        onClick={() => toggleSymptom(symptom)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                          isSelected
                            ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        {symptom}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Интенсивность</label>
                <div className="flex gap-3">
                  {(Object.keys(SYMPTOM_SEVERITY_RU) as Array<keyof typeof SYMPTOM_SEVERITY_RU>).map(key => (
                    <button
                      key={key}
                      onClick={() => setNewSymptomEntry({...newSymptomEntry, severity: key as 'mild' | 'moderate' | 'severe'})}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        newSymptomEntry.severity === key
                          ? 'bg-slate-800 dark:bg-slate-100 border-slate-800 dark:border-slate-100 text-white dark:text-slate-900'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {SYMPTOM_SEVERITY_RU[key as keyof typeof SYMPTOM_SEVERITY_RU]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Примечание (необязательно)</label>
                <textarea
                  value={newSymptomEntry.notes}
                  onChange={(e) => setNewSymptomEntry({...newSymptomEntry, notes: e.target.value})}
                  placeholder="Добавьте дополнительные подробности..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                />
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex gap-3 shrink-0">
              <button 
                onClick={() => setIsSymptomModalOpen(false)}
                className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
               >
                Отмена
              </button>
              <button 
                onClick={handleSaveSymptom}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-200 transition-all"
               >
                Сохранить запись
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vitals Modal */}
      {isVitalsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HeartPulse size={20} className="text-red-500" />
                Жизненные показатели
              </h2>
              <button 
                onClick={() => setIsVitalsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">АД Систолическое (верхнее)</label>
                  <input
                    type="number"
                    placeholder="120"
                    value={newVitalsData.systolic}
                    onChange={e => setNewVitalsData({...newVitalsData, systolic: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">АД Диастолическое (нижнее)</label>
                  <input
                    type="number"
                    placeholder="80"
                    value={newVitalsData.diastolic}
                    onChange={e => setNewVitalsData({...newVitalsData, diastolic: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Пульс (уд/мин)</label>
                  <input
                    type="number"
                    placeholder="70"
                    value={newVitalsData.pulse}
                    onChange={e => setNewVitalsData({...newVitalsData, pulse: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Температура (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="36.6"
                    value={newVitalsData.temperature}
                    onChange={e => setNewVitalsData({...newVitalsData, temperature: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Уровень сахара (ммоль/л)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="5.5"
                  value={newVitalsData.bloodSugar}
                  onChange={e => setNewVitalsData({...newVitalsData, bloodSugar: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Комментарий</label>
                <textarea
                  placeholder="Особенности состояния или приема пищи..."
                  value={newVitalsData.notes}
                  onChange={e => setNewVitalsData({...newVitalsData, notes: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 h-24 resize-none"
                ></textarea>
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 shrink-0 flex gap-3">
              <button 
                onClick={() => setIsVitalsModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
               >
                Отмена
              </button>
              <button 
                onClick={handleSaveVitals}
                disabled={!newVitalsData.systolic && !newVitalsData.diastolic && !newVitalsData.pulse && !newVitalsData.temperature && !newVitalsData.bloodSugar}
                className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 dark:bg-red-500 text-white font-bold rounded-xl text-sm hover:bg-red-700 dark:hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                <Check size={16} /> Сохранить данные
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions Modal */}
      {isInstructionsOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <HelpCircle size={20} />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Инструкция пользователя</h3>
              </div>
              <button 
                onClick={() => setIsInstructionsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
               >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-6 text-sm text-slate-600 dark:text-slate-300">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2"><User size={16} className="text-indigo-500" /> Профили пациентов</h4>
                <p>Вы можете вести учет сразу для нескольких человек. Для добавления нового пациента нажмите кнопку <strong>"Добавить пациента"</strong> в левом меню. Вы можете переключаться между ними кликом по карточке.</p>
                <p className="mt-1">Для удаления профиля нажмите крестик на его карточке в меню (понадобится подтверждение).</p>
              </div>
              
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2"><Stethoscope size={16} className="text-indigo-500" /> Врачи</h4>
                <p>При создании пациента вы можете выбрать лечащего врача из предложенного списка или ввести ФИО врача вручную, если его нет в списке.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2"><Pill size={16} className="text-indigo-500" /> Прием лекарств</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Нажмите <strong>"Добавить препарат"</strong> в главном окне, чтобы внести новое назначение. Можно указать точное время приема.</li>
                  <li>Карточки лекарств станут <strong className="text-rose-500">красными</strong>, если время приема уже прошло, а отметка не стоит.</li>
                  <li>Кликните на карточку препарата (кнопка с галочкой), чтобы отметить его как принятый на сегодня.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2"><HeartPulse size={16} className="text-indigo-500" /> Дневник симптомов</h4>
                <p>Ежедневно фиксируйте свое самочувствие через кнопку <strong>"Записать симптомы"</strong>. Укажите общее состояние, интенсивность боли и выберите конкретные симптомы из списка. История сохраняется в блоке "Медицинская карта".</p>
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <button 
                onClick={() => setIsInstructionsOpen(false)}
                className="w-full px-4 py-2.5 bg-slate-900 dark:bg-slate-800 text-white font-bold rounded-xl text-sm hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
               >
                Понятно, спасибо
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

