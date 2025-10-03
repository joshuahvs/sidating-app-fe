import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AboutView from '../AboutView.vue'
 
describe('AboutView', () => {
  it('should render correctly', () => {
    const wrapper = mount(AboutView)
    
    expect(wrapper.find('.about').exists()).toBe(true)
    expect(wrapper.find('h1').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('This is an about page')
  })
 
  it('should have correct structure', () => {
    const wrapper = mount(AboutView)
    
    const aboutDiv = wrapper.find('.about')
    expect(aboutDiv.exists()).toBe(true)
    
    const heading = aboutDiv.find('h1')
    expect(heading.exists()).toBe(true)
    expect(heading.text()).toBe('This is an about page')
  })
 
  it('should have about class on main container', () => {
    const wrapper = mount(AboutView)
    
    const container = wrapper.find('div')
    expect(container.classes()).toContain('about')
  })
 
  it('should render as a single div with h1 child', () => {
    const wrapper = mount(AboutView)
    
    // Should have one main div
    expect(wrapper.findAll('div')).toHaveLength(1)
    
    // Should have one h1
    expect(wrapper.findAll('h1')).toHaveLength(1)
    
    // H1 should be child of the div
    const aboutDiv = wrapper.find('.about')
    const h1 = aboutDiv.find('h1')
    expect(h1.exists()).toBe(true)
  })
 
  it('should have correct text content', () => {
    const wrapper = mount(AboutView)
    
    expect(wrapper.text()).toBe('This is an about page')
    expect(wrapper.html()).toContain('This is an about page')
  })
 
  it('should mount without errors', () => {
    expect(() => {
      mount(AboutView)
    }).not.toThrow()
  })
 
  it('should be a valid Vue component', () => {
    const wrapper = mount(AboutView)
    
    expect(wrapper.vm).toBeDefined()
    expect(wrapper.exists()).toBe(true)
  })
})