import {
  Avatar,
  Button,
  Form,
  Input,
  List,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import React from "react";
import { trpc } from "src/utils/trpc";
import dayjs from "dayjs";
import { firstLetterToUpperCase } from "src/utils/helper";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

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

  // const SubmissionComment = trpc.comment.getSubmissionComments.useQuery(
  //   { submissionId: submissionId as string },
  //   {
  //     enabled: !!submissionId,
  //   }
  // );
  // console.log("SubmissionComment", SubmissionComment.data);

  const createAssignmentComment =
    trpc.comment.createAssignmentComment.useMutation();

  // const createSubmissionComment =
  //   trpc.comment.createSubmissionComment.useMutation();

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
        }
      );
    }
    // if (submissionId) {
    //   createSubmissionComment.mutate(
    //     {
    //       submissionId: assignmentId as string,
    //       content: values.content,
    //     },
    //     {
    //       onSuccess: () => {
    //         form.resetFields();
    //       },
    //     }
    //   );
    // }
  };

  return (
    <div className="flex flex-col gap-2 scroll-auto">
      <List
        // pagination={{ position, align }}
        bordered
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
            // actions={[
            //   <Button
            //     key={item.id}
            //     size="small"
            //     type="text"
            //     danger
            //     onClick={() => {
            //       deleteComment.mutate(
            //         { commentId: item.id },
            //         {
            //           onSuccess: () => {
            //             assignmentCommentQuery.refetch();
            //             message.success("Comment deleted");
            //           },
            //           onError: (error) => {
            //             message.error(error.message);
            //           },
            //         }
            //       );
            //     }}
            //   >
            //     Delete
            //   </Button>,
            // ]}
          >
            {/* <List.Item.Meta
              avatar={
                <Avatar
                  style={{ width: 40, height: 40 }}
                  src={item.user.image}
                />
              }
              title={
                <Space>
                  <Typography.Link href="#" strong>
                    {item.user.name}
                  </Typography.Link>
                  <Tag color={item.user.role === "teacher" ? "purple" : "lime"}>
                    {firstLetterToUpperCase(item.user.role as string)}
                  </Tag>
                </Space>
              }
              description={
                <Typography.Text style={{ fontSize: 12 }}>
                  {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}
                </Typography.Text>
              }
            /> */}
            <div className="flex w-full">
              <Avatar style={{ width: 40, height: 35 }} src={item.user.image} />
              <div className="ml-2 flex w-full flex-col">
                <div className="flex w-full justify-between">
                  <Typography.Link href="#" strong>
                    {item.user.name}
                  </Typography.Link>
                  <Tag color={item.user.role === "teacher" ? "purple" : "lime"}>
                    {firstLetterToUpperCase(item.user.role as string)}
                  </Tag>
                </div>
                <Typography.Text style={{ fontSize: 12 }}>
                  {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}
                </Typography.Text>
              </div>
            </div>
            <ReactMarkdown>{`${item.content}`}</ReactMarkdown>
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
          tooltip="You can add some style by using markdown"
          rules={[
            {
              required: true,
              message: "Comment cant be empty",
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            maxLength={200}
            placeholder="Content of the comment"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CommentDrawer;
