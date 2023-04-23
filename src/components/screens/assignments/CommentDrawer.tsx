import { Button, Form, Input, List, Tag, Typography, message } from "antd";
import React from "react";
import { trpc } from "src/utils/trpc";
import dayjs from "dayjs";
import { firstLetterToUpperCase } from "src/utils/helper";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { DeleteOutlined, SendOutlined } from "@ant-design/icons";
import Image from "next/image";
import profileImage from "src/assets/profile.jpeg";

type Props = {
  assignmentId?: string;
  submissionId?: string;
};

function CommentDrawer({ assignmentId, submissionId }: Props) {
  const [form] = Form.useForm<{
    content: string;
  }>();

  if (!assignmentId && !submissionId) {
    return null;
  }

  if (assignmentId && submissionId) {
    return null;
  }

  const assignmentCommentQuery = trpc.comment.getAssignmentComments.useQuery(
    { assignmentId: assignmentId as string },
    {
      enabled: !!assignmentId,
    }
  );

  const deleteComment = trpc.comment.deleteComment.useMutation();

  const createAssignmentComment =
    trpc.comment.createAssignmentComment.useMutation();

  const handleDeleteComment = (commentId: string) => {
    deleteComment.mutate(
      { commentId: commentId },
      {
        onSuccess: () => {
          assignmentCommentQuery.refetch();
          message.success("Comment deleted");
        },
        onError: (error) => {
          message.error(error.message);
        },
      }
    );
  };

  const onFinish = (values: { content: string }) => {
    if (assignmentId) {
      createAssignmentComment.mutate(
        {
          assignmentId: assignmentId as string,
          content: values.content,
        },
        {
          onSuccess: () => {
            form.resetFields();
            assignmentCommentQuery.refetch();
            message.success("Comment created");
          },
          onError(error) {
            message.error(error.message);
          },
        }
      );
    }
  };

  return (
    <div className="flex flex-col gap-2 scroll-auto">
      <List
        bordered
        loading={assignmentCommentQuery.isLoading}
        header={
          <Typography.Title level={5}>
            {assignmentCommentQuery.data?.length} Comments
          </Typography.Title>
        }
        dataSource={assignmentCommentQuery.data}
        renderItem={(item) => (
          <List.Item
            style={{
              padding: "1rem 1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div className="mb-2 flex w-full">
              <Image
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
                src={item.user.image ?? profileImage}
              />
              <div className="ml-2 flex w-full flex-col">
                <div className="flex w-full justify-between">
                  <Typography.Text strong>
                    {item.user.displayName || item.user.name}
                  </Typography.Text>
                  <Tag
                    color={
                      item.user.role === "teacher"
                        ? "purple-inverse"
                        : "lime-inverse"
                    }
                  >
                    {firstLetterToUpperCase(item.user.role as string)}
                  </Tag>
                </div>
                <div className="flex gap-2">
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}
                  </Typography.Text>
                  <DeleteOutlined
                    className="text-red-500 hover:text-red-400"
                    onClick={() => handleDeleteComment(item.id)}
                  />
                </div>
              </div>
            </div>
            <ReactMarkdown className="prose dark:prose-invert">{`${item.content}`}</ReactMarkdown>
          </List.Item>
        )}
      />
      <Form
        layout="vertical"
        form={form}
        name="create-comment"
        onFinish={onFinish}
      >
        <Form.Item
          name="content"
          label="Comment"
          tooltip="Markdown is supported."
          rules={[
            {
              required: true,
              message: "Comment cant be empty",
            },
          ]}
        >
          <Input.TextArea rows={4} maxLength={200} placeholder="Content" />
        </Form.Item>
        <Form.Item>
          <Button
            style={{ display: "flex", alignItems: "center" }}
            type="primary"
            icon={<SendOutlined />}
            htmlType="submit"
          >
            Send
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CommentDrawer;
