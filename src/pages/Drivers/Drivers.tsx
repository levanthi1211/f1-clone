import BaseLayout from "@/components/Layout/Layout";
import { FC, useState, useEffect } from "react";
import classes from "./Drivers.module.scss";
import { Table } from "antd";
import { getDriversByYear } from "@/shared/services";
import { DriverWithWinner } from "@/shared/types";
import { Link } from "react-router-dom";
import { Title } from "@/components/Title/Title";
import { BarChart } from "./BarChar/BarChart";
import { delay } from "@/shared/utils";
import { Loading } from "@/components/Loading/Loading";

export const Drivers: FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(2023);
  const [data, setData] = useState<DriverWithWinner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const featchData = async () => {
      setLoading(true);
      const response = await getDriversByYear(currentYear);
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
        page="Drivers"
        changer={true}
      />
      <div className={classes.container}>
        <h1 className={classes.section}>Driver table:</h1>
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
              title: "Driver",
              dataIndex: "driver",
              key: "driver",
              render: (driver, row) => {
                return (
                  <Link
                    className={classes.driver}
                    to={`/drivers/${row.driver_name_code}`}
                  >
                    {driver}
                  </Link>
                );
              },
            },
            {
              title: "No",
              dataIndex: "no",
              key: "no",
            },
            {
              title: "Car",
              dataIndex: "car",
              key: "car",
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
        <h1 className={classes.section}>Driver statistics:</h1>
        <BarChart data={data} />
      </div>
    </BaseLayout>
  );
};
