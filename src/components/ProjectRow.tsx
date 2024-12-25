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
import { EllipsisVertical } from 'lucide-react';

export const ProjectRow = ({
  project,
  onDelete,
}: {
  project: ProjectTypes;
  onDelete: (projectId: string) => void;
}) => {
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
      const res = await axios.put(
        `${BACKEND_URL}/api/v1/projects/${project.id}`,
        editedProject,
      );
      if (res.status === 200) {
        alert('Project updated successfully!');
      } else {
        alert('Failed to update project');
      }
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
  };

  const handleDelete = () => {
    onDelete(project.id.toString());
  };

  return (
    <TableRow className="text-xs md:text-sm">
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
                ? 'bg-red-500/20 text-red-500'
                : editedProject.status === 'COMPLETED'
                  ? 'bg-green-500/25 text-green-800'
                  : editedProject.status === 'PENDING'
                    ? 'bg-blue-500/20 text-blue-600'
                    : editedProject.status === 'ON_HOLD'
                      ? 'bg-gray-500/20 text-gray-700'
                      : 'bg-yellow-500/20 text-yellow-600'
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
                  ? 'bg-yellow-500/15 text-yellow-600'
                  : 'bg-green-500/15 text-green-800'
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
              <span className="">
                <EllipsisVertical />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit project</DropdownMenuItem>
            <DropdownMenuItem>View history</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              <button >Delete</button>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSaveChanges}>
              <button >Save</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
