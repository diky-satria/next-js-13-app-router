"use client";

import CekRedux from "@/component/cekRedux";
import Dashboard from "@/component/layout/dashboard";
import React from "react";
import { useSelector } from "react-redux";

export default function Redux() {
  const { value } = useSelector((state: any) => state.counter);

  return (
    <div>
      <Dashboard>
        redux {value}
        <CekRedux />
      </Dashboard>
    </div>
  );
}
