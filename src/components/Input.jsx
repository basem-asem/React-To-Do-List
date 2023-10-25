import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./TodoList.css"; // Create TodoList.css for styling

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTask, setEditedTask] = useState("");

  useEffect(() => {
    // Load tasks from localStorage when the component mounts
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []); // Empty dependency array ensures the effect runs only once (on mount)

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedTasks = Array.from(tasks);
    const [removed] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, removed);

    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditedTask(tasks[index].text);
  };

  const saveEditedTask = () => {
    if (editingIndex !== null && editedTask.trim() !== "") {
      const updatedTasks = tasks.map((task, index) =>
        index === editingIndex ? { ...task, text: editedTask } : task
      );

      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setEditingIndex(null);
    }
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditedTask("");
  };

  const addTask = () => {
    if (task.trim() !== "") {
      const newTasks = [...tasks, { text: task, isDone: false }];
      setTasks(newTasks);
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      setTask("");
    }
  };

  const toggleTaskDone = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, isDone: !task.isDone } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  return (
    <div className="todo-list">
      <h1>To-Do List</h1>
      <p className="py-3">Total Tasks Remaining: {tasks.length}</p>
      <div className="input-container">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add</button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={`${tasks.length}`}>
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((task, index) => (
                <Draggable key={index} draggableId={index.toString()} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`my-2 flex justify-between items-center flex-col sm:flex-row gap-3 ${task.isDone ? "done" : ""}`}
                    >
                      {editingIndex === index ? (
                        <>
                          <input
                            type="text"
                            value={editedTask}
                            onChange={(e) => setEditedTask(e.target.value)}
                          />
                          <div className="buttons">
                            <button onClick={saveEditedTask}>Save</button>
                            <button onClick={cancelEditing}>Cancel</button>
                          </div>
                        </>
                      ) : (
                        <>
                          {task.text}
                          <div className="buttons">
                            <button onClick={() => toggleTaskDone(index)}>
                              {task.isDone ? "Undo" : "Done"}
                            </button>
                            <button onClick={() => removeTask(index)}>Remove</button>
                            <button onClick={() => startEditing(index)}>Edit</button>
                          </div>
                        </>
                      )}
                    </li>
                  )}
                </Draggable>
              ))}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TodoList;
