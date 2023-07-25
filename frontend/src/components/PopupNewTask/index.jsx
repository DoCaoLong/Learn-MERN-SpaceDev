import {
  CloseOutlined,
  PlusOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import { Avatar, Button, DatePicker, Form, Input, Modal, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { SelectTag } from "../SelectTag";
import { DropdownSelect } from "../SelectUser";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/configs/api";
import { queryClient } from "@/main";
import { LIST_TASK } from "@/configs/queryKey";

export const PopupNewTask = ({ setOpenCreate, open, item, setItem }) => {
  const [form] = Form.useForm();
  const { mutate: mutatePost, isLoading } = useMutation({
    onMutate: () => {
      message.loading({ key: item?.id, content: "Đang tạo task" });
    },
    mutationFn: (value) => {
      return axiosInstance.post("/task", value);
    },
    onSuccess: () => {
      message.success({ key: item?.id, content: "Tạo task thành công" });
      queryClient.invalidateQueries([LIST_TASK]);
      setOpenCreate(false);
      form.resetFields();
      setItem({});
    },
    onError: () => {
      message.error({ key: item?.id, content: "Tạo task thất bại" });
    },
  });

  const { mutate: mutateUpdate, isLoading: isLoadingUpdate } = useMutation({
    onMutate: () => {
      message.loading("Đang cập nhật task...");
    },
    mutationFn: (value) => {
      return axiosInstance.patch(`/task/${item?.id}`, value);
    },
    onSuccess: () => {
      message.success("Cập nhật task thành công");
      setOpenCreate(false);
      queryClient.invalidateQueries([LIST_TASK]);
      form.resetFields();
      setItem({});
    },
    onError: () => {
      message.error("Cập nhật task thất bại");
    },
  });
  const handleClosePopup = () => {
    setOpenCreate(false);
    setItem({});
  };
  return (
    <>
      {open && (
        <Modal
          maskClosable={handleClosePopup}
          open={open}
          width={520}
          onCancel={handleClosePopup}
          title={
            <div className="text-xl text-center border-0 border-b border-solid border-gray-200 pb-4">
              {item?.id ? "Update task" : "Create task"}
            </div>
          }
          footer={null}
        >
          <Form
            form={form}
            initialValues={{
              title: item?.title,
              description: item?.description,
            }}
            onFinish={item.id ? mutateUpdate : mutatePost}
            layout="vertical py-4"
          >
            <Form.Item
              name="title"
              rules={[{ required: true }]}
              label="Task title"
              className=""
              value={form.setFieldValue("title", item?.title)}
            >
              <Input />
            </Form.Item>
            <Form.Item
              // rules={[{ required: true }]}
              name="category"
              label="Category"
            >
              <SelectTag
                options={[
                  { label: "All", value: "all" },
                  { label: "Education", value: "education", color: "green" },
                  { label: "Sports", value: "sports", color: "orange" },
                  { label: "Meetings", value: "meetings", color: "yellow" },
                  { label: "Friends", value: "friends", color: "blue" },
                ]}
              />
            </Form.Item>
            <div className="flex w-full gap-2 mt-2">
              <Form.Item
                name="startDate"
                // rules={[{ required: true }]}
                label="Starts"
                className="flex-1"
              >
                <DatePicker showTime className="w-full" />
              </Form.Item>
              <Form.Item
                name="endDate"
                // rules={[{ required: true }]}
                label="Ends"
                className="flex-1"
              >
                <DatePicker showTime className="w-full" />
              </Form.Item>
            </div>
            <Form.Item
              name="user"
              // rules={[{ required: true }]}
              label="Participants"
            >
              <DropdownSelect
                options={[
                  {
                    value: 1,
                    avatar: "https://placehold.co/100x100",
                    name: "Emma",
                    label: (
                      <Button size="small" className="flex items-center w-full">
                        <Avatar
                          className="mr-2"
                          size={28}
                          src="https://placehold.co/100x100"
                        />{" "}
                        Emma <PlusOutlined />
                      </Button>
                    ),
                  },
                  {
                    value: 2,
                    avatar: "https://placehold.co/100x100",
                    name: "Liam",
                    label: (
                      <Button size="small" className="flex items-center w-full">
                        <Avatar
                          className="mr-2"
                          size={28}
                          src="https://placehold.co/100x100"
                        />{" "}
                        Liam <PlusOutlined />
                      </Button>
                    ),
                  },
                ]}
                renderSelected={({ option: user, remove }) => (
                  <Button onClick={remove} className="flex items-center p-2">
                    <Avatar className="mr-2" size={28} src={user.avatar} />{" "}
                    {user.name} <CloseOutlined />
                  </Button>
                )}
              />
            </Form.Item>
            <Form.Item label="Location">
              <Input prefix={<PushpinOutlined />} />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true }]}
              value={form.setFieldValue("description", item?.description)}
            >
              <TextArea />
            </Form.Item>
            <Button
              loading={item?.id ? isLoadingUpdate : isLoading}
              htmlType="submit"
              type="primary"
              className="w-full bg-accent"
            >
              {item?.id ? "Update task" : "Create task"}
            </Button>
          </Form>
        </Modal>
      )}
    </>
  );
};
