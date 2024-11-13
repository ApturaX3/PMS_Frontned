import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProjectPriority, ProjectStatus, ProjectTypes } from '@/types';
import { EditableInput } from '@/components/EditableInput';
import axios from 'axios';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectTrigger, SelectContent, SelectItem } from './ui/select';

import { DatePickerWithRange } from './ui/dateRangePicker';
import LastUpdated from './lastUpdate';
import { DatePicker } from './ui/datePicker';
import { BACKEND_URL } from '@/config';
import LeaderPopup from './LeaderPopup';

export const ProjectRow = ({ project }: { project: ProjectTypes }) => {
  const [editedProject, setEditedProject] = useState<ProjectTypes>(project);

  const handleDueDateChange = (newDate: string | Date | undefined) => {
    setEditedProject({
      ...editedProject,
      due_date: newDate instanceof Date ? newDate.toISOString() : newDate,
    });
  };

  const handlePriorityChange = (priority: string) => {
    setEditedProject({ ...editedProject, priority });
  };

  const handleStatusChange = (status: ProjectStatus) => {
    setEditedProject({ ...editedProject, status });
  };

  const handleSaveChanges = async () => {
    try {
      const { data }: { data: { message?: string } } = await axios.get(
        `${BACKEND_URL}/api/v1/projects/${project.id}`,
      );
      if (data.message === 'Project not found') {
        // eslint-disable-next-line no-unused-vars
        const { id, createdAt, ...dataWithoutId } = editedProject;
        console.log(id);
        console.log(createdAt);
        const newProject = await axios.post(
          `${BACKEND_URL}/api/v1/projects`,
          dataWithoutId,
        );
        if (newProject && newProject.data) {
          alert('Project created successfully!');
        } else {
          throw new Error('Failed to create new project');
        }
      } else {
        await axios.put(
          `${BACKEND_URL}/api/v1/projects/${project.id}`,
          editedProject,
        );
        alert('Project updated successfully!');
      }
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <EditableInput
          value={editedProject.title}
          onChange={(value) =>
            setEditedProject({ ...editedProject, title: value })
          }
        />
      </TableCell>
      <TableCell>
        <LeaderPopup project={project} />
      </TableCell>

      <TableCell>
        <Select
          value={editedProject.status}
          onValueChange={(value) => handleStatusChange(value as ProjectStatus)}
        >
          <SelectTrigger
            className={`border-none focus:ring-0 focus:ring-offset-0  px-1 py-1 rounded-full text-xs   font-medium flex items-center justify-center  ${
              editedProject.status === 'NOT_STARTED'
                ? 'bg-red-500/15 text-red-500'
                : editedProject.status === 'COMPLETED'
                  ? 'bg-green-500/15 text-green-500'
                  : 'bg-yellow-500/15 text-yellow-500'
            }`}
          >
            <span className="text-center w-full">
              {editedProject.status?.charAt(0).toUpperCase() +
                editedProject.status?.slice(1)}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NOT_STARTED">Not Started</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="ON_HOLD">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <DatePicker
          dueDate={editedProject.due_date}
          setDueDate={handleDueDateChange}
        />
      </TableCell>
      <TableCell>
        <Select
          value={editedProject.priority}
          onValueChange={(value) =>
            handlePriorityChange(value as ProjectPriority)
          }
        >
          <SelectTrigger
            className={`border-none focus:ring-0 focus:ring-offset-0  px-1 py-1 rounded-full text-xs   font-medium flex items-center justify-center  ${
              editedProject.priority === 'HIGH'
                ? 'bg-red-500/15 text-red-500'
                : editedProject.priority === 'MEDIUM'
                  ? 'bg-yellow-500/15 text-yellow-500'
                  : 'bg-green-500/15 text-green-500'
            }`}
          >
            <span className="text-center w-full">
              {editedProject.priority.charAt(0).toUpperCase() +
                editedProject.priority.slice(1)}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="text-right">
        <EditableInput
          value={editedProject.budget?.toString() || '0'}
          onChange={(value) =>
            setEditedProject({ ...editedProject, budget: parseInt(value) || 0 })
          }
        />
      </TableCell>
      <TableCell>{project.files.length || '-'}</TableCell>
      <TableCell>
        <Badge variant="secondary" className="bg-blue-500/15 text-blue-500">
          <DatePickerWithRange />
        </Badge>
      </TableCell>
      <TableCell>
        <LastUpdated lastUpdated={project.last_update} />
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <span className="">:</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit project</DropdownMenuItem>
            <DropdownMenuItem>View history</DropdownMenuItem>
            <DropdownMenuItem>
              <Button onClick={handleSaveChanges}>Save</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
