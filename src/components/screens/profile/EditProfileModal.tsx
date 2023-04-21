import type { User } from "@prisma/client";
import { message, Select, Space } from "antd";
import { Form, Input, Modal } from "antd";
import { trpc } from "src/utils/trpc";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { EyeOutlined } from "@ant-design/icons";

type EditProfileFormData = {
  displayName: string;
  bio: string;
  location: string;
  age: number;
  gender: string;
};

interface EditProfileModalProp {
  open: boolean;
  onCancel: () => void;
  refetch: () => void;
  profile: Partial<
    Pick<User, "displayName" | "age" | "bio" | "location" | "gender">
  >;
}

const EditProfileModal: React.FC<EditProfileModalProp> = ({
  open,
  onCancel,
  refetch,
  profile,
}) => {
  const [form] = Form.useForm<EditProfileFormData>();
  const editProfile = trpc.user.editProfile.useMutation();
  const bioMD = Form.useWatch("bio", form);

  const [showBioPreview, setShowBioPreview] = useState(false);

  const onFinish = async (values: EditProfileFormData) => {
    await editProfile.mutateAsync(
      {
        ...values,
        age: Number(values.age),
      },
      {
        onSuccess: () => {
          message.success("Profile updated successfully!");
          refetch();
          onCancel();
        },
        onError: () => {
          message.error("Failed to update profile");
        },
      }
    );
  };

  return (
    <Modal
      open={open}
      title="EDIT YOUR PROFILE"
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          onFinish(values);
        });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="edit-profile"
        initialValues={{
          displayName: profile.displayName,
          bio: profile.bio,
          location: profile.location,
          age: profile.age,
          gender: profile.gender,
        }}
      >
        <Form.Item
          name="displayName"
          label="Display name"
          tooltip="This is how your name will be displayed to other users."
        >
          <Input placeholder="Display name" />
        </Form.Item>
        <Form.Item
          name="bio"
          label={
            <Space>
              <span>Biography</span>
              <EyeOutlined onClick={() => setShowBioPreview(!showBioPreview)} />
            </Space>
          }
          tooltip="Markdown is supported. Click the eye icon to preview the Biography."
        >
          <Input.TextArea placeholder="Biography" showCount maxLength={500} />
        </Form.Item>
        {showBioPreview && (
          <Form.Item name="bioPreview" label="Biography preview">
            <div className="rounded-md border border-gray-300 p-2">
              <ReactMarkdown className="prose dark:prose-invert">{`${bioMD}`}</ReactMarkdown>
            </div>
          </Form.Item>
        )}
        <Form.Item
          name="location"
          label="Location"
          tooltip="Where are you from?"
        >
          <Input placeholder="Location" />
        </Form.Item>
        <Form.Item name="age" label="Age" tooltip="How old are you?">
          <Input placeholder="Age" type="number" min={10} max={99} />
        </Form.Item>
        <Form.Item label="Gender" name="gender" tooltip="What is your gender?">
          <Select
            options={[
              {
                label: "Male",
                value: "male",
              },
              {
                label: "Female",
                value: "female",
              },
              {
                label: "Other",
                value: "other",
              },
            ]}
            placeholder="Gender"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;
