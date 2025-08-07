"use client";
import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

interface CreateUserPayload {
  strEmail: string;
  strName: string;
  strPassword: string;
}

export default function AddUser() {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const onFinish = async (values: CreateUserPayload) => {
    setLoading(true);
    axios
      .post("/api/user", values)
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) {
          setLoading(false);
          messageApi.open({
            type: "error",
            duration: 5,
            content: res.data.strMessage,
          });
          router.push("/dashboard");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err) {
          setLoading(false);
          messageApi.open({
            type: "error",
            duration: 5,
            content: err.response.data.strMessage,
          });
        }
      });
  };
  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2 className="text-center">Add New User</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="strName" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="strEmail"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="strPassword"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add User
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
