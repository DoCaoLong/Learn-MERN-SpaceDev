import {
  CloseOutlined,
  PlusOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  Modal,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { SelectTag } from "../SelectTag";
import { DropdownSelect } from "../SelectUser";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/configs/api";
import { queryClient } from "@/main";
import { LIST_TASK, LIST_CATEGORY, LIST_USER } from "@/configs/queryKey";
import { categoryService } from "@/services/category";
import { usersService } from "@/services/user";

export const PopupNewTask = ({ setOpenCreate, open, item, setItem }) => {
  const [form] = Form.useForm();

  // post task
  const { mutate: mutatePost, isLoading } = useMutation({
    onMutate: () => {
      message.loading({ key: item?.id, content: "Đang tạo task" });
    },
    mutationFn: (value) => {
      return axiosInstance.post("/task", value);
      // console.log(value);
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

  // update task
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

  // get categories
  const { data: categories } = useQuery({
    queryKey: [LIST_CATEGORY],
    queryFn: categoryService.getCategories,
  });

  // get users
  const { data: users } = useQuery({
    queryKey: [LIST_USER],
    queryFn: usersService.getUsers,
  });

  // close popup
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
              title: "",
              description: "",
              users: [],
              color: "#ffffff",
              category: "",
            }}
            onFinish={item.id ? mutateUpdate : mutatePost}
            layout="vertical py-4"
          >
            {/* form title */}
            <Form.Item
              name="title"
              rules={[{ required: true }]}
              label="Task title"
              className=""
              value={form.setFieldValue("title", item?.title)}
            >
              <Input />
            </Form.Item>
            {/* form title */}

            {/* form select color */}
            <Form.Item name="color" label="Color">
              <ColorPicker
                onChangeComplete={(value) =>
                  form.setFieldValue("color", value.toHexString())
                }
              />
            </Form.Item>
            {/* close form select color */}

            {/* form category */}
            <Form.Item
              rules={[{ required: true }]}
              name="category"
              label="Category"
            >
              <SelectTag
                options={
                  categories?.data?.map((item) => ({
                    label: item.name,
                    value: item.id,
                    color: item.color,
                  })) || []
                }
              />
            </Form.Item>
            {/* close form category */}

            {/* forms select date */}
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
            {/* close forms select date */}

            {/* form users */}
            <Form.Item
              name="users"
              // rules={[{ required: true }]}
              label="Participants"
            >
              <DropdownSelect
                options={
                  users?.data?.map((item) => ({
                    ...item,
                    value: item.id,
                    label: (
                      <Button size="small" className="flex items-center w-full">
                        <Avatar
                          className="mr-2"
                          size={28}
                          src={
                            item.avatar
                              ? item.avatar
                              : "https://placehold.co/100x100"
                          }
                        />{" "}
                        {item.name} <PlusOutlined />
                      </Button>
                    ),
                  })) || []
                }
                renderSelected={({ option: users, remove }) => (
                  <Button onClick={remove} className="flex items-center p-2">
                    <Avatar
                      className="mr-2"
                      size={28}
                      src={users?.avatar || "https://placehold.co/100x100"}
                    />{" "}
                    {users?.name} <CloseOutlined />
                  </Button>
                )}
              />
            </Form.Item>
            {/* close form users */}

            {/* form location */}
            <Form.Item label="Location">
              <Input prefix={<PushpinOutlined />} />
            </Form.Item>
            {/* close form location */}

            {/* form description */}
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true }]}
              value={form.setFieldValue("description", item?.description)}
            >
              <TextArea />
            </Form.Item>
            {/* close form description */}

            {/* btn submit  */}
            <Button
              loading={item?.id ? isLoadingUpdate : isLoading}
              htmlType="submit"
              type="primary"
              className="w-full bg-accent"
            >
              {item?.id ? "Update task" : "Create task"}
            </Button>
            {/* close btn submit */}
          </Form>
        </Modal>
      )}
    </>
  );
};
