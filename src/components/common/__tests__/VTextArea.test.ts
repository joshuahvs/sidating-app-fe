import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VTextArea from '../VTextArea.vue'
 
describe('VTextArea', () => {
  const defaultProps = {
    id: 'test-textarea',
    modelValue: ''
  }
 
  it('should render correctly with required props', () => {
    const wrapper = mount(VTextArea, {
      props: defaultProps
    })
    
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('textarea').attributes('id')).toBe('test-textarea')
  })
 
  it('should render label when provided', () => {
    const wrapper = mount(VTextArea, {
      props: {
        ...defaultProps,
        label: 'Test Label'
      }
    })
    
    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Test Label')
    expect(label.attributes('for')).toBe('test-textarea')
  })
 
  it('should not render label when not provided', () => {
    const wrapper = mount(VTextArea, {
      props: defaultProps
    })
    
    expect(wrapper.find('label').exists()).toBe(false)
  })
 
  it('should set textarea name correctly', () => {
    const wrapper = mount(VTextArea, {
      props: {
        ...defaultProps,
        name: 'test-name'
      }
    })
    
    expect(wrapper.find('textarea').attributes('name')).toBe('test-name')
  })
 
  it('should display modelValue as textarea value', () => {
    const wrapper = mount(VTextArea, {
      props: {
        ...defaultProps,
        modelValue: 'test content'
      }
    })
    
    expect(wrapper.find('textarea').element.value).toBe('test content')
  })
 
  it('should emit update:modelValue on input', async () => {
    const wrapper = mount(VTextArea, {
      props: defaultProps
    })
    
    const textarea = wrapper.find('textarea')
    await textarea.setValue('new content')
    
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['new content'])
  })
 
  it('should handle multiline content', async () => {
    const wrapper = mount(VTextArea, {
      props: defaultProps
    })
    
    const multilineContent = 'Line 1\nLine 2\nLine 3'
    const textarea = wrapper.find('textarea')
    await textarea.setValue(multilineContent)
    
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([multilineContent])
  })
 
  it('should handle multiple input changes', async () => {
    const wrapper = mount(VTextArea, {
      props: defaultProps
    })
    
    const textarea = wrapper.find('textarea')
    await textarea.setValue('first content')
    await textarea.setValue('second content')
    await textarea.setValue('third content')
    
    expect(wrapper.emitted('update:modelValue')).toHaveLength(3)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['first content'])
    expect(wrapper.emitted('update:modelValue')![1]).toEqual(['second content'])
    expect(wrapper.emitted('update:modelValue')![2]).toEqual(['third content'])
  })
})