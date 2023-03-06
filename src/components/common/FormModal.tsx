import { Form, Modal, ModalProps } from "antd";

interface CollectionCreateFormProps extends ModalProps {
  // open: boolean;
  onSubmit: (values: any) => void;
  // onCancel: () => void;
  initialValues?: any;
  // confirmLoading?: boolean;
  children: React.ReactNode;
}

const FormModal: React.FC<CollectionCreateFormProps> = ({
  // open,
  // onCancel,
  // confirmLoading,
  onSubmit,
  initialValues,
  children,
  ...rest
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      {...rest}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onSubmit(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={initialValues}
      >
        {children}
      </Form>
    </Modal>
  );
};

export default FormModal;
