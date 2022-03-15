import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Select, message, Input } from 'antd'
import {
  SELECT_TYPE_OPTIONS,
  INITIAL_FORM_VALUES,
  TYPE_OPTIONS,
  handleSelectedType
} from './constants'

function CreateModal ({ visible, toggleVisible, addElement }) {
  const [form] = Form.useForm()

  const handleSubmit = async () => {
    const { field, type } = await form.validateFields()
    const options = handleSelectedType(type)
    const elementOptions = { field, type, ...options }

    if (!elementOptions.type) {
      message.error(`Invalid type: ${type}`)
      return
    }

    addElement(elementOptions)
    toggleVisible()
  }

  return (
    <Modal
      title='Create Element'
      visible={visible}
      onOk={handleSubmit}
      onCancel={toggleVisible}
      okText='Create'
    >
      <Form form={form} initialValues={INITIAL_FORM_VALUES}>
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
      </Form>
    </Modal>
  )
}

CreateModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  toggleVisible: PropTypes.func.isRequired,
  addElement: PropTypes.func.isRequired
}

export const OptionType = ({ label, value }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span>{label}</span>
      <div style={{
        width: 10,
        height: 10,
        borderRadius: 50,
        backgroundColor: getColorFromType(value),
        marginLeft: 'auto'
      }} />
    </div>
)

const getColorFromType = type => {
  const color = TYPE_OPTIONS[type].fill
  return color
}

OptionType.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}

export default CreateModal
