export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  complexity: string;
  tags: string[];
  features: {
    screens_count: number;
    macros_count: number;
    has_data_logging: boolean;
    has_alarm_server: boolean;
    has_trends: boolean;
  };
  plc_connection: {
    controller: string;
    protocol: string;
  };
  author: string;
  previewImage: string;
  isInteractive?: boolean; // <-- ДОБАВЛЯЕМ ЭТО ПОЛЕ
  screenshots: string[];
}

export const projects: Project[] = [
  {
    id: "water-treatment",
    title: "Водоочистной комплекс с. Александровское",
    description: "SCADA-система управления водоочистным комплексом: мониторинг и управление насосными группами, задвижками, контроль уровней в резервуарах.",
    category: "SCADA / Водоканал",
    complexity: "advanced",
    tags: ["SCADA", "Водоочистка", "Насосы", "Задвижки", "PLC", "Мнемосхема", "Алармы", "Тренды"],
    features: {
      screens_count: 4,
      macros_count: 3,
      has_data_logging: true,
      has_alarm_server: true,
      has_trends: true,
    },
    plc_connection: {
      controller: "КОНТАР МС12",
      protocol: "Modbus TCP",
    },
    author: "Иван Ежов",
    previewImage: "projects/01-smart-warehouse-AleksandroskoeBOK/assets/optimized/screen-01-main-menu.webp",
    isInteractive: true, // <-- ВКЛЮЧАЕМ ИНТЕРАКТИВ ДЛЯ ЭТОГО ПРОЕКТА
    screenshots: [
      "projects/01-smart-warehouse-AleksandroskoeBOK/assets/optimized/screen-01-main-menu.webp",
      "projects/01-smart-warehouse-AleksandroskoeBOK/assets/optimized/screen-02-mode.webp",
      "projects/01-smart-warehouse-AleksandroskoeBOK/assets/optimized/screen-03-settings.webp",
      "projects/01-smart-warehouse-AleksandroskoeBOK/assets/optimized/screen-04-archive.webp",
    ],
  },
  {
    id: "boiler-house",
    title: "Котельная Изумрудного города г.Томск",
    description: "SCADA-система управления котельной: мониторинг и управление газовыми котлами, задвижками, контроль уровней в резервуарах.",
    category: "SCADA / УК",
    complexity: "advanced",
    tags: ["SCADA", "Котлы", "Насосы", "Задвижки", "PLC", "Мнемосхема", "Алармы", "Тренды"],
    features: {
      screens_count: 6,
      macros_count: 3,
      has_data_logging: true,
      has_alarm_server: true,
      has_trends: true,
    },
    plc_connection: {
      controller: "КОНТАР МС12",
      protocol: "Modbus TCP",
    },
    author: "Иван Ежов",
    previewImage: "projects/02-smart-warehouse-IzumrudniyKOT/assets/optimized/01-menu-izumrud.webp",
    isInteractive: true, // <-- ОСТАВЛЯЕМ КАК ОБЫЧНУЮ КАРТИНКУ
    screenshots: [
      "projects/02-smart-warehouse-IzumrudniyKOT/assets/optimized/01-menu-izumrud.webp",
      "projects/02-smart-warehouse-IzumrudniyKOT/assets/optimized/02-graf-izumrud.webp",
      "projects/02-smart-warehouse-IzumrudniyKOT/assets/optimized/03-nastr-izumrud.webp",
      "projects/02-smart-warehouse-IzumrudniyKOT/assets/optimized/04-arhiv-izumrud.webp",
      "projects/02-smart-warehouse-IzumrudniyKOT/assets/optimized/05-ctp-izumrud.webp",
      "projects/02-smart-warehouse-IzumrudniyKOT/assets/optimized/06-upr-izumrud.webp",
    ],
  },
];