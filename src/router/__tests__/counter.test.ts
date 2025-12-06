import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
// Import from stores (the store is located in src/stores/counter.ts)
import { useCounterStore } from '../../stores/counter'
 
describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
 
  it('should initialize with count 0', () => {
    const counter = useCounterStore()
    expect(counter.count).toBe(0)
  })
 
  it('should calculate doubleCount correctly', () => {
    const counter = useCounterStore()
    expect(counter.doubleCount).toBe(0)
    
    counter.count = 5
    expect(counter.doubleCount).toBe(10)
    
    counter.count = -3
    expect(counter.doubleCount).toBe(-6)
  })
 
  it('should increment count by 1', () => {
    const counter = useCounterStore()
    expect(counter.count).toBe(0)
    
    counter.increment()
    expect(counter.count).toBe(1)
    
    counter.increment()
    expect(counter.count).toBe(2)
    
    counter.increment()
    expect(counter.count).toBe(3)
  })
 
  it('should update doubleCount when count is incremented', () => {
    const counter = useCounterStore()
    expect(counter.doubleCount).toBe(0)
    
    counter.increment()
    expect(counter.doubleCount).toBe(2)
    
    counter.increment()
    expect(counter.doubleCount).toBe(4)
  })
 
  it('should be reactive', () => {
    const counter = useCounterStore()
    const initialDouble = counter.doubleCount
    
    counter.count = 10
    expect(counter.doubleCount).not.toBe(initialDouble)
    expect(counter.doubleCount).toBe(20)
  })
})