import TaskCard from "./TaskCard";
import TaskEmptyState from "./TaskEmptyState";
const TaskList = ({ tasks, onToggle, onDelete, onUpdate }) => {
  if (tasks.length === 0) {
    return <TaskEmptyState />;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default TaskList;
