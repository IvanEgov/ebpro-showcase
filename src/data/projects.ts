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
  screenshots: string[]; // <-- Добавлено поле для галереи
}

export const projects: Project[] = [
  {
    id: "01-smart-warehouse-AleksandroskoeBOK",
    title: "Водоочистной комплекс с. Александровское",
    description: "SCADA-система управления водоочистным комплексом: мониторинг и управление насосными группами, задвижками, контроль уровней в резервуарах. Реализована полная мнемосхема технологического процесса.",
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
    previewImage: "/public/projects/01-smart-warehouse-AleksandroskoeBOK/assets/optimized/screen-01-main-menu.webp",
    // Добавлен массив скриншотов для галереи
    screenshots: [
      "/projects/01-smart-warehouse-AleksandroskoeBOK/assets/optimized/screen-01-main-menu.webp",
      "/projects/01-smart-warehouse-AleksandroskoeBOK/assets/optimized/screen-02-mode.webp",
      "/projects/01-smart-warehouse-AleksandroskoeBOK/assets/optimized/screen-03-settings.webp",
      "/projects/01-smart-warehouse-AleksandroskoeBOK/assets/optimized/screen-04-archive.webp",
    ],
  },
];