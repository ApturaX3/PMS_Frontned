import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProjectTypes } from '@/types';
import { ProjectTable } from './ProjectTable';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const ProjectDashboard = () => {
  const auth = getAuth();
  const [projects, setProjects] = useState<ProjectTypes[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/v1/projects',
        );
        //@ts-expect-error: data might be null
        setProjects(response?.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    }

    fetchProjects();
  }, []);

  const handleCreateTask = () => {
    const newProject = generateFakeProject(auth.currentUser?.uid || '');
    setProjects((prevProjects) => [newProject, ...prevProjects]);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <Button variant="ghost" className="h-8">
          Main Table
        </Button>
      </header>

      <div className="flex items-center gap-4 bg-background/95 px-6 py-3">
        <Button className="h-8 gap-2" onClick={handleCreateTask}>
          Create New Task
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <ProjectTable projects={projects} />
      </div>
    </div>
  );
};

export default ProjectDashboard;

const generateFakeProject = (id: string): ProjectTypes => {
  return {
    id: Math.floor(Math.random() * 1000), // Random ID
    title: `Title`,
    comment: 'This is a comment',
    leaderId: id,
    due_date: new Date().toISOString(), // Current date as ISO string
    priority: 'LOW',
    budget: 0, // Random budget
    files: [],
    last_update: new Date().toISOString(),
    status: 'NOT_STARTED',
    people: JSON.parse('{}'),
    timeline: JSON.parse('{}'),
    additional_links: [],
    createdAt: new Date().toISOString(),
  };
};
