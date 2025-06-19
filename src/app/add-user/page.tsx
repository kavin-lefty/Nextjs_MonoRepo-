"use client";
import { useState } from "react";
import { Form, Input, Button, message } from "antd";

export default function AddUser() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.ok) {
        message.success("User added successfully!");
      } else {
        message.error(data.message || "Something went wrong");
      }
    } catch (err) {
      message.error("Error adding user");
    } finally {
      setLoading(false);
    }
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
        <Form.Item name="strMobile" label="Mobile" rules={[{ required: true }]}>
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
