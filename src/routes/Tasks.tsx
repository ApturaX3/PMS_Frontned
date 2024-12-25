import React from 'react';
import TaskBoard from '@/components/TaskBoard';

function Tasks() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 py-8">
      <TaskBoard />
    </div>
  );
}

export default Tasks;
