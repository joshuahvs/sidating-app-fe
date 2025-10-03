import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import VListInput from '../VListInput.vue'
 
describe('VListInput', () => {
  const defaultProps = {
    modelValue: []
  }
 
  let wrapper: any
 
  beforeEach(() => {
    wrapper = mount(VListInput, {
      props: defaultProps
    })
  })
 
  it('should render correctly with required props', () => {
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('div').exists()).toBe(true)
  })
 
  it('should render label when provided', () => {
    const wrapper = mount(VListInput, {
      props: {
        ...defaultProps,
        label: 'Test Label'
      }
    })
    
    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Test Label')
    expect(label.attributes('for')).toBe('Test Label')
  })
 
  it('should not render label when not provided', () => {
    expect(wrapper.find('label').exists()).toBe(false)
  })
 
  it('should use custom placeholder when provided', () => {
    const wrapper = mount(VListInput, {
      props: {
        ...defaultProps,
        placeholder: 'Custom placeholder'
      }
    })
    
    expect(wrapper.find('input').attributes('placeholder')).toBe('Custom placeholder')
  })
 
  it('should use default placeholder when not provided', () => {
    expect(wrapper.find('input').attributes('placeholder')).toBe('Type and press Enter')
  })
 
  it('should initialize with modelValue items', () => {
    const wrapper = mount(VListInput, {
      props: {
        modelValue: ['item1', 'item2']
      }
    })
    
    const spans = wrapper.findAll('span')
    expect(spans).toHaveLength(2)
    expect(spans[0].text()).toContain('item1')
    expect(spans[1].text()).toContain('item2')
  })
 
  it('should watch modelValue changes and update items', async () => {
    const wrapper = mount(VListInput, {
      props: {
        modelValue: ['initial']
      }
    })
    
    // Change modelValue prop
    await wrapper.setProps({ modelValue: ['updated', 'items'] })
    await nextTick()
    
    const spans = wrapper.findAll('span')
    expect(spans).toHaveLength(2)
    expect(spans[0].text()).toContain('updated')
    expect(spans[1].text()).toContain('items')
  })
 
  it('should not update items when modelValue is same as current items', async () => {
    const wrapper = mount(VListInput, {
      props: {
        modelValue: ['item1']
      }
    })
    
    // Set same value - should not trigger update
    await wrapper.setProps({ modelValue: ['item1'] })
    await nextTick()
    
    const spans = wrapper.findAll('span')
    expect(spans).toHaveLength(1)
    expect(spans[0].text()).toContain('item1')
  })
 
  it('should handle undefined modelValue in watch', async () => {
    const wrapper = mount(VListInput, {
      props: {
        modelValue: ['item1']
      }
    })
    
    // Set undefined value - should not update items
    await wrapper.setProps({ modelValue: undefined })
    await nextTick()
    
    // Items should remain unchanged
    const spans = wrapper.findAll('span')
    expect(spans).toHaveLength(1)
  })
 
  it('should add item on Enter key press', async () => {
    const input = wrapper.find('input')
    
    // Set input value
    await input.setValue('new item')
    
    // Trigger Enter key
    await input.trigger('keydown', { key: 'Enter' })
    
    // Check if item was added
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['new item']])
    
    // Check if input was cleared
    expect(input.element.value).toBe('')
  })
 
  it('should add item on comma key press', async () => {
    const input = wrapper.find('input')
    
    await input.setValue('comma item')
    await input.trigger('keydown', { key: ',' })
    
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['comma item']])
    expect(input.element.value).toBe('')
  })
 
  it('should not add empty or whitespace-only items', async () => {
    const input = wrapper.find('input')
    
    // Try to add empty string
    await input.setValue('')
    await input.trigger('keydown', { key: 'Enter' })
    
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    
    // Try to add whitespace only
    await input.setValue('   ')
    await input.trigger('keydown', { key: 'Enter' })
    
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })
 
  it('should prevent duplicates when allowDuplicates is false', async () => {
    const wrapper = mount(VListInput, {
      props: {
        modelValue: ['existing'],
        allowDuplicates: false
      }
    })
    
    const input = wrapper.find('input')
    
    // Try to add duplicate
    await input.setValue('existing')
    await input.trigger('keydown', { key: 'Enter' })
    
    // Should not emit update
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    
    // Input should be cleared
    expect(input.element.value).toBe('')
  })
 
  it('should allow duplicates when allowDuplicates is true', async () => {
    const wrapper = mount(VListInput, {
      props: {
        modelValue: ['existing'],
        allowDuplicates: true
      }
    })
    
    const input = wrapper.find('input')
    
    await input.setValue('existing')
    await input.trigger('keydown', { key: 'Enter' })
    
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['existing', 'existing']])
  })
 
  it('should remove item when remove button is clicked', async () => {
    const wrapper = mount(VListInput, {
      props: {
        modelValue: ['item1', 'item2', 'item3']
      }
    })
    
    // Click remove button for second item (index 1)
    const removeButtons = wrapper.findAll('button')
    await removeButtons[1].trigger('click')
    
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['item1', 'item3']])
  })
 
  it('should handle Backspace key when input is empty and items exist', async () => {
    const wrapper = mount(VListInput, {
      props: {
        modelValue: ['item1', 'item2']
      }
    })
    
    const input = wrapper.find('input')
    
    // Ensure input is empty
    await input.setValue('')
    
    // Trigger Backspace
    await input.trigger('keydown', { key: 'Backspace' })
    
    // Should remove last item and put it in input
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['item1']])
    expect(input.element.value).toBe('item2')
  })
 
  it('should not handle Backspace when input has content', async () => {
    const wrapper = mount(VListInput, {
      props: {
        modelValue: ['item1']
      }
    })
    
    const input = wrapper.find('input')
    
    // Set input value
    await input.setValue('some text')
    
    // Trigger Backspace
    await input.trigger('keydown', { key: 'Backspace' })
    
    // Should not remove items or emit update
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })
 
  it('should not handle Backspace when no items exist', async () => {
    const input = wrapper.find('input')
    
    // Ensure input is empty and no items exist
    await input.setValue('')
    
    // Trigger Backspace
    await input.trigger('keydown', { key: 'Backspace' })
    
    // Should not emit update
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })
 
  it('should add item on blur event', async () => {
    const input = wrapper.find('input')
    
    await input.setValue('blur item')
    await input.trigger('blur')
    
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['blur item']])
  })
 
  it('should not add empty item on blur', async () => {
    const input = wrapper.find('input')
    
    await input.setValue('')
    await input.trigger('blur')
    
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })
 
  it('should trim whitespace from items', async () => {
    const input = wrapper.find('input')
    
    await input.setValue('  spaced item  ')
    await input.trigger('keydown', { key: 'Enter' })
    
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['spaced item']])
  })
 
  it('should handle other keyboard events without action', async () => {
    const input = wrapper.find('input')
    
    await input.setValue('test')
    await input.trigger('keydown', { key: 'Tab' })
    await input.trigger('keydown', { key: 'Escape' })
    await input.trigger('keydown', { key: 'a' })
    
    // Should not emit any updates
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    
    // Input value should remain
    expect(input.element.value).toBe('test')
  })
 
  it('should render remove buttons with correct aria-label', async () => {
    const wrapper = mount(VListInput, {
      props: {
        modelValue: ['item1']
      }
    })
    
    const removeButton = wrapper.find('button')
    expect(removeButton.attributes('aria-label')).toBe('remove')
    expect(removeButton.text()).toBe('×')
  })
 
  it('should handle multiple rapid additions', async () => {
    const input = wrapper.find('input')
    
    // Add multiple items rapidly
    await input.setValue('item1')
    await input.trigger('keydown', { key: 'Enter' })
    
    await input.setValue('item2')
    await input.trigger('keydown', { key: ',' })
    
    await input.setValue('item3')
    await input.trigger('blur')
    
    expect(wrapper.emitted('update:modelValue')).toHaveLength(3)
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['item1']])
    expect(wrapper.emitted('update:modelValue')![1]).toEqual([['item1', 'item2']])
    expect(wrapper.emitted('update:modelValue')![2]).toEqual([['item1', 'item2', 'item3']])
  })
})