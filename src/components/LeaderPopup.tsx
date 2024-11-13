import { ProjectTypes } from '@/types';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const LeaderPopup = ({ project }: { project: ProjectTypes }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Popover open={isPopoverOpen}>
      <PopoverTrigger
        asChild
        onMouseEnter={() => setIsPopoverOpen(true)}
        onMouseLeave={() => setIsPopoverOpen(false)}
      >
        <button className="text-black-500 ">
          {project.leader?.firstName} {project.leader?.lastName}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4 bg-white border rounded shadow-lg">
        <div className="flex items-center">
          <img
            src={project.leader?.profilePic}
            alt={`${project.leader?.firstName} ${project.leader?.lastName}`}
            className="w-12 h-12 rounded-full border-2 border-blue-500"
          />
          <div className="ml-4 ">
            <p className="font-semibold text-blue-600">
              {project.leader?.firstName} {project.leader?.lastName}
            </p>
            <p className="text-sm text-gray-600 pt-1">
              {project.leader?.email}
            </p>
            <p className="text-sm text-green-500">{project.leader?.role}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LeaderPopup;
