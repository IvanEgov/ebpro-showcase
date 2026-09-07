import { projects } from "@/data/projects";
import ScreenshotGallery from "@/components/ScreenshotGallery"; // ДОБАВЬТЕ ЭТУ СТРОКУ

// ... остальной код ...

{/* Теги */}
<div className="flex flex-wrap gap-2">
  {project.tags.map((tag) => (
    <span 
      key={tag} 
      className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-600"
    >
      {tag}
    </span>
  ))}
</div>

{/* ДОБАВЬТЕ ЭТО ПОСЛЕ ТЕГОВ */}
<ScreenshotGallery 
  screenshots={project.screenshots}
  projectTitle={project.title}
/>