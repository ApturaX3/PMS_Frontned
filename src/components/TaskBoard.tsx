import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { PlusCircle, X } from 'react-feather';
import { TaskDetails } from './TaskDetails';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

interface Task {
  id: string;
  content: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  assignee: {
    name: string;
    avatar: string;
  };
  reporter: {
    name: string;
    avatar: string;
  };
  company: string;
  marketingMaterials: {
    datasheet: boolean;
    factsheet: boolean;
    ads: boolean;
  };
  brochureStatus: string;
  comparisonSheetStatus: string;
  labels: string[];
  orderNumber: string;
  dueDate: string;
  status: string;
  comments: Comment[];
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
    'task-1': {
      id: 'task-1',
      content: 'Create marketing materials for contextual controllers',
      description: 'We need to prepare comprehensive marketing materials for our new line of contextual controllers. This includes product brochures, datasheets, and online advertising content.',
      priority: 'high',
      assignee: {
        name: 'Peter Jacobs',
        avatar: '/placeholder.svg?height=32&width=32'
      },
      reporter: {
        name: 'Larry Stauffer',
        avatar: '/placeholder.svg?height=32&width=32'
      },
      company: 'Smart Controllers Inc.',
      marketingMaterials: {
        datasheet: true,
        factsheet: true,
        ads: false
      },
      brochureStatus: 'In Progress',
      comparisonSheetStatus: 'Not Started',
      labels: ['marketing'],
      orderNumber: '2023-08-15-4',
      dueDate: 'Oct 1, 2023',
      status: 'To Do',
      comments: [
        {
          id: 'comment-1',
          author: 'Jane Doe',
          avatar: '/placeholder.svg?height=32&width=32',
          content: 'I\'ve started working on the product datasheet. Will share the first draft by EOD.',
          timestamp: '2 hours ago'
        },
        {
          id: 'comment-2',
          author: 'John Smith',
          avatar: '/placeholder.svg?height=32&width=32',
          content: 'Great! Let\'s schedule a review meeting once the first draft is ready.',
          timestamp: '1 hour ago'
        }
      ]
    },
    'task-2': { id: 'task-2', content: 'Watch my favorite show', priority: 'medium', assignee: { name: '', avatar: '' }, reporter: { name: '', avatar: '' }, company: '', marketingMaterials: { datasheet: false, factsheet: false, ads: false }, brochureStatus: '', comparisonSheetStatus: '', labels: [], orderNumber: '', dueDate: '', status: '', comments: [] },
    'task-3': { id: 'task-3', content: 'Charge my phone', priority: 'high', assignee: { name: '', avatar: '' }, reporter: { name: '', avatar: '' }, company: '', marketingMaterials: { datasheet: false, factsheet: false, ads: false }, brochureStatus: '', comparisonSheetStatus: '', labels: [], orderNumber: '', dueDate: '', status: '', comments: [] },
    'task-4': { id: 'task-4', content: 'Cook dinner', priority: 'medium', assignee: { name: '', avatar: '' }, reporter: { name: '', avatar: '' }, company: '', marketingMaterials: { datasheet: false, factsheet: false, ads: false }, brochureStatus: '', comparisonSheetStatus: '', labels: [], orderNumber: '', dueDate: '', status: '', comments: [] },
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
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

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

    column.taskIds.forEach(taskId => {
      delete newBoardData.tasks[taskId];
    });

    delete newBoardData.columns[columnId];
    newBoardData.columnOrder = newBoardData.columnOrder.filter(id => id !== columnId);

    setBoardData(newBoardData);
  };

  const addTask = (columnId: string, taskContent: string) => {
    const newTaskId = `task-${Object.keys(boardData.tasks).length + 1}`;
    const newTask: Task = {
      id: newTaskId,
      content: taskContent,
      priority: 'medium',
      assignee: { name: '', avatar: '' },
      reporter: { name: '', avatar: '' },
      company: '',
      marketingMaterials: { datasheet: false, factsheet: false, ads: false },
      brochureStatus: '',
      comparisonSheetStatus: '',
      labels: [],
      orderNumber: '',
      dueDate: '',
      status: '',
      comments: []
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

    newBoardData.columns[columnId].taskIds = newBoardData.columns[columnId].taskIds.filter(id => id !== taskId);
    delete newBoardData.tasks[taskId];

    setBoardData(newBoardData);
  };

  // const updateColumnTitle = (columnId: string, newTitle: string) => {
  //   setBoardData((prevState) => ({
  //     ...prevState,
  //     columns: {
  //       ...prevState.columns,
  //       [columnId]: {
  //         ...prevState.columns[columnId],
  //         title: newTitle,
  //       },
  //     },
  //   }));
  // };

  const handleTaskClick = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTask(taskId);
  };

  const handleDeleteTask = (e: React.MouseEvent, columnId: string, taskId: string) => {
    e.stopPropagation();
    deleteTask(columnId, taskId);
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
              <div key={column.id} className="bg-white rounded-lg shadow-lg w-80 flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-xl font-semibold text-gray-800">{column.title}</h2>
                  <button onClick={() => deleteColumn(column.id)} className="text-red-500 hover:text-red-700">
                    <X size={16} />
                  </button>
                </div>
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
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={(e) => handleTaskClick(task.id, e)}
                              className={`p-4 mb-3 rounded-lg shadow-sm border-l-4 cursor-pointer ${
                                task.priority === 'low' ? 'border-green-400 bg-green-50' :
                                task.priority === 'medium' ? 'border-yellow-400 bg-yellow-50' :
                                'border-red-400 bg-red-50'
                              } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                            >
                              <div className="flex justify-between items-start">
                                <p className="font-medium">{task.content}</p>
                                <button 
                                  onClick={(e) => handleDeleteTask(e, column.id, task.id)} 
                                  className="text-gray-500 hover:text-red-500"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                              <div className="mt-2">
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
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                {column.title === 'To do' && (
                  <button
                    onClick={() => addTask(column.id, 'New Task')}
                    className="w-full p-4 text-gray-600 hover:text-gray-800 flex items-center justify-center border-t"
                  >
                    <PlusCircle size={16} className="mr-2" />
                    Add Task
                  </button>
                )}
              </div>
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
      <TaskDetails
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask ? { ...boardData.tasks[selectedTask], description: boardData.tasks[selectedTask].description || '' } : null}
      />
    </div>
  );
}

