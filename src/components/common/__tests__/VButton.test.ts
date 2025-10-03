import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VButton from '../VButton.vue'

describe('VButton', () => {
  it('should render correctly', () => {
    const wrapper = mount(VButton)
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').classes()).toContain('v-button')
  })

  it('should render slot content', () => {
    const wrapper = mount(VButton, {
      slots: {
        default: 'Click Me'
      }
    })
    expect(wrapper.text()).toBe('Click Me')
  })

  it('should emit click events', async () => {
    const wrapper = mount(VButton)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('should accept custom classes', () => {
    const wrapper = mount(VButton, {
      props: {
        class: 'custom-class'
      }
    })
    expect(wrapper.find('button').classes()).toContain('custom-class')
    expect(wrapper.find('button').classes()).toContain('v-button')
  })

  it('should render with complex slot content', () => {
    const wrapper = mount(VButton, {
      slots: {
        default: '<span>Complex Content</span>'
      }
    })
    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.find('span').text()).toBe('Complex Content')
  })
})