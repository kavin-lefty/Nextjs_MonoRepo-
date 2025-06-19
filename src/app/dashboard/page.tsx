"use client";

import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  strName: string;
  strMobile: string;
  strEmail: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [user, SetUser] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "<<< user");
        SetUser(data);
      });
  }, []);

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="space-y-2">
          <div>
            <Button type="primary" onClick={() => router.push("/add-user")}>Add Users</Button>
          </div>
          <table className="border border-black">
            <thead className="border border-black">
              <tr className="border border-black">
                <th className="border border-black p-2">S.No</th>
                <th className="border border-black p-2">Name</th>
                <th className="border border-black p-2">Email</th>
                <th className="border border-black p-2">Mobile</th>
              </tr>
            </thead>
            <tbody className="border border-black">
              {user?.map((u, i) => (
                <tr key={i} className="border border-black">
                  <td key={i} className="border border-black p-2">
                    {i + 1}
                  </td>
                  <td key={i} className="border border-black p-2">
                    {u.strName}
                  </td>
                  <td key={i} className="border border-black p-2">
                    {u.strEmail}
                  </td>
                  <td key={i} className="border border-black p-2">
                    {u.strMobile}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
