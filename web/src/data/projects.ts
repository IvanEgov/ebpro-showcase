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
    // Используем экран "Режим" как главное превью, так как он самый показательный
    previewImage: "/projects/01-smart-warehouse-AleksandroskoeBOK/assets/optimized/screen-02-mode.webp",
  },
];