import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Button, Collapse, Modal } from 'antd'
import { DeleteOutlined, CopyOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'

import { OptionType } from '../createElementModal'

import { saveMappingElements } from '../../helpers'
import { useDocument } from '../../hooks'
import { SELECT_TYPE_OPTIONS, TYPE_OPTIONS } from '../createElementModal/constants'

const { useForm } = Form
const { confirm } = Modal

function UpdateModal ({ visible, selectedElement, elements, setElements, onClose, setSelectedItemId }) {
  const { id, field, x, y, width, height, fill } = selectedElement

  const [form] = useForm()
  const { scale } = useDocument()

  const setTypeFromColor = color => {
    let type = ''
    for (const option in TYPE_OPTIONS) {
      if (TYPE_OPTIONS[option].fill === color) type = option
    }
    return type
  }

  const onDelete = () => {
    confirm({
      title: 'Are you sure delete this element?',
      icon: <DeleteOutlined />,
      content: 'This action cannot be undone',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk () {
        deleteElement()
      }
    })
  }

  const deleteElement = () => {
    const items = elements.filter(element => element.id !== id)

    saveButtonActionChanges(items)
    onClose()
  }

  const onDuplicate = () => {
    const newItem = { ...selectedElement, ...incrementXYToDuplicate({ x, y }), id: uuidv4() }
    const items = [...elements, newItem]

    setSelectedItemId(newItem.id)
    saveButtonActionChanges(items)
    onClose()
  }

  const saveButtonActionChanges = (items) => {
    saveMappingElements(items, scale)
    setElements(items)
  }

  const incrementXYToDuplicate = ({ x, y }) => {
    return {
      x: x + 10,
      y: y + 30
    }
  }

  const onSave = async () => {
    const { field, type } = await form.validateFields()
    const color = TYPE_OPTIONS[type].fill
    const item = { ...selectedElement, field, type, fill: color }

    setElements(prevElements => prevElements.map(element => element.id === id ? item : element))
    saveMappingElements(elements, scale)
    onClose()
  }

  useEffect(() => {
    if (selectedElement?.id) {
      form.setFieldsValue({
        field,
        type: setTypeFromColor(fill),
        x,
        y,
        width,
        height
      })
    }
  }, [selectedElement])

  const ModalButtons = () => (
    <>
      <Button onClick={onClose} icon={<CloseOutlined />}>Cancel</Button>
      <Button type='primary' icon={<CheckOutlined />} onClick={onSave}>Save</Button>
    </>
  )

  return (
    <Modal visible={visible} onCancel={onClose} footer={<ModalButtons />}>
      <Form form={form} style={{ padding: '30px 0 0 0' }}>
        <Form.Item label='Field' name='field' rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item label='Type' name='type' rules={[{ required: true }]}>
          <Select>
            {SELECT_TYPE_OPTIONS.map(option => (
              <Select.Option key={option.value} value={option.value}>
                <OptionType label={option.label} value={option.value} />
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Collapse style={{ margin: '1rem 0' }}>
          <Collapse.Panel header='Positions and sizes' key='1'>
            <Form.Item label='X' name='x'>
              <Input disabled />
            </Form.Item>
            <Form.Item label='Y' name='y'>
              <Input disabled />
            </Form.Item>
            <Form.Item label='Width' name='width'>
              <Input disabled />
            </Form.Item>
            <Form.Item label='Height' name='height' style={{ margin: 0 }}>
              <Input disabled />
            </Form.Item>
          </Collapse.Panel>
        </Collapse>
      </Form>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button danger type='primary' icon={<DeleteOutlined />} onClick={onDelete}>
          Delete
      </Button>
      <Button style={{ marginLeft: 10 }} type='dashed' icon={<CopyOutlined />} onClick={onDuplicate}>
          Duplicate
      </Button>
      </div>
    </Modal>
  )
}

UpdateModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  selectedElement: PropTypes.shape({
    id: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    fill: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired
  }).isRequired,
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      x: PropTypes.number,
      y: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number,
      fill: PropTypes.string
    })
  ).isRequired,
  setElements: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  setSelectedItemId: PropTypes.func.isRequired
}

export default UpdateModal
