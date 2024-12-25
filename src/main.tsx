import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { DragDropContext } from 'react-beautiful-dnd';

ReactDOM.render(
  <React.StrictMode>
    <DragDropContext onDragEnd={() => {}}>
      <App />
    </DragDropContext>
  </React.StrictMode>,
  document.getElementById('root')
);