import { FC } from "react";
import classes from "./Loading.module.scss";
import { Spin } from "antd";

export const Loading: FC = () => {
  return (
    <div className={classes.loading}>
      <Spin />
    </div>
  );
};
