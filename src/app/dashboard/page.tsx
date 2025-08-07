"use client";
import { FetchUsers } from "@/services/service";
import { useQuery } from "@tanstack/react-query";
import { Input, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function Dashboard() {
  const [strPage, SetStrPage] = useState<number>(1);
  const [strSearch, SetStrSearch] = useState<string>("");

  const { data } = useQuery({
    queryKey: ["users_list", { strPage, strSearch }],
    queryFn: async ({ queryKey }) => {
      const [, { strPage, strSearch }] = queryKey;
      let payload = {
        strPage,
        strSearch,
      };
      return await FetchUsers(payload);
    },
  });

  let arrUsers = data?.arrList;
  let totalPages = data?.pagination?.total;
  let pageSize = data?.pagination?.pageSize;

  const columns: ColumnsType<User> = [
    {
      title: "S.no",
      render: (value, record, index) => `${index + 1}`,
    },
    {
      title: "Name",
      dataIndex: "strName",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "strEmail",
      sorter: true,
    },
  ];

  return (
    <>
      <div>
        <Input
          value={strSearch}
          onChange={(e) => SetStrSearch(e.target.value.trimStart())}
          placeholder="search"
        />
      </div>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={arrUsers}
        onChange={(pagination, filters, sorter) => {
          SetStrPage(pagination?.current);
        }}
        pagination={{
          total: totalPages,
          pageSize: pageSize,
          showSizeChanger: false,
        }}
      />
    </>
  );
}
