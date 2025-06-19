"use client"

import { Button, Form, Input, message } from "antd";
import { useState } from "react";

type LoginPayload = {
  strEmail: string,
  strPassword: string
}

export default function Home() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginPayload) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      console.log("Logged in user:", data.user);
      message.success('logged in successfully!');
    }
    else {
      message.error(data.message || 'Something went wrong');
    }

  }

  return (
    <>
      <section className="text-center">
        This is a fully Integrated FULL STACK APPLICATION built in Next.js

        <div>
          <Form layout="vertical" onFinish={onFinish}>

            <Form.Item name="strEmail" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>

            <Form.Item name="strPassword" label="Password" rules={[{ required: true, }]}>
              <Input />
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
