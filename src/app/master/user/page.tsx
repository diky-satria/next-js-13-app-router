"use client";

import Dashboard from "@/component/layout/dashboard";
import styles from "./user.module.scss";
import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Form,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import type { TableColumnsType, TableProps } from "antd";
import axios from "@/interceptor/axios";

import { Input } from "antd";
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

  // MODAL ADD
  const [isModalOpenAdd, setIsModalOpenAdd] = useState<boolean>(false);

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

  // MODAL ADD
  const showModalAdd = () => {
    setIsModalOpenAdd(true);
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
            <Button type="primary" onClick={showModalAdd}>
              Add
            </Button>
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
          <ModalAdd
            isModalOpenAdd={isModalOpenAdd}
            setIsModalOpenAdd={setIsModalOpenAdd}
            getAllUser={getAllUser}
          />
        </div>
      </Dashboard>
    </div>
  );
}

// MODAL ADD --------------------------------------------------------
interface Props {
  isModalOpenAdd: boolean;
  setIsModalOpenAdd: (value: boolean) => void;
  getAllUser(): void;
}

export function ModalAdd({
  isModalOpenAdd,
  setIsModalOpenAdd,
  getAllUser,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [divisionId, setDivisonId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [division, setDivision] = useState([]);

  type TypeError = {
    field: string;
    message: string;
  };
  const [errors, setErrors] = useState<TypeError>();

  useEffect(() => {
    getAllDivision();
  }, []);

  const getAllDivision = async () => {
    try {
      let response = await axios.get(`/api/division`);
      setDivision(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelModalAdd = () => {
    setIsModalOpenAdd(false);
  };
  const handleOkModalAdd = async () => {
    setErrors({ field: "", message: "" });
    try {
      let response = await axios.post(`/api/user`, {
        name: name,
        email: email,
        divisionId: divisionId,
        password: password,
        confirmPassword: passwordConfirmation,
      });
      if (response.status == 200) {
        getAllUser();

        ToastSuccess(response.data.message, "top-right");
        setIsModalOpenAdd(false);
      }
    } catch (error: any) {
      setErrors(error.response.data.error);
    }
  };

  return (
    <Modal
      title="Add User"
      open={isModalOpenAdd}
      // onOk={handleOkModalAdd}
      onCancel={handleCancelModalAdd}
      footer={[
        <Space key="1" direction="vertical">
          <Space wrap>
            <Button onClick={() => handleCancelModalAdd()}>Cancel</Button>
            <Button
              onClick={() => handleOkModalAdd()}
              type="primary"
              // loading={loadingButton}
              // style={{
              //   backgroundColor: "#12B0A2",
              //   color: "white",
              //   border: "#12B0A2",
              //   marginRight: "2px",
              // }}
            >
              Add
            </Button>
          </Space>
        </Space>,
      ]}
    >
      <Flex vertical gap={10}>
        <div>
          <Typography.Title level={5}>Name</Typography.Title>
          <Form.Item
            validateStatus={errors?.field === "name" ? "error" : ""}
            help={errors?.field === "name" ? errors.message : ""}
            style={{ marginBottom: errors?.field === "name" ? 0 : 0 }}
          >
            <Input onChange={(e) => setName(e.target.value)} />
          </Form.Item>
        </div>
        <div>
          <Typography.Title level={5}>Email</Typography.Title>
          <Form.Item
            validateStatus={errors?.field === "email" ? "error" : ""}
            help={errors?.field === "email" ? errors.message : ""}
            style={{ marginBottom: errors?.field === "email" ? 0 : 0 }}
          >
            <Input onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>
        </div>
        <div>
          <Typography.Title level={5}>Role</Typography.Title>
          <Form.Item
            validateStatus={errors?.field === "divisionId" ? "error" : ""}
            help={errors?.field === "divisionId" ? errors.message : ""}
            style={{ marginBottom: errors?.field === "divisionId" ? 0 : 0 }}
          >
            <Select
              showSearch
              placeholder="Select one"
              optionFilterProp="children"
              filterOption={(input, option: any) =>
                (option?.label ?? "").includes(input.toUpperCase())
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              // allowClear
              // value={dokterId === "" ? null : dokterId}
              onChange={(e) => setDivisonId(String(e))}
              options={division}
            />
          </Form.Item>
        </div>
        <div>
          <Typography.Title level={5}>Password</Typography.Title>
          <Form.Item
            validateStatus={errors?.field === "password" ? "error" : ""}
            help={errors?.field === "password" ? errors.message : ""}
            style={{ marginBottom: errors?.field === "password" ? 0 : 0 }}
          >
            <Input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
        </div>
        <div>
          <Typography.Title level={5}>Password Confirmation</Typography.Title>
          <Form.Item
            validateStatus={errors?.field === "confirmPassword" ? "error" : ""}
            help={errors?.field === "confirmPassword" ? errors.message : ""}
            style={{
              marginBottom: errors?.field === "confirmPassword" ? 0 : 0,
            }}
          >
            <Input
              type="password"
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </Form.Item>
        </div>
      </Flex>
    </Modal>
  );
}
