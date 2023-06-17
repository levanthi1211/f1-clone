import BaseLayout from "@/components/Layout/Layout";
import { FC } from "react";
import classes from "./Home.module.scss";

export const Home: FC = () => {
  return (
    <BaseLayout>
      <div className={classes.title_container}>
        <div className={classes.title}>
          <h1>FORMULA 1</h1>
          <p className={classes.sub_title}>Formula 1 statistics</p>
          <p className={classes.text}>
            Practice, qualifying and race results, standings, driver and team
            statistics.
          </p>
        </div>
      </div>
    </BaseLayout>
  );
};
