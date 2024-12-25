import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';
import { Plus, X } from 'react-feather';

interface ColumnProps {
  column: {
    id: string;
    title: string;
    taskIds: string[];
  };
  tasks: {
    id: string;
    content: string;
    priority: 'low' | 'medium' | 'high';
  }[];
  deleteColumn: (columnId: string) => void;
  addTask: (columnId: string, taskContent: string) => void;
  deleteTask: (columnId: string, taskId: string) => void;
  updateColumnTitle: (columnId: string, newTitle: string) => void;
}

export default function Column({ column, tasks, deleteColumn, addTask, deleteTask, updateColumnTitle }: ColumnProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);

  const handleAddTask = () => {
    if (newTaskContent.trim() !== '') {
      addTask(column.id, newTaskContent);
      setNewTaskContent('');
      setIsAddingTask(false);
    }
  };

  const handleUpdateTitle = () => {
    if (editedTitle.trim() !== '') {
      updateColumnTitle(column.id, editedTitle);
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-80 flex flex-col">
      {isEditingTitle ? (
        <div className="p-4 flex">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded mr-2"
          />
          <button onClick={handleUpdateTitle} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        </div>
      ) : (
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{column.title}</h2>
          <div>
            <button onClick={() => setIsEditingTitle(true)} className="text-gray-600 hover:text-gray-800 mr-2">
              Edit
            </button>
            <button onClick={() => deleteColumn(column.id)} className="text-red-500 hover:text-red-700">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex-grow overflow-y-auto p-4 transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'
            }`}
            style={{
              minHeight: `${Math.max(tasks.length * 100, 50)}px`,
              maxHeight: '70vh'
            }}
          >
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} deleteTask={() => deleteTask(column.id, task.id)} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {column.title === 'To do' && (
        isAddingTask ? (
          <div className="p-4 border-t">
            <input
              type="text"
              placeholder="Enter task content"
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <div className="flex justify-end">
              <button onClick={handleAddTask} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                Add
              </button>
              <button onClick={() => setIsAddingTask(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="w-full p-4 text-gray-600 hover:text-gray-800 flex items-center justify-center border-t"
          >
            <Plus size={16} className="mr-2" />
            Add Task
          </button>
        )
      )}
    </div>
  );
}

