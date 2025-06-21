"use client";

import { Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormInstance } from "antd/es/form";

type User = {
  id: string;
  strName: string;
  strEmail: string;
  strMobile: string;
};

type UpdatePayload = User & {
  strPassword: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [user, SetUser] = useState<User[]>([]);
  const [crudToggle, SetCrudToggle] = useState<"list" | "edit-mode">("list");
  const [loading, setLoading] = useState(false);
  const [editableUser, SetEditableUser] = useState<UpdatePayload | null>(null);
  const [form] = Form.useForm<UpdatePayload>();

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data: User[]) => {
        console.log(data, "<<< user");
        SetUser(data);
      });
  }, []);

  const onFinish = (values: Omit<UpdatePayload, "id">) => {
    if (!editableUser) return;

    const payload: UpdatePayload = {
      id: editableUser.id,
      ...values,
    };

    setLoading(true);
    fetch(`/api/user/${payload.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), // include id if API needs it
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update user");
        return res.json();
      })
      .then((data) => {
        console.log("User updated:", data);
        setLoading(false);
        SetCrudToggle("list");
        SetEditableUser(null);
      })
      .catch((err) => {
        console.error("Update error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (editableUser) {
      form.setFieldsValue({
        strName: editableUser.strName,
        strEmail: editableUser.strEmail,
        strMobile: editableUser.strMobile,
        strPassword: editableUser.strPassword,
      });
    }
  }, [editableUser, crudToggle, form]);

  return (
    <div className="flex justify-center items-center">
      <div className="space-y-2">
        {crudToggle === "list" && (
          <>
            <div>
              <Button type="primary" onClick={() => router.push("/add-user")}>
                Add Users
              </Button>
            </div>

            <table className="border border-black">
              <thead className="border border-black">
                <tr>
                  <th className="border p-2">S.No</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Mobile</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {user.map((u, i) => (
                  <tr key={u.id}>
                    <td className="border p-2">{i + 1}</td>
                    <td className="border p-2">{u.strName}</td>
                    <td className="border p-2">{u.strEmail}</td>
                    <td className="border p-2">{u.strMobile}</td>
                    <td className="border p-2">
                      <Button
                        onClick={() => {
                          SetCrudToggle("edit-mode");
                          SetEditableUser({
                            ...u,
                            strPassword: "",
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {crudToggle === "edit-mode" && (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={editableUser ?? {}}
          >
            <Form.Item
              name="strName"
              label="Name"
              rules={[{ required: true }]}
            >
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
              name="strMobile"
              label="Mobile"
              rules={[{ required: true }]}
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
                Update User
              </Button>
              <Button
                type="default"
                onClick={() => {
                  SetCrudToggle("list");
                  SetEditableUser(null);
                }}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
}
