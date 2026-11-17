import { createContext, useContext } from 'react';

// 할 일 상태 공유를 위한 React Context (TaskProvider와 useTasks가 함께 쓴다)
export const TaskContext = createContext(null);

// 편의를 위한 Custom Hook
export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
