"use client";

import Dashboard from "@/component/layout/dashboard";
import styles from "./user.module.scss";
import React, { useEffect, useState } from "react";
import { Pagination, Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import axios from "@/interceptor/axios";
import Column from "antd/es/table/Column";

interface DataType {
  key: React.Key;
  name: string;
  email: string;
}

export default function User() {
  const [data, setData] = useState<DataType[]>();
  const columns: TableColumnsType<DataType> = [
    {
      title: "No",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: {
        compare: (a, b) => a.email.localeCompare(b.email),
        multiple: 3,
      },
    },
  ];

  // const data: DataType[] = [
  //   {
  //     key: "1",
  //     name: "John Brown",
  //     email: 98,
  //   },
  //   {
  //     key: "2",
  //     name: "Jim Green",
  //     email: 98,
  //   },
  // ];

  const pageSize = 2; // Number of rows per page
  let currentPage = 1; // Initialize with the current page number

  useEffect(() => {
    getAllUser();
  }, []);

  const getAllUser = async () => {
    try {
      let response = await axios.get("/api/user");
      console.log("response ", response);
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const [page, setPage] = useState(1);

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div>
      <Dashboard>
        <div className={styles.scss_container}>
          <Table
            columns={columns}
            dataSource={data}
            onChange={onChange}
            pagination={{
              showTotal: (total, range) => (
                <>
                  {range[0]}-{range[1]} of {total} items
                </>
              ),
              onChange: (page) => {
                currentPage = page; // Update the current page number
              },
              defaultPageSize: 2,
              showSizeChanger: true,
            }}
            rowKey={(record, index): any => index}
          />
        </div>
      </Dashboard>
    </div>
  );
}
