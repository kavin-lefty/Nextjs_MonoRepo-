"use client";

import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LoginPayload = {
  strEmail: string;
  strPassword: string;
};

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = async (values: LoginPayload): Promise<void> => {
    setLoading(true);
    axios
      .post("/api/login", values)
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) {
          setLoading(false);
          messageApi.open({
            type: "success",
            duration: 5,
            onClose: () => router.push("/add-user"),
          });
        }
      })
      .catch((err) => {
        console.log(err, "error login");
        if (err.status === 401) {
          setLoading(false);
          messageApi.open({
            type: "error",
            duration: 5,
            content: err.response.data.message,
          });
        }
      });
  };

  return (
    <>
      {contextHolder}
      <section className="text-center">
        <div className="flex justify-center items-center h-screen">
          <Form layout="vertical" onFinish={onFinish}>
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
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </>
  );
}
