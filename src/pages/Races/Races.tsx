import BaseLayout from "@/components/Layout/Layout";
import { FC, useState, useEffect } from "react";
import classes from "./Races.module.scss";
import { Table } from "antd";
import { Result } from "@/shared/types";
import { getRacesByYear } from "@/shared/services";
import { Link } from "react-router-dom";
import { Title } from "@/components/Title/Title";
import { delay } from "@/shared/utils";
import { Loading } from "@/components/Loading/Loading";

export const Races: FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(2023);
  const [data, setData] = useState<(Result & { winner?: string })[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const featchData = async () => {
      setLoading(true);
      const response = await getRacesByYear(currentYear);
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
        page="Races"
        changer={true}
      />
      <div className={classes.container}>
        <h1 className={classes.section}>Races result:</h1>
        <Table
          pagination={false}
          dataSource={data}
          columns={[
            {
              title: "Date",
              dataIndex: "date",
              key: "date",
              render: (date) => {
                return <span className={classes.date}>{date}</span>;
              },
            },
            {
              title: "Grand Prix",
              dataIndex: "grand_prix",
              key: "grand_prix",
              render: (grand_prix, row) => {
                return (
                  <Link
                    className={classes.grand_prix}
                    to={`/races/${row.race_name_code}/${currentYear}`}
                  >
                    {grand_prix}
                  </Link>
                );
              },
            },
            {
              title: "Circuit",
              dataIndex: "circuit",
              key: "circuit",
            },
            {
              title: "Winner",
              dataIndex: "winner",
              key: "winner",
              render: (winner, row) => {
                if (row.race_results?.[0]?.driver_name_code)
                  return (
                    <Link
                      className={classes.grand_prix}
                      to={`/drivers/${row.race_results[0].driver_name_code}/${currentYear}`}
                    >
                      {winner}
                    </Link>
                  );
              },
            },
          ]}
        />
      </div>
    </BaseLayout>
  );
};
