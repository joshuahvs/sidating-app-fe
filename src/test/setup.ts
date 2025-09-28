import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock UUID to have predictable test results
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'test-uuid-123')
}))

// Mock vue-sonner
vi.mock('vue-sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }
}))

// Mock simple-datatables
vi.mock('simple-datatables', () => ({
  DataTable: vi.fn().mockImplementation(() => ({
    destroy: vi.fn(),
    rows: vi.fn(() => ({
      remove: vi.fn()
    }))
  }))
}))

// Mock import.meta.env
Object.defineProperty(import.meta, 'env', {
  value: {
    NODE_ENV: 'test',
    BASE_URL: '/'
  }
})