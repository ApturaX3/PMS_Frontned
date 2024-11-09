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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from './ui/select';

import { DatePickerWithRange } from './ui/dateRangePicker';
import LastUpdated from './lastUpdate';
import { DatePicker } from './ui/datePicker';

export const ProjectRow = ({ project }: { project: ProjectTypes }) => {
  const [editedProject, setEditedProject] = useState<ProjectTypes>(project);

  const handleDueDateChange = (newDate: string | Date | undefined) => {
    setEditedProject({ ...editedProject, due_date: newDate instanceof Date ? newDate.toISOString() : newDate });
  };
  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `${process.env.VITE_BACKEND_URL ? process.env.VITE_BACKEND_URL : 'http://localhost:3000'}./api/v1/projects/${project.id}`,
        editedProject,
      );
      alert('Project updated successfully!');
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
        {project.leader?.firstName} {project.leader?.lastName}
      </TableCell>

      <TableCell>
        <Popover>
          <PopoverTrigger>
            <Badge
              variant="secondary"
              className={
                project.status === 'NOT_STARTED'
                  ? 'bg-red-500/15 text-red-500'
                  : project.status === 'COMPLETED'
                    ? 'bg-green-500/15 text-green-500'
                    : 'bg-yellow-500/15 text-yellow-500'
              }
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
          </PopoverTrigger>
          <PopoverContent>
            <Select
              value={editedProject.status}
              onValueChange={(value) =>
                setEditedProject({
                  ...editedProject,
                  status: value as ProjectStatus,
                })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="ON_HOLD">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </PopoverContent>
        </Popover>
      </TableCell>
      <TableCell>
        <DatePicker
          dueDate={editedProject.due_date}
          setDueDate={handleDueDateChange}
        />
      </TableCell>
      <TableCell>
        <Popover>
          <PopoverTrigger>
            <Badge
              variant="secondary"
              className={
                project.priority === 'HIGH'
                  ? 'bg-purple-500/15 text-purple-500'
                  : project.priority === 'MEDIUM'
                    ? 'bg-blue-500/15 text-blue-500'
                    : 'bg-gray-500/15 text-gray-500'
              }
            >
              {project.priority.charAt(0).toUpperCase() +
                project.priority.slice(1)}
            </Badge>
          </PopoverTrigger>
          <PopoverContent>
            <Select
              value={editedProject.priority}
              onValueChange={(value) =>
                setEditedProject({
                  ...editedProject,
                  priority: value as ProjectPriority,
                })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </PopoverContent>
        </Popover>
      </TableCell>
      <TableCell className="text-right">
        <EditableInput
          value={editedProject.budget?.toString() || ''}
          onChange={(value) =>
            setEditedProject({ ...editedProject, budget: parseInt(value) })
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
      <TableCell></TableCell>
    </TableRow>
  );
};
