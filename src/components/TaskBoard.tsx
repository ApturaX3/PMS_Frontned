import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Column from './Column';
import { PlusCircle } from 'react-feather';

interface Task {
  id: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface BoardData {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
}

const initialData: BoardData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Take out the garbage', priority: 'low' },
    'task-2': { id: 'task-2', content: 'Watch my favorite show', priority: 'medium' },
    'task-3': { id: 'task-3', content: 'Charge my phone', priority: 'high' },
    'task-4': { id: 'task-4', content: 'Cook dinner', priority: 'medium' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To do',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In progress',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

export default function TaskBoard() {
  const [boardData, setBoardData] = useState<BoardData>(initialData);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = boardData.columns[source.droppableId];
    const finish = boardData.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...boardData,
        columns: {
          ...boardData.columns,
          [newColumn.id]: newColumn,
        },
      };

      setBoardData(newState);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...boardData,
      columns: {
        ...boardData.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setBoardData(newState);
  };

  const addNewColumn = () => {
    if (newColumnTitle.trim() === '') return;

    const newColumnId = `column-${Object.keys(boardData.columns).length + 1}`;
    const newColumn: Column = {
      id: newColumnId,
      title: newColumnTitle,
      taskIds: [],
    };

    setBoardData((prevState) => ({
      ...prevState,
      columns: {
        ...prevState.columns,
        [newColumnId]: newColumn,
      },
      columnOrder: [...prevState.columnOrder, newColumnId],
    }));

    setNewColumnTitle('');
  };

  const deleteColumn = (columnId: string) => {
    const newBoardData = { ...boardData };
    const column = newBoardData.columns[columnId];
    
    // Delete tasks associated with this column
    column.taskIds.forEach(taskId => {
      delete newBoardData.tasks[taskId];
    });

    // Delete the column
    delete newBoardData.columns[columnId];
    newBoardData.columnOrder = newBoardData.columnOrder.filter(id => id !== columnId);

    setBoardData(newBoardData);
  };

  const addTask = (columnId: string, taskContent: string) => {
    const newTaskId = `task-${Object.keys(boardData.tasks).length + 1}`;
    const newTask: Task = {
      id: newTaskId,
      content: taskContent,
      priority: 'medium', // Default priority
    };

    setBoardData((prevState) => ({
      ...prevState,
      tasks: {
        ...prevState.tasks,
        [newTaskId]: newTask,
      },
      columns: {
        ...prevState.columns,
        [columnId]: {
          ...prevState.columns[columnId],
          taskIds: [...prevState.columns[columnId].taskIds, newTaskId],
        },
      },
    }));
  };

  const deleteTask = (columnId: string, taskId: string) => {
    const newBoardData = { ...boardData };
    
    // Remove task from column
    newBoardData.columns[columnId].taskIds = newBoardData.columns[columnId].taskIds.filter(id => id !== taskId);
    
    // Delete task
    delete newBoardData.tasks[taskId];

    setBoardData(newBoardData);
  };

  const updateColumnTitle = (columnId: string, newTitle: string) => {
    setBoardData((prevState) => ({
      ...prevState,
      columns: {
        ...prevState.columns,
        [columnId]: {
          ...prevState.columns[columnId],
          title: newTitle,
        },
      },
    }));
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8 text-white text-center">Project Tasks</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-wrap gap-6 justify-center">
          {boardData.columnOrder.map((columnId) => {
            const column = boardData.columns[columnId];
            const tasks = column.taskIds.map((taskId) => boardData.tasks[taskId]);

            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                deleteColumn={deleteColumn}
                addTask={addTask}
                deleteTask={deleteTask}
                updateColumnTitle={updateColumnTitle}
              />
            );
          })}
          <div className="bg-white bg-opacity-20 rounded-lg p-4 w-80">
            <input
              type="text"
              placeholder="New Column Title"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <button
              onClick={addNewColumn}
              className="w-full bg-green-500 text-white p-2 rounded flex items-center justify-center"
            >
              <PlusCircle size={16} className="mr-2" />
              Add New Column
            </button>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}

