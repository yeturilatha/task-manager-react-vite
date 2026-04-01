import { describe, it, expect } from 'vitest'
import reducer, {
  addTask,
  deleteTask,
  updateTask,
  toggleStatus,
  setTasks,
} from '../features/tasks/taskSlice'

describe('taskSlice', () => {

  const initialState = {
    tasks: [],
  }

  const sampleTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Desc',
    status: 'pending',
  }

  // ✅ 1. addTask
  it('should add a task', () => {
    const state = reducer(initialState, addTask(sampleTask))

    expect(state.tasks.length).toBe(1)
    expect(state.tasks[0]).toEqual(sampleTask)
  })

  // ✅ 2. deleteTask
  it('should delete a task', () => {
    const stateWithTask = {
      tasks: [sampleTask],
    }

    const state = reducer(stateWithTask, deleteTask('1'))

    expect(state.tasks.length).toBe(0)
  })

  // ✅ 3. updateTask (found)
  it('should update a task when found', () => {
    const stateWithTask = {
      tasks: [sampleTask],
    }

    const updatedTask = {
      ...sampleTask,
      title: 'Updated',
    }

    const state = reducer(stateWithTask, updateTask(updatedTask))

    expect(state.tasks[0].title).toBe('Updated')
  })

  // ✅ 4. updateTask (NOT found branch)
  it('should not update if task not found', () => {
    const stateWithTask = {
      tasks: [sampleTask],
    }

    const updatedTask = {
      id: '999',
      title: 'Updated',
      description: 'Desc',
      status: 'pending',
    }

    const state = reducer(stateWithTask, updateTask(updatedTask))

    expect(state.tasks[0]).toEqual(sampleTask) // unchanged
  })

  // ✅ 5. setTasks
  it('should set tasks', () => {
    const newTasks = [
      { id: '2', title: 'New', description: 'Desc', status: 'pending' },
    ]

    const state = reducer(initialState, setTasks(newTasks))

    expect(state.tasks).toEqual(newTasks)
  })

  // ✅ 6. toggleStatus (pending → completed)
  it('should toggle status from pending to completed', () => {
    const stateWithTask = {
      tasks: [sampleTask],
    }

    const state = reducer(stateWithTask, toggleStatus('1'))

    expect(state.tasks[0].status).toBe('completed')
  })

  // ✅ 7. toggleStatus (completed → pending)
  it('should toggle status from completed to pending', () => {
    const stateWithTask = {
      tasks: [{ ...sampleTask, status: 'completed' }],
    }

    const state = reducer(stateWithTask, toggleStatus('1'))

    expect(state.tasks[0].status).toBe('pending')
  })

  // ✅ 8. toggleStatus (NOT found branch)
  it('should do nothing if task not found', () => {
    const stateWithTask = {
      tasks: [sampleTask],
    }

    const state = reducer(stateWithTask, toggleStatus('999'))

    expect(state.tasks[0]).toEqual(sampleTask)
  })

})