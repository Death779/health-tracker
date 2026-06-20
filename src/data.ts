/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Patient } from './types';

// Helper to get ISO strings offset by days
const getPastDateStr = (daysAgo: number, timeStr: string): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const [hours, minutes] = timeStr.split(':');
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return date.toISOString();
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    name: 'Александр Николаевич Ковалев',
    birthDate: '1965-04-12',
    gender: 'male',
    phone: '+7 (916) 123-45-67',
    email: 'kovalev.an@mail.ru',
    diagnosis: 'Артериальная гипертензия II ст., сахарный диабет II типа',
    doctorInCharge: 'Терапевт / Кардиолог: д.м.н. Васильева Е.С.',
    medications: [
      {
        id: 'med-1',
        name: 'Периндоприл (Престариум)',
        dosage: '10',
        dosageUnit: 'мг',
        frequency: 'daily',
        times: ['08:00'],
        withFood: 'before',
        stockRemaining: 24,
        stockTotal: 30,
        startDate: '2026-05-15',
        notes: 'Принимать утром натощак'
      },
      {
        id: 'med-2',
        name: 'Метформин (Глюкофаж)',
        dosage: '1000',
        dosageUnit: 'мг',
        frequency: 'daily',
        times: ['09:00', '21:00'],
        withFood: 'during',
        stockRemaining: 48,
        stockTotal: 60,
        startDate: '2026-05-15',
        notes: 'При затянувшихся симптомах тошноты обратиться к врачу'
      },
      {
        id: 'med-3',
        name: 'Аспирин Кардио',
        dosage: '100',
        dosageUnit: 'мг',
        frequency: 'daily',
        times: ['21:00'],
        withFood: 'after',
        stockRemaining: 15,
        stockTotal: 30,
        startDate: '2026-05-15',
        notes: 'Запивать достаточным количеством воды'
      }
    ],
    vitalsLogs: [
      {
        id: 'v-1',
        timestamp: getPastDateStr(6, '08:15'),
        systolic: 128,
        diastolic: 82,
        pulse: 68,
        temperature: 36.6,
        bloodSugar: 6.2,
        notes: 'Утреннее самочувствие в норме'
      },
      {
        id: 'v-2',
        timestamp: getPastDateStr(5, '08:20'),
        systolic: 135,
        diastolic: 85,
        pulse: 72,
        temperature: 36.5,
        bloodSugar: 6.5,
        notes: 'Легкая головная боль'
      },
      {
        id: 'v-3',
        timestamp: getPastDateStr(4, '08:10'),
        systolic: 140,
        diastolic: 90,
        pulse: 75,
        temperature: 36.7,
        bloodSugar: 6.8,
        notes: 'Повышенное давление после стресса'
      },
      {
        id: 'v-4',
        timestamp: getPastDateStr(3, '08:30'),
        systolic: 125,
        diastolic: 80,
        pulse: 65,
        temperature: 36.6,
        bloodSugar: 5.9,
        notes: 'Давление стабилизировалось'
      },
      {
        id: 'v-5',
        timestamp: getPastDateStr(2, '08:15'),
        systolic: 124,
        diastolic: 78,
        pulse: 66,
        temperature: 36.4,
        bloodSugar: 5.8,
        notes: 'Хороший сон'
      },
      {
        id: 'v-6',
        timestamp: getPastDateStr(1, '08:25'),
        systolic: 122,
        diastolic: 81,
        pulse: 69,
        temperature: 36.5,
        bloodSugar: 5.6
      }
    ],
    symptomLogs: [
      {
        id: 's-1',
        timestamp: getPastDateStr(5, '09:30'),
        overallFeeling: 4,
        symptoms: ['Головная боль'],
        severity: 'mild',
        notes: 'Быстро прошла после отдыха'
      },
      {
        id: 's-2',
        timestamp: getPastDateStr(4, '14:00'),
        overallFeeling: 3,
        symptoms: ['Головная боль', 'Усталость'],
        severity: 'moderate',
        notes: 'Повышенное давление'
      },
      {
        id: 's-3',
        timestamp: getPastDateStr(2, '09:00'),
        overallFeeling: 5,
        symptoms: [],
        severity: 'mild',
        notes: 'Прекрасное самочувствие'
      }
    ],
    medicationTakeLogs: [
      // Day 3 Ago
      { id: 'l-1', medicationId: 'med-1', medicationName: 'Периндоприл (Престариум)', dosage: '10', dosageUnit: 'мг', plannedTime: '08:00', takenAt: getPastDateStr(3, '08:05'), dateStr: new Date(getPastDateStr(3, '00:00')).toISOString().split('T')[0] },
      { id: 'l-2', medicationId: 'med-2', medicationName: 'Метформин (Глюкофаж)', dosage: '1000', dosageUnit: 'мг', plannedTime: '09:00', takenAt: getPastDateStr(3, '09:12'), dateStr: new Date(getPastDateStr(3, '00:00')).toISOString().split('T')[0] },
      { id: 'l-3', medicationId: 'med-3', medicationName: 'Аспирин Кардио', dosage: '100', dosageUnit: 'мг', plannedTime: '21:00', takenAt: getPastDateStr(3, '21:02'), dateStr: new Date(getPastDateStr(3, '00:00')).toISOString().split('T')[0] },
      { id: 'l-4', medicationId: 'med-2', medicationName: 'Метформин (Глюкофаж)', dosage: '1000', dosageUnit: 'мг', plannedTime: '21:00', takenAt: getPastDateStr(3, '21:05'), dateStr: new Date(getPastDateStr(3, '00:00')).toISOString().split('T')[0] },
      
      // Day 2 Ago
      { id: 'l-5', medicationId: 'med-1', medicationName: 'Периндоприл (Престариум)', dosage: '10', dosageUnit: 'мг', plannedTime: '08:00', takenAt: getPastDateStr(2, '08:15'), dateStr: new Date(getPastDateStr(2, '00:00')).toISOString().split('T')[0] },
      { id: 'l-6', medicationId: 'med-2', medicationName: 'Метформин (Глюкофаж)', dosage: '1000', dosageUnit: 'мг', plannedTime: '09:00', takenAt: getPastDateStr(2, '09:00'), dateStr: new Date(getPastDateStr(2, '00:00')).toISOString().split('T')[0] },
      { id: 'l-7', medicationId: 'med-3', medicationName: 'Аспирин Кардио', dosage: '100', dosageUnit: 'мг', plannedTime: '21:00', takenAt: 'missed', dateStr: new Date(getPastDateStr(2, '00:00')).toISOString().split('T')[0] }, // Missed!
      { id: 'l-8', medicationId: 'med-2', medicationName: 'Метформин (Глюкофаж)', dosage: '1000', dosageUnit: 'мг', plannedTime: '21:00', takenAt: getPastDateStr(2, '21:10'), dateStr: new Date(getPastDateStr(2, '00:00')).toISOString().split('T')[0] },

      // Day 1 Ago
      { id: 'l-9', medicationId: 'med-1', medicationName: 'Периндоприл (Престариум)', dosage: '10', dosageUnit: 'мг', plannedTime: '08:00', takenAt: getPastDateStr(1, '08:10'), dateStr: new Date(getPastDateStr(1, '00:00')).toISOString().split('T')[0] },
      { id: 'l-10', medicationId: 'med-2', medicationName: 'Метформин (Глюкофаж)', dosage: '1000', dosageUnit: 'мг', plannedTime: '09:00', takenAt: getPastDateStr(1, '09:30'), dateStr: new Date(getPastDateStr(1, '00:00')).toISOString().split('T')[0] },
      { id: 'l-11', medicationId: 'med-3', medicationName: 'Аспирин Кардио', dosage: '100', dosageUnit: 'мг', plannedTime: '21:00', takenAt: getPastDateStr(1, '21:05'), dateStr: new Date(getPastDateStr(1, '00:00')).toISOString().split('T')[0] },
      { id: 'l-12', medicationId: 'med-2', medicationName: 'Метформин (Глюкофаж)', dosage: '1000', dosageUnit: 'мг', plannedTime: '21:00', takenAt: getPastDateStr(1, '21:05'), dateStr: new Date(getPastDateStr(1, '00:00')).toISOString().split('T')[0] }
    ]
  },
  {
    id: 'pat-2',
    name: 'Елена Викторовна Смирнова',
    birthDate: '1978-11-23',
    gender: 'female',
    phone: '+7 (903) 765-43-21',
    email: 'smirnova.elena@yandex.ru',
    diagnosis: 'Гипотиреоз, восстановление после Covid-19',
    doctorInCharge: 'Эндокринолог: Румянцев А.Д.',
    medications: [
      {
        id: 'med-4',
        name: 'L-Тироксин',
        dosage: '75',
        dosageUnit: 'мкг',
        frequency: 'daily',
        times: ['07:00'],
        withFood: 'before',
        stockRemaining: 50,
        stockTotal: 100,
        startDate: '2026-04-20',
        notes: 'Принять строго натощак за 30-40 минут до еды'
      },
      {
        id: 'med-5',
        name: 'Витамин D3',
        dosage: '2000',
        dosageUnit: 'МЕ',
        frequency: 'daily',
        times: ['13:00'],
        withFood: 'during',
        stockRemaining: 120,
        stockTotal: 150,
        startDate: '2026-05-10',
        notes: 'Усваивается с жирной пищей'
      }
    ],
    vitalsLogs: [
      {
        id: 'v-e1',
        timestamp: getPastDateStr(3, '07:30'),
        temperature: 36.3,
        pulse: 64,
        notes: 'Небольшая слабость по утрам'
      },
      {
        id: 'v-e2',
        timestamp: getPastDateStr(2, '07:30'),
        temperature: 36.4,
        pulse: 60,
        notes: ''
      },
      {
        id: 'v-e3',
        timestamp: getPastDateStr(1, '07:30'),
        temperature: 36.5,
        pulse: 62,
        notes: ''
      }
    ],
    symptomLogs: [
      {
        id: 's-e1',
        timestamp: getPastDateStr(3, '18:00'),
        overallFeeling: 3,
        symptoms: ['Усталость', 'Сонливость'],
        severity: 'moderate',
        notes: 'Сложно концентрироваться во второй половине дня'
      }
    ],
    medicationTakeLogs: [
      { id: 'l-e1', medicationId: 'med-4', medicationName: 'L-Тироксин', dosage: '75', dosageUnit: 'мкг', plannedTime: '07:00', takenAt: getPastDateStr(3, '07:05'), dateStr: new Date(getPastDateStr(3, '00:00')).toISOString().split('T')[0] },
      { id: 'l-e2', medicationId: 'med-5', medicationName: 'Витамин D3', dosage: '2000', dosageUnit: 'МЕ', plannedTime: '13:00', takenAt: getPastDateStr(3, '13:10'), dateStr: new Date(getPastDateStr(3, '00:00')).toISOString().split('T')[0] },
      
      { id: 'l-e3', medicationId: 'med-4', medicationName: 'L-Тироксин', dosage: '75', dosageUnit: 'мкг', plannedTime: '07:00', takenAt: getPastDateStr(2, '07:15'), dateStr: new Date(getPastDateStr(2, '00:00')).toISOString().split('T')[0] },
      { id: 'l-e4', medicationId: 'med-5', medicationName: 'Витамин D3', dosage: '2000', dosageUnit: 'МЕ', plannedTime: '13:00', takenAt: getPastDateStr(2, '13:00'), dateStr: new Date(getPastDateStr(2, '00:00')).toISOString().split('T')[0] },

      { id: 'l-e5', medicationId: 'med-4', medicationName: 'L-Тироксин', dosage: '75', dosageUnit: 'мкг', plannedTime: '07:00', takenAt: getPastDateStr(1, '07:00'), dateStr: new Date(getPastDateStr(1, '00:00')).toISOString().split('T')[0] },
      { id: 'l-e6', medicationId: 'med-5', medicationName: 'Витамин D3', dosage: '2000', dosageUnit: 'МЕ', plannedTime: '13:00', takenAt: getPastDateStr(1, '13:40'), dateStr: new Date(getPastDateStr(1, '00:00')).toISOString().split('T')[0] }
    ]
  },
  {
    id: 'pat-3',
    name: 'Дмитрий Павлович Егоров',
    birthDate: '1992-07-05',
    gender: 'male',
    phone: '+7 (921) 987-65-43',
    email: 'egorov.dp@gmail.com',
    diagnosis: 'Острый синусит, период реабилитации',
    doctorInCharge: 'Отоларинголог: Чернов М.И.',
    medications: [
      {
        id: 'med-6',
        name: 'Амоксиклав',
        dosage: '875+125',
        dosageUnit: 'мг',
        frequency: 'daily',
        times: ['08:00', '20:00'],
        withFood: 'before',
        stockRemaining: 6,
        stockTotal: 14,
        startDate: '2026-06-12',
        notes: 'Принимать строго через каждые 12 часов. Курс 7 дней!'
      },
      {
        id: 'med-7',
        name: 'Синупрет форте',
        dosage: '1',
        dosageUnit: 'таб.',
        frequency: 'daily',
        times: ['09:00', '14:00', '19:00'],
        withFood: 'any',
        stockRemaining: 18,
        stockTotal: 30,
        startDate: '2026-06-12'
      }
    ],
    vitalsLogs: [
      {
        id: 'v-d1',
        timestamp: getPastDateStr(2, '08:00'),
        temperature: 37.8,
        pulse: 88,
        notes: 'Температура держится высокая'
      },
      {
        id: 'v-d2',
        timestamp: getPastDateStr(2, '20:00'),
        temperature: 37.4,
        pulse: 82,
        notes: 'Снижается после жаропонижающего'
      },
      {
        id: 'v-d3',
        timestamp: getPastDateStr(1, '08:00'),
        temperature: 36.9,
        pulse: 76,
        notes: 'Значительное улучшение, голова не болит'
      },
      {
        id: 'v-d4',
        timestamp: getPastDateStr(1, '20:00'),
        temperature: 36.7,
        pulse: 72,
        notes: 'Температура за сегодня стабильно нормальная'
      }
    ],
    symptomLogs: [
      {
        id: 's-d1',
        timestamp: getPastDateStr(2, '10:00'),
        overallFeeling: 2,
        symptoms: ['Насморк / заложенность', 'Головная боль', 'Повышенная температура'],
        severity: 'severe',
        notes: 'Давление в области пазух носа'
      },
      {
        id: 's-d2',
        timestamp: getPastDateStr(1, '12:00'),
        overallFeeling: 4,
        symptoms: ['Насморк / заложенность'],
        severity: 'mild',
        notes: 'Дышать стало намного легче'
      }
    ],
    medicationTakeLogs: [
      { id: 'l-d1', medicationId: 'med-6', medicationName: 'Амоксиклав', dosage: '875+125', dosageUnit: 'мг', plannedTime: '08:00', takenAt: getPastDateStr(2, '08:00'), dateStr: new Date(getPastDateStr(2, '00:00')).toISOString().split('T')[0] },
      { id: 'l-d2', medicationId: 'med-7', medicationName: 'Синупрет форте', dosage: '1', dosageUnit: 'таб.', plannedTime: '09:00', takenAt: getPastDateStr(2, '09:10'), dateStr: new Date(getPastDateStr(2, '00:00')).toISOString().split('T')[0] },
      { id: 'l-d3', medicationId: 'med-7', medicationName: 'Синупрет форте', dosage: '1', dosageUnit: 'таб.', plannedTime: '14:00', takenAt: getPastDateStr(2, '14:15'), dateStr: new Date(getPastDateStr(2, '00:00')).toISOString().split('T')[0] },
      { id: 'l-d4', medicationId: 'med-7', medicationName: 'Синупрет форте', dosage: '1', dosageUnit: 'таб.', plannedTime: '19:00', takenAt: getPastDateStr(2, '19:00'), dateStr: new Date(getPastDateStr(2, '00:00')).toISOString().split('T')[0] },
      { id: 'l-d5', medicationId: 'med-6', medicationName: 'Амоксиклав', dosage: '875+125', dosageUnit: 'мг', plannedTime: '20:00', takenAt: getPastDateStr(2, '20:05'), dateStr: new Date(getPastDateStr(2, '00:00')).toISOString().split('T')[0] },

      { id: 'l-d6', medicationId: 'med-6', medicationName: 'Амоксиклав', dosage: '875+125', dosageUnit: 'мг', plannedTime: '08:00', takenAt: getPastDateStr(1, '08:05'), dateStr: new Date(getPastDateStr(1, '00:00')).toISOString().split('T')[0] },
      { id: 'l-d7', medicationId: 'med-7', medicationName: 'Синупрет форте', dosage: '1', dosageUnit: 'таб.', plannedTime: '09:00', takenAt: getPastDateStr(1, '09:20'), dateStr: new Date(getPastDateStr(1, '00:00')).toISOString().split('T')[0] },
      { id: 'l-d8', medicationId: 'med-7', medicationName: 'Синупрет форте', dosage: '1', dosageUnit: 'таб.', plannedTime: '14:00', takenAt: getPastDateStr(1, '14:00'), dateStr: new Date(getPastDateStr(1, '00:00')).toISOString().split('T')[0] },
      { id: 'l-d9', medicationId: 'med-7', medicationName: 'Синупрет форте', dosage: '1', dosageUnit: 'таб.', plannedTime: '19:00', takenAt: getPastDateStr(1, '19:15'), dateStr: new Date(getPastDateStr(1, '00:00')).toISOString().split('T')[0] },
      { id: 'l-d10', medicationId: 'med-6', medicationName: 'Амоксиклав', dosage: '875+125', dosageUnit: 'мг', plannedTime: '20:00', takenAt: getPastDateStr(1, '20:30'), dateStr: new Date(getPastDateStr(1, '00:00')).toISOString().split('T')[0] }
    ]
  }
];

export const SYMPTOM_OPTIONS = [
  'Головная боль',
  'Головокружение',
  'Тошнота',
  'Усталость',
  'Сонливость',
  'Слабость',
  'Одышка',
  'Боль в груди',
  'Насморк / заложенность',
  'Кашель',
  'Отек ног',
  'Повышенное сердцебиение',
  'Сухость во рту'
];

export const DOCTORS = [
  'Терапевт / Кардиолог: д.м.н. Васильева Е.С.',
  'Эндокринолог: Румянцев А.Д.',
  'Отоларинголог: Чернов М.И.',
  'Невролог: Сазонова К.И.',
  'Гастроэнтеролог: Афанасьев Д.В.',
  'Хирург: Соколов О.Н.',
  'Офтальмолог: Лебедева Т.В.',
  'Дерматолог: Морозов В.С.',
  'Уролог: Волков А.П.',
  'Гинеколог: Новикова А.А.',
  'Психиатр: Богданов Р.И.',
  'Пульмонолог: Тихонова Н.А.',
  'Онколог: Кузнецова М.В.',
  'Педиатр: Смирнов Д.Е.',
  'Ревматолог: Ильина С.М.',
  'Аллерголог-иммунолог: Попов И.А.',
  'Инфекционист: Зайцева О.В.'
];

export const FOOD_RELATIONS_RU = {
  before: 'До еды',
  during: 'Во время еды',
  after: 'После еды',
  any: 'Не важно'
};

export const FREQUENCIES_RU = {
  daily: 'Каждый день',
  odd_days: 'В нечетные дни',
  specific_days: 'По выбранным дням'
};

export const FEELINGS_RU = {
  1: 'Критично 😫',
  2: 'Плохо ☹️',
  3: 'Нормально 😐',
  4: 'Хорошо 🙂',
  5: 'Отлично 😄'
};

export const SYMPTOM_SEVERITY_RU = {
  mild: 'Легкая',
  moderate: 'Умеренная',
  severe: 'Сильная'
};
