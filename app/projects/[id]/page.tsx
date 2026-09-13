// app/projects/[id]/page.tsx
import { projects } from '@/data/projects';
import { notFound } from 'next/navigation';
import ProjectClient from './ProjectClient';

// Эта функция говорит Next.js, какие именно страницы нужно сгенерировать при build
export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return <ProjectClient projectId={id} />;
}