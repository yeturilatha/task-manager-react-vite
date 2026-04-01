import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Login from '../pages/Login'

// ✅ mock navigate
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Login Page', () => {

  const renderLogin = () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
  }

  // ✅ 1. Render UI
  it('renders login form', () => {
    renderLogin()

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(screen.getByText(/login/i)).toBeInTheDocument()
  })

  // ✅ 2. Empty input → invalid branch
  it('shows error when fields are empty', () => {
    renderLogin()

    fireEvent.click(screen.getByText(/login/i))

    expect(
      screen.getByText(/invalid username or password/i)
    ).toBeInTheDocument()
  })

  // ✅ 3. Invalid credentials
  it('shows error for invalid credentials', () => {
    renderLogin()

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'wrong' },
    })

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrong' },
    })

    fireEvent.click(screen.getByText(/login/i))

    expect(
      screen.getByText(/invalid username or password/i)
    ).toBeInTheDocument()
  })

  // ✅ 4. SUCCESS CASE (THIS WAS MISSING 🔥)
  it('logs in successfully and navigates', () => {
    renderLogin()

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'test' }, // ✅ correct value
    })

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'test123' }, // ✅ correct value
    })

    fireEvent.click(screen.getByText(/login/i))

    // ✅ localStorage check
    expect(localStorage.getItem('token')).toBe('fake-jwt-token')

    // ✅ navigation check
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  })

})