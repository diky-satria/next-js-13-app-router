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

// TABLE
interface DataType {
  key: React.Key;
  name: string;
  email: string;
  division_name: string;
  divisionId: number | string;
  divisionName: string;
  id: string | number;
}
// DIVISION
type TypeDivision = {
  value: number;
  label: string;
};

export default function User() {
  // TABLE
  const [data, setData] = useState<DataType[]>();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [limit, setLimit] = useState(10);

  // DIVISION
  const [division, setDivision] = useState<TypeDivision[]>([]);
  // MODAL ADD
  const [isModalOpenAdd, setIsModalOpenAdd] = useState<boolean>(false);
  // MODAL EDIT
  const [isModalOpenEdit, setIsModalOpenEdit] = useState<boolean>(false);
  const [dataEdit, setDataEdit] = useState<DataType>();

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
          <Button type="default" onClick={() => showModalEdit(data)}>
            Edit
          </Button>
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
    getAllDivision();
  }, []);

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

  // DIVISION
  const getAllDivision = async () => {
    try {
      let response = await axios.get(`/api/division`);
      setDivision(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // MODAL ADD
  const showModalAdd = () => {
    getAllDivision();
    setIsModalOpenAdd(true);
  };
  // MODAL EDIT
  const showModalEdit = (data: DataType) => {
    getAllDivision();
    setDataEdit(data);
    setIsModalOpenEdit(true);
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
            page={page}
            setPage={setPage}
            division={division}
            setDivision={setDivision}
          />
          <ModalEdit
            key={Math.floor(Math.random() * 10)}
            isModalOpenEdit={isModalOpenEdit}
            setIsModalOpenEdit={setIsModalOpenEdit}
            getAllUser={getAllUser}
            division={division}
            setDivision={setDivision}
            dataEdit={dataEdit}
          />
        </div>
      </Dashboard>
    </div>
  );
}

// MODAL ADD -------------------------------------------------------------------------------------
interface PropsAdd {
  isModalOpenAdd: boolean;
  setIsModalOpenAdd: (value: boolean) => void;
  getAllUser(): void;
  page: number;
  setPage: (value: number) => void;
  division: TypeDivision[];
  setDivision: (value: TypeDivision[]) => void;
}

export function ModalAdd({
  isModalOpenAdd,
  setIsModalOpenAdd,
  getAllUser,
  page,
  setPage,
  division,
  setDivision,
}: PropsAdd) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [divisionName, setDivisionName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  type TypeError = {
    field: string;
    message: string;
  };
  const [errors, setErrors] = useState<TypeError>();

  const handleCancelModalAdd = () => {
    setName("");
    setEmail("");
    setDivisionId("");
    setDivisionName("");
    setPassword("");
    setPasswordConfirmation("");
    setDivision([]);
    setErrors({ field: "", message: "" });

    setIsModalOpenAdd(false);
  };

  const divisionSelected = (divOpt: TypeDivision[], divSel: string) => {
    var divSelData = [{ value: divSel }];

    // compare divSelData value the same divOpt value, while the same both of value so add to data=[{value: 1, label: 'FRONTEND DEVELOPER'}]
    var data = [];
    for (var a = 0; a < divSelData.length; a++) {
      for (var j = 0; j < divOpt.length; j++) {
        if (Number(divSelData[a].value) === Number(divOpt[j].value)) {
          data.push({
            value: divOpt[j].value,
            label: divOpt[j].label,
          });
        }
      }
    }

    return data;
  };

  const getStateDivision = (e: any) => {
    // getting data id and name of division for state
    var division_selected = divisionSelected(division, e);
    var id = division_selected[0].value;
    var nama = division_selected[0].label;

    setDivisionId(id.toString());
    setDivisionName(nama);
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
        page === 0 ? getAllUser() : setPage(0);

        ToastSuccess(response.data.message, "top-right");
        handleCancelModalAdd();
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
            <Input onChange={(e) => setName(e.target.value)} value={name} />
          </Form.Item>
        </div>
        <div>
          <Typography.Title level={5}>Email</Typography.Title>
          <Form.Item
            validateStatus={errors?.field === "email" ? "error" : ""}
            help={errors?.field === "email" ? errors.message : ""}
            style={{ marginBottom: errors?.field === "email" ? 0 : 0 }}
          >
            <Input onChange={(e) => setEmail(e.target.value)} value={email} />
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
              value={divisionName === "" ? null : divisionName}
              onChange={(e) => getStateDivision(e)}
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
              value={password}
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
              value={passwordConfirmation}
            />
          </Form.Item>
        </div>
      </Flex>
    </Modal>
  );
}

// MODAL EDIT -------------------------------------------------------------------------------------
interface PropsEdit {
  isModalOpenEdit: boolean;
  setIsModalOpenEdit: (value: boolean) => void;
  getAllUser(): void;
  division: TypeDivision[];
  setDivision: (value: TypeDivision[]) => void;
  dataEdit: DataType | undefined;
}

export function ModalEdit({
  isModalOpenEdit,
  setIsModalOpenEdit,
  getAllUser,
  division,
  setDivision,
  dataEdit,
}: PropsEdit) {
  const [name, setName] = useState<string>(dataEdit?.name || "");
  const [emailOld, setEmailOld] = useState<string>(dataEdit?.email || "");
  const [email, setEmail] = useState<string>(dataEdit?.email || "");
  const [divisionId, setDivisionId] = useState<string | number>(
    dataEdit?.divisionId.toString() || ""
  );
  const [divisionName, setDivisionName] = useState<string>(
    dataEdit?.division_name || ""
  );

  type TypeError = {
    field: string;
    message: string;
  };
  const [errors, setErrors] = useState<TypeError>();

  const handleCancelModalEdit = () => {
    setName("");
    setEmailOld("");
    setEmail("");
    setDivisionId("");
    setDivisionName("");
    setDivision([]);
    setErrors({ field: "", message: "" });

    setIsModalOpenEdit(false);
  };

  const divisionSelected = (divOpt: TypeDivision[], divSel: string) => {
    var divSelData = [{ value: divSel }];

    // compare divSelData value the same divOpt value, while the same both of value so add to data=[{value: 1, label: 'FRONTEND DEVELOPER'}]
    var data = [];
    for (var a = 0; a < divSelData.length; a++) {
      for (var j = 0; j < divOpt.length; j++) {
        if (Number(divSelData[a].value) === Number(divOpt[j].value)) {
          data.push({
            value: divOpt[j].value,
            label: divOpt[j].label,
          });
        }
      }
    }

    return data;
  };

  const getStateDivision = (e: any) => {
    // getting data id and name of division for state
    var division_selected = divisionSelected(division, e);
    var id = division_selected[0].value;
    var nama = division_selected[0].label;

    setDivisionId(id.toString());
    setDivisionName(nama);
  };

  const handleOkModalEdit = async () => {
    setErrors({ field: "", message: "" });
    try {
      let response = await axios.patch(`/api/user/${dataEdit?.id}`, {
        name: name,
        email_old: emailOld,
        email: email,
        divisionId: divisionId,
      });
      if (response.status == 200) {
        getAllUser();

        ToastSuccess(response.data.message, "top-right");
        handleCancelModalEdit();
      }
    } catch (error: any) {
      setErrors(error.response.data.error);
    }
  };

  return (
    <Modal
      title="Edit User"
      open={isModalOpenEdit}
      onCancel={handleCancelModalEdit}
      footer={[
        <Space key="1" direction="vertical">
          <Space wrap>
            <Button onClick={() => handleCancelModalEdit()}>Cancel</Button>
            <Button
              onClick={() => handleOkModalEdit()}
              type="primary"
              // loading={loadingButton}
              // style={{
              //   backgroundColor: "#12B0A2",
              //   color: "white",
              //   border: "#12B0A2",
              //   marginRight: "2px",
              // }}
            >
              Edit
            </Button>
          </Space>
        </Space>,
      ]}
    >
      <Flex vertical gap={10}>
        <input type="hidden" value={emailOld} />
        <div>
          <Typography.Title level={5}>Name</Typography.Title>
          <Form.Item
            validateStatus={errors?.field === "name" ? "error" : ""}
            help={errors?.field === "name" ? errors.message : ""}
            style={{ marginBottom: errors?.field === "name" ? 0 : 0 }}
          >
            <Input onChange={(e) => setName(e.target.value)} value={name} />
          </Form.Item>
        </div>
        <div>
          <Typography.Title level={5}>Email</Typography.Title>
          <Form.Item
            validateStatus={errors?.field === "email" ? "error" : ""}
            help={errors?.field === "email" ? errors.message : ""}
            style={{ marginBottom: errors?.field === "email" ? 0 : 0 }}
          >
            <Input onChange={(e) => setEmail(e.target.value)} value={email} />
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
              value={divisionName === "" ? null : divisionName}
              onChange={(e) => getStateDivision(e)}
              options={division}
            />
          </Form.Item>
        </div>
      </Flex>
    </Modal>
  );
}
