import React, { useState } from "react";
import PushpinOutlined from "@ant-design/icons/PushpinOutlined";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Skeleton, message } from "antd";
import { cn } from "@/utils";
import { PopupNewTask } from "@/components/PopupNewTask";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/configs/api";
import { IconDot } from "@/assets/img/iconDot";
import { queryClient } from "@/main";
import { LIST_TASK } from "@/configs/queryKey";
export const Home = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [item, setItem] = useState({});
  const { data, isLoading } = useQuery({
    queryKey: [LIST_TASK],
    queryFn: () => axiosInstance.get("/task"),
  });
  return (
    <div className="max-w-[600px] p-10 mx-auto ">
      <Button
        onClick={() => setOpenCreate(true)}
        className="w-full mb-4 bg-accent"
        type="primary"
      >
        Create new Task
      </Button>
      <div className="flex gap-2 flex-col">
        {isLoading &&
          Array.from(new Array(5)).map((_, i) => (
            <Skeleton.Input key={i} style={{ width: "100%", height: 150 }} />
          ))}
        {data?.map((item) => (
          <ToDoCard
            key={item.id}
            item={item}
            className="bg-blue-50"
            setItem={setItem}
            setOpenCreate={setOpenCreate}
          />
        ))}
      </div>
      <PopupNewTask
        item={item}
        open={openCreate}
        setItem={setItem}
        setOpenCreate={setOpenCreate}
      />
    </div>
  );
};

const ToDoCard = ({ item, className, setItem, setOpenCreate }) => {
  const { title, description, id } = item;
  const { mutate } = useMutation({
    onMutate: () => {
      message.loading({ key: id, content: "Đang xoá task..." });
    },
    mutationFn: () => {
      return axiosInstance.delete(`/task/${id}`);
    },
    onSuccess: () => {
      message.success({ key: id, content: "Xoá task thành công" });
      queryClient.invalidateQueries([LIST_TASK]);
    },
    onError: () => {
      message.error({ key: id, content: "Xoá task thất bại" });
    },
  });
  return (
    <div className={cn("p-4 rounded-lg relative", className)}>
      <h3 className="text-lg font-[600] flex items-center justify-between">
        <span>{title}</span>
        <Avatar className="mr-4" size={40} src="https://placehold.co/100x100" />
      </h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
      <div className="text-blue-400 cursor-pointer mt-2 pb-3 border-0 border-solid border-b border-gray-300">
        <PushpinOutlined /> Marlowe
      </div>
      <div className="mt-2 font-[400] flex justify-between items-center">
        <div className="text-sm text-gray-800">
          <ClockCircleOutlined /> 4:30 PM - 5:45 PM
        </div>
        <div>
          <Avatar.Group>
            <Avatar size={35} src="https://placehold.co/100x100" />
            <Avatar size={35} src="https://placehold.co/100x100" />
          </Avatar.Group>
        </div>
      </div>
      <Dropdown
        menu={{
          items: [
            {
              label: "Delete",
              onClick: mutate,
            },
            {
              label: "Update",
              onClick: () => {
                setItem(item), setOpenCreate(true);
              },
            },
          ],
        }}
      >
        <i className="absolute top-2 right-2 cursor-pointer">
          <IconDot with={14} />
        </i>
      </Dropdown>
    </div>
  );
};

export default Home;
