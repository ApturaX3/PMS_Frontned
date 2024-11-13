import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
} from '@/components/ui/table';
import { ProjectTypes } from '@/types';
import { ProjectRow } from './ProjectRow';

export const ProjectTable = ({ projects }: { projects: ProjectTypes[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Leader</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead className="text-right">Budget</TableHead>
          <TableHead>Files</TableHead>
          <TableHead>Timeline</TableHead>
          <TableHead>Last Update</TableHead>
          <TableHead className="w-[50px]">Actions </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <ProjectRow key={project.id} project={project} />
        ))}
      </TableBody>
    </Table>
  );
};
