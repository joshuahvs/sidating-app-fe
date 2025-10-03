import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VInput from '../VInput.vue'

describe('VInput', () => {
  const defaultProps = {
    id: 'test-input',
    modelValue: '',
  }

  it('should render correctly with required props', () => {
    const wrapper = mount(VInput, {
      props: defaultProps,
    })
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('input').attributes('id')).toBe('test-input')
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('should render label when provided', () => {
    const wrapper = mount(VInput, {
      props: {
        ...defaultProps,
        label: 'Test Label',
      },
    })
    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Test Label')
    expect(label.attributes('for')).toBe('test-input')
  })

  it('should not render label when not provided', () => {
    const wrapper = mount(VInput, {
      props: defaultProps,
    })
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('should set input type correctly', () => {
    const wrapper = mount(VInput, {
      props: {
        ...defaultProps,
        type: 'email',
      },
    })
    expect(wrapper.find('input').attributes('type')).toBe('email')
  })

  it('should set input name correctly', () => {
    const wrapper = mount(VInput, {
      props: {
        ...defaultProps,
        name: 'test-name',
      },
    })
    expect(wrapper.find('input').attributes('name')).toBe('test-name')
  })

  it('should display modelValue as input value', () => {
    const wrapper = mount(VInput, {
      props: {
        ...defaultProps,
        modelValue: 'test value',
      },
    })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('test value')
  })

  it('should emit update:modelValue on input', async () => {
    const wrapper = mount(VInput, {
      props: defaultProps,
    })
    const input = wrapper.find('input')
    await input.setValue('new value')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['new value'])
  })

  it('should handle multiple input changes', async () => {
    const wrapper = mount(VInput, {
      props: defaultProps,
    })
    const input = wrapper.find('input')
    await input.setValue('first')
    await input.setValue('second')
    await input.setValue('third')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(3)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['first'])
    expect(wrapper.emitted('update:modelValue')![1]).toEqual(['second'])
    expect(wrapper.emitted('update:modelValue')![2]).toEqual(['third'])
  })

  it('should use default values for optional props', () => {
    const wrapper = mount(VInput, {
      props: {
        id: 'test',
        modelValue: '',
      },
    })
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('text')
    expect((input.element as HTMLInputElement).value).toBe('')
  })
})