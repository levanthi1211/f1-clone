import BaseLayout from "@/components/Layout/Layout";
import { FC, useState, useEffect } from "react";
import classes from "./Teams.module.scss";
import { Table } from "antd";
import { getTeamsByYear } from "@/shared/services";
import { Driver, Team } from "@/shared/types";
import { Link } from "react-router-dom";
import { Title } from "@/components/Title/Title";
import { BarChart } from "./BarChart/BarChart";
import { delay } from "@/shared/utils";
import { Loading } from "@/components/Loading/Loading";

export const Teams: FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(2023);
  const [data, setData] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const featchData = async () => {
      setLoading(true);
      const response = await getTeamsByYear(currentYear);
      if (!response.data) alert(response.error);
      else {
        setData(response.data);
      }
      await delay(500);
      setLoading(false);
    };
    featchData();
  }, [currentYear]);

  if (loading) return <Loading />;

  return (
    <BaseLayout>
      <Title
        currentYear={currentYear}
        setCurrentYear={setCurrentYear}
        page="Teams"
        changer={true}
      />
      <div className={classes.container}>
        <h1 className={classes.section}>Teams result:</h1>
        <Table
          pagination={false}
          dataSource={data}
          columns={[
            {
              title: "Pos",
              dataIndex: "pos",
              key: "pos",
              sorter: (a, b) => a.pos - b.pos,
              sortDirections: ["descend", "ascend"],
              defaultSortOrder: "ascend",
            },
            {
              title: "Car",
              dataIndex: "car",
              key: "car",
              render: (car, row) => (
                <Link
                  className={classes.car}
                  to={`/teams/${row.car_name_code}/${currentYear}`}
                >
                  {car}
                </Link>
              ),
            },
            {
              title: "Drivers",
              dataIndex: "drivers",
              key: "drivers",
              render: (drivers) =>
                drivers.map((driver: Driver, index: number) => (
                  <span className={classes.driver}>
                    <span>{index !== 0 && "|"}</span>
                    <Link
                      to={`/drivers/${driver.driver_name_code}/${currentYear}`}
                    >
                      {driver.driver}
                    </Link>
                  </span>
                )),
            },
            {
              title: "Winner",
              dataIndex: "winner",
              key: "winner",
              sorter: (a, b) => a.winner - b.winner,
              sortDirections: ["descend", "ascend"],
            },
            {
              title: "PTS",
              dataIndex: "pts",
              key: "pts",
              sorter: (a, b) => a.pts - b.pts,
              sortDirections: ["descend", "ascend"],
            },
          ]}
        />
        <h1 className={classes.section}>Teams statistics:</h1>
        <BarChart data={data} />
      </div>
    </BaseLayout>
  );
};
