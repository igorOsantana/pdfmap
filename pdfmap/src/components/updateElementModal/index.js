import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Button, Collapse, Modal } from 'antd'
import { DeleteOutlined, CopyOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'

import { OptionType } from '../createElementModal'

import { removeScale } from '../../helpers'
import { useDocument } from '../../hooks'
import { LOCAL_STORAGE_KEY_TO_MAP } from '../../constants'
import { SELECT_TYPE_OPTIONS, TYPE_OPTIONS } from '../createElementModal/constants'

const { useForm } = Form
const { confirm } = Modal

function UpdateModal ({ visible, info, elements, setElements, onClose }) {
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
    const { id } = info
    const items = elements.filter(element => element.id !== id)
    const changes = removeScale(items, scale)

    localStorage.setItem(LOCAL_STORAGE_KEY_TO_MAP, JSON.stringify(changes))
    setElements(items)
    onClose()
  }

  useEffect(() => {
    if (info?.id) {
      form.setFieldsValue({
        field: info.field,
        type: setTypeFromColor(info.fill),
        x: info.x,
        y: info.y,
        width: info.width,
        height: info.height
      })
    }
  }, [info])

  const ModalButtons = () => (
    <>
      <Button onClick={onClose} icon={<CloseOutlined />}>Cancel</Button>
      <Button type='primary' icon={<CheckOutlined />}>Save</Button>
    </>
  )

  return (
    <Modal visible={visible} onCancel={onClose} footer={<ModalButtons />}>
      <Form form={form} style={{ padding: '30px 0 0 0' }}>
        <Form.Item label='Field' name='field'>
          <Input.TextArea />
        </Form.Item>
        <Form.Item label='Type' name='type'>
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
      <Button style={{ marginLeft: 10 }} type='dashed' icon={<CopyOutlined />}>
          Duplicate
      </Button>
      </div>
    </Modal>
  )
}

UpdateModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  info: PropTypes.shape({
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
  onClose: PropTypes.func.isRequired
}

export default UpdateModal
