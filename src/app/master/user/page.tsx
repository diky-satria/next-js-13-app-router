"use client";

import Dashboard from "@/component/layout/dashboard";
import styles from "./user.module.scss";
import React, { useEffect, useState } from "react";
import { Button, Flex, Popconfirm, Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import axios from "@/interceptor/axios";

import { AudioOutlined } from "@ant-design/icons";
import { Input, Space } from "antd";
import type { SearchProps } from "antd/es/input/Search";
import ToastSuccess from "@/component/toast/toastSuccess";
import ToastError from "@/component/toast/toastError";
const { Search } = Input;

interface DataType {
  key: React.Key;
  name: string;
  email: string;
  division_name: string;
}

export default function User() {
  const [data, setData] = useState<DataType[]>();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [limit, setLimit] = useState(10);

  const columns: TableColumnsType<DataType> = [
    {
      title: "No",
      render: (text, record, index) =>
        page > 0 ? page * limit + index + 1 : index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: {
        compare: (a, b) => a.email.localeCompare(b.email),
      },
    },
    {
      title: "Role",
      dataIndex: "division_name",
      sorter: {
        compare: (a, b) => a.division_name.localeCompare(b.division_name),
      },
    },
    {
      title: "Action",
      render: (data) => (
        <Flex wrap="wrap" gap="small">
          <Button type="default">Edit</Button>
          <Popconfirm
            title="Delete the task"
            description={`Are you sure to delete ${data.name}`}
            onConfirm={() => confirm(data.id)}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  useEffect(() => {
    getAllUser();
  }, [page, limit, search]);

  // TABLE
  const getAllUser = async () => {
    try {
      let response = await axios.get(
        `/api/user?search=${search}&page=${page}&limit=${limit}`
      );
      setData(response.data.data);
      setPage(response.data.page);
      setTotalRows(response.data.total_rows);
    } catch (error) {
      console.log(error);
    }
  };
  const onChange: TableProps<DataType>["onChange"] = (
    pagination: any,
    filters,
    sorter,
    extra
  ) => {
    // console.log("params", pagination, filters, sorter, extra);
  };

  // SEARCH
  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    setSearch(value);
    setPage(0);
  };

  // DELETE
  const confirm = async (id: string) => {
    try {
      let response = await axios.delete(`/api/user/${id}`);
      if (response.status === 200) {
        page === 0 ? getAllUser() : setPage(0);
        ToastSuccess(response.data.message, "top-right");
      }
    } catch (error: any) {
      ToastError(error.message, "top-right");
      console.log(error);
    }
  };

  return (
    <div>
      <Dashboard>
        <div className={styles.scss_container}>
          <div className={styles.scss_header}>
            <Search
              placeholder="input search text"
              onSearch={onSearch}
              enterButton
              className={styles.scss_search}
            />
            <Button type="primary">Add</Button>
          </div>
          <div className={styles.scss_table}>
            <Table
              size="small"
              columns={columns}
              dataSource={data}
              onChange={onChange}
              pagination={{
                showTotal: (total, range) => {
                  return (
                    <>
                      Show {range[0]}-{range[1]} of {total} items
                    </>
                  );
                },
                onChange: (page, pageSize) => {
                  if (pageSize !== limit) {
                    setPage(0);
                  } else {
                    setPage(page - 1);
                  }
                  setLimit(pageSize);
                },
                showSizeChanger: true,
                total: totalRows,
                current: page + 1,
              }}
              rowKey={(record, index): any => index}
            />
          </div>
        </div>
      </Dashboard>
    </div>
  );
}
