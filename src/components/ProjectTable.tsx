import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
} from '@/components/ui/table';
import axios from 'axios';
import { ProjectTypes } from '@/types';
import { ProjectRow } from './ProjectRow';
import { Button } from './ui/button';
import { BACKEND_URL } from '@/config';

//
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ProjectTable = ({ auth }: { auth: any }) => {
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
  const handleCreateTask = async () => {
    const { id, ...newProject } = generateFakeProject(
      auth.currentUser?.uid || '',
    );
    console.log(id);
    const res = await axios.post(
      'http://localhost:3000/api/v1/projects',
      newProject,
    );
    setProjects((prevProjects) => [
      (res.data as { project: ProjectTypes }).project,
      ...prevProjects,
    ]);
  };
  const handleDeleteProject = async (projectId: string) => {
    try {
      const res = await axios.delete(
        `${BACKEND_URL}/api/v1/projects/${projectId}`,
      );
      if (res.status === 200) {
        // Filter out the deleted project from the list
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== Number(projectId)),
        );
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Error occurred while deleting project.');
    }
  };

  return (
    <div className="overflow-auto">
      <div className="flex items-center gap-4 bg-background/15 px-4 py-2">
        <Button className="h-8 gap-2" onClick={handleCreateTask}>
          Create New Task
        </Button>
      </div>
      <Table className="min-w-full text-xs md:text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4 min-w-[100px] md:min-w-[150px] lg:min-w-[200px]">
              Project
            </TableHead>
            <TableHead className="min-w-[80px] md:min-w-[100px] ">
              Leader
            </TableHead>
            <TableHead className="min-w-[80px] md:min-w-[100px]">
              Status
            </TableHead>
            <TableHead className="min-w-[80px] md:min-w-[100px]">
              Due Date
            </TableHead>
            <TableHead className="min-w-[80px] md:min-w-[120px]">
              Priority
            </TableHead>
            <TableHead className="min-w-[80px] md:min-w-[100px]">
              Budget
            </TableHead>
            <TableHead className="min-w-[80px] md:min-w-[100px]">
              Files
            </TableHead>
            <TableHead className="min-w-[80px] md:min-w-[100px]">
              Timeline
            </TableHead>
            <TableHead className="min-w-[80px] md:min-w-[100px]">
              Last Update
            </TableHead>
            <TableHead className="w-[50px] md:w-[80px] text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              onDelete={handleDeleteProject}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const generateFakeProject = (id: string): ProjectTypes => {
  return {
    id: Math.floor(Math.random() * 1000), // Random ID
    title: 'Title',
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
