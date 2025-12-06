import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VSelect from '../VSelect.vue'

describe('VSelect', () => {
  const defaultProps = {
    id: 'test-select',
    modelValue: '',
  }

  it('should render correctly with required props', () => {
    const wrapper = mount(VSelect, {
      props: defaultProps,
    })
    expect(wrapper.find('select').exists()).toBe(true)
    expect(wrapper.find('select').attributes('id')).toBe('test-select')
  })

  it('should render label when provided', () => {
    const wrapper = mount(VSelect, {
      props: {
        ...defaultProps,
        label: 'Test Label',
      },
    })
    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Test Label')
    expect(label.attributes('for')).toBe('test-select')
  })

  it('should not render label when not provided', () => {
    const wrapper = mount(VSelect, {
      props: defaultProps,
    })
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('should set select name correctly', () => {
    const wrapper = mount(VSelect, {
      props: {
        ...defaultProps,
        name: 'test-name',
      },
    })
    expect(wrapper.find('select').attributes('name')).toBe('test-name')
  })

  it('should display modelValue as select value', () => {
    const wrapper = mount(VSelect, {
      props: {
        ...defaultProps,
        modelValue: 'option1',
      },
      slots: {
        default: '<option value="option1">Option 1</option><option value="option2">Option 2</option>',
      },
    })
    expect(wrapper.find('select').element.value).toBe('option1')
  })

  it('should render slot content (options)', () => {
    const wrapper = mount(VSelect, {
      props: defaultProps,
      slots: {
        default: '<option value="1">Option 1</option><option value="2">Option 2</option>',
      },
    })
    const options = wrapper.findAll('option')
    expect(options).toHaveLength(2)
    expect(options[0].text()).toBe('Option 1')
    expect(options[1].text()).toBe('Option 2')
  })

  it('should emit update:modelValue on change', async () => {
    const wrapper = mount(VSelect, {
      props: defaultProps,
      slots: {
        default: '<option value="1">Option 1</option><option value="2">Option 2</option>',
      },
    })
    const select = wrapper.find('select')
    await select.setValue('2')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['2'])
  })

  it('should handle multiple select changes', async () => {
    const wrapper = mount(VSelect, {
      props: defaultProps,
      slots: {
        default: '<option value="1">Option 1</option><option value="2">Option 2</option><option value="3">Option 3</option>',
      },
    })
    const select = wrapper.find('select')
    await select.setValue('3')
    await select.setValue('1')
    await select.setValue('2')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(3)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['3'])
    expect(wrapper.emitted('update:modelValue')![1]).toEqual(['1'])
    expect(wrapper.emitted('update:modelValue')![2]).toEqual(['2'])
  })
})