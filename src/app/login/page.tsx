"use client";

import { Button, Form, Input, message } from "antd";
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
    const onFinish = async (values: LoginPayload) => {
        setLoading(true);
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });

        const data = await res.json();
        if (res.ok) {
            setLoading(false);
            messageApi.success("Logged in successfully!");
            router.push("/dashboard"); // ✅ protected page
        } else {
            setLoading(false);
            messageApi.error(data.message || "Something went wrong");
        }
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
