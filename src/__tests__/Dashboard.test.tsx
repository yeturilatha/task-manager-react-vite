import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'

// 🔥 dynamic tasks state
let mockTasks: any[] = []

// ✅ MOCK REDUX
const mockDispatch = vi.fn()

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (fn: any) =>
    fn({
      tasks: {
        tasks: mockTasks,
      },
    }),
}))

// ✅ MOCK ROUTER
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// ✅ MOCK APIs
const mockGetTasks = vi.fn()
const mockAddTask = vi.fn()
const mockUpdateTask = vi.fn()
const mockDeleteTask = vi.fn()

vi.mock('../services/api', () => ({
  getTasksAPI: () => mockGetTasks(),
  addTaskAPI: (task: any) => mockAddTask(task),
  updateTaskAPI: (task: any) => mockUpdateTask(task),
  deleteTaskAPI: (id: string) => mockDeleteTask(id),
}))

describe('Dashboard Page', () => {

  const renderDashboard = () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )
  }

  beforeEach(() => {
    mockTasks = []
    vi.clearAllMocks()
    localStorage.clear()
  })

  // ✅ 1. useEffect load tasks
  it('loads tasks from API', async () => {
    mockGetTasks.mockResolvedValue([])

    renderDashboard()

    await waitFor(() => {
      expect(mockGetTasks).toHaveBeenCalled()
    })
  })

  // ✅ 2. Empty state
  it('shows empty message', async () => {
    mockTasks = []
    renderDashboard()

    expect(await screen.findByText(/no tasks available/i)).toBeInTheDocument()
  })

  // ✅ 3. Add task
  it('adds a task', async () => {
    renderDashboard()

    fireEvent.change(screen.getByPlaceholderText(/title/i), {
      target: { value: 'Task 1' },
    })

    fireEvent.change(screen.getByPlaceholderText(/description/i), {
      target: { value: 'Desc' },
    })

    mockAddTask.mockResolvedValue({
      id: '1',
      title: 'Task 1',
      description: 'Desc',
      status: 'pending',
    })

    fireEvent.click(screen.getByText(/add/i))

    await waitFor(() => {
      expect(mockAddTask).toHaveBeenCalled()
    })
  })

  // ✅ 4. Prevent add when title empty (IMPORTANT branch)
  it('does not add task when title is empty', () => {
    renderDashboard()

    fireEvent.click(screen.getByText(/add/i))

    expect(mockAddTask).not.toHaveBeenCalled()
  })

  // ✅ 5. Update task branch
  it('updates a task', async () => {
    mockTasks = [
      { id: '1', title: 'Old', description: 'Old', status: 'pending' },
    ]

    renderDashboard()

    fireEvent.click(await screen.findByText(/edit/i))

    fireEvent.change(screen.getByPlaceholderText(/title/i), {
      target: { value: 'Updated' },
    })

    fireEvent.click(screen.getByText(/update/i))

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalled()
    })
  })

  // ✅ 6. Delete task
  it('deletes a task', async () => {
    mockTasks = [
      { id: '1', title: 'Task', description: 'Desc', status: 'pending' },
    ]

    renderDashboard()

    fireEvent.click(await screen.findByText(/delete/i))

    await waitFor(() => {
      expect(mockDeleteTask).toHaveBeenCalledWith('1')
    })
  })

  // ✅ 7. Toggle status
  it('toggles task status', async () => {
    mockTasks = [
      { id: '1', title: 'Task', description: 'Desc', status: 'pending' },
    ]

    renderDashboard()

    fireEvent.click(await screen.findByText(/done/i))

    expect(mockDispatch).toHaveBeenCalled()
  })

  // ✅ 8. Edit fills form
  it('fills form when editing', async () => {
    mockTasks = [
      { id: '1', title: 'Task', description: 'Desc', status: 'pending' },
    ]

    renderDashboard()

    fireEvent.click(await screen.findByText(/edit/i))

    expect(screen.getByDisplayValue('Task')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Desc')).toBeInTheDocument()
  })

  // ✅ 9. Logout branch
  it('logs out user', () => {
    localStorage.setItem('token', 'abc')

    renderDashboard()

    fireEvent.click(screen.getByText(/logout/i))

    expect(localStorage.getItem('token')).toBe(null)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
  // ✅ 10. Completed task branch (VERY IMPORTANT)
it('renders completed task UI', async () => {
  mockTasks = [
    {
      id: '1',
      title: 'Completed Task',
      description: 'Done',
      status: 'completed',
    },
  ]

  renderDashboard()

  // title should have line-through class
  expect(await screen.findByText('Completed Task')).toBeInTheDocument()

  // button should show UNDO
  expect(screen.getByText(/undo/i)).toBeInTheDocument()
})

// ✅ 11. Pending task branch explicitly
it('renders pending task UI', async () => {
  mockTasks = [
    {
      id: '1',
      title: 'Pending Task',
      description: 'Pending',
      status: 'pending',
    },
  ]

  renderDashboard()

  // button should show DONE
  expect(await screen.findByText(/done/i)).toBeInTheDocument()
})

})