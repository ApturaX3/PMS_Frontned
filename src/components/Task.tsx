import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { X } from 'react-feather';

const priorityColors = {
  low: 'bg-green-100 border-green-400 text-green-800',
  medium: 'bg-yellow-100 border-yellow-400 text-yellow-800',
  high: 'bg-red-100 border-red-400 text-red-800',
};

interface TaskProps {
  task: {
    id: string;
    content: string;
    priority: 'low' | 'medium' | 'high';
  };
  index: number;
  deleteTask: () => void;
}

export default function Task({ task, index, deleteTask }: TaskProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 mb-3 rounded-lg shadow-sm border-l-4 ${
            priorityColors[task.priority]
          } ${snapshot.isDragging ? 'shadow-lg' : ''} bg-white`}
        >
          <div className="flex justify-between items-start">
            <p className="font-medium">{task.content}</p>
            <button onClick={deleteTask} className="text-gray-500 hover:text-red-500">
              <X size={16} />
            </button>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              task.priority === 'low' ? 'bg-green-200 text-green-800' :
              task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
              'bg-red-200 text-red-800'
            }`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}

