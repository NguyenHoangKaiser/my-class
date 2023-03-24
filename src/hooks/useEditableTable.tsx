import { FormInstance, InputRef, message } from "antd";
import { Form, Input } from "antd";
import type { Rule } from "antd/es/form";
import React, { useContext, useEffect, useRef, useState } from "react";

interface EditableRowProps {
  index: number;
}

export const useEditableTable = <T extends object>() => {
  interface EditableCellProps {
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof T;
    record: T;
    handleSave: (record: T) => void;
    rules?: Rule[];
  }

  const EditableContext = React.createContext<FormInstance<any> | null>(null);

  const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell: React.FC<EditableCellProps> = ({
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    rules,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext);

    useEffect(() => {
      if (editing) {
        inputRef.current?.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form?.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
      try {
        const values = await form?.validateFields();

        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log("Save failed:", errInfo);
        message.error("Save failed");
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          tooltip="This cell is editable"
          name={dataIndex as string}
          rules={rules}
        >
          <Input
            ref={inputRef}
            onPressEnter={save}
            onBlur={() => setEditing(false)}
          />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24 }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  return { components };
};
