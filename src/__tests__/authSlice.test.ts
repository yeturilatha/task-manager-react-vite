import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('authSlice', () => {

  beforeEach(() => {
    localStorage.clear()
    vi.resetModules() // 🔥 VERY IMPORTANT
  })

  // ✅ 1. initial state when no token
  it('should initialize with no token', async () => {
    const { default: reducer } = await import('../features/auth/authSlice')

    const state = reducer(undefined, { type: 'unknown' })

    expect(state.token).toBe(null)
    expect(state.isAuthenticated).toBe(false)
  })

  // ✅ 2. initial state when token exists (FIXED FINAL)
  it('should initialize with token from localStorage', async () => {
    localStorage.setItem('token', 'abc123')

    // 🔥 force fresh module load
    const { default: reducer } = await import('../features/auth/authSlice')

    const state = reducer(undefined, { type: 'unknown' })

    expect(state.token).toBe('abc123')
    expect(state.isAuthenticated).toBe(true)
  })

  // ✅ 3. login
  it('should login and store token', async () => {
    const { default: reducer, login } = await import('../features/auth/authSlice')

    const state = reducer(
      { token: null, isAuthenticated: false },
      login('my-token')
    )

    expect(state.token).toBe('my-token')
    expect(state.isAuthenticated).toBe(true)
    expect(localStorage.getItem('token')).toBe('my-token')
  })

  // ✅ 4. logout
  it('should logout and clear token', async () => {
    localStorage.setItem('token', 'abc123')

    const { default: reducer, logout } = await import('../features/auth/authSlice')

    const state = reducer(
      { token: 'abc123', isAuthenticated: true },
      logout()
    )

    expect(state.token).toBe(null)
    expect(state.isAuthenticated).toBe(false)
    expect(localStorage.getItem('token')).toBe(null)
  })

})