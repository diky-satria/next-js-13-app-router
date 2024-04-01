import React from "react";
import { useDispatch } from "react-redux";

import { add_value, less_value } from "@/redux/counter/action";
import { Button } from "antd";

import styles from "./cekRedux.module.scss";

export default function CekRedux() {
  const dispatch = useDispatch();

  const increment = () => {
    dispatch(add_value());
  };

  const decrement = () => {
    dispatch(less_value());
  };
  return (
    <div className={styles.container}>
      CekRedux{" "}
      <Button type="primary" onClick={() => increment()}>
        increment
      </Button>
      <Button onClick={() => decrement()}>decrement</Button>
    </div>
  );
}
