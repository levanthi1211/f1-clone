import BaseLayout from "@/components/Layout/Layout";
import { getDriver } from "@/shared/services";
import { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DriverResult } from "@/shared/types";
import { Title } from "@/components/Title/Title";
import classes from "./Driver.module.scss";
import { Table, Result, Button } from "antd";
import { delay, ordinal_suffix_of } from "@/shared/utils";
import { Loading } from "@/components/Loading/Loading";
import { ColumnLineChart } from "./ColumnLineChart/ColumnLineChart";

type DriverParams = {
  driver: string;
};

export const Driver: FC = () => {
  const [data, setData] = useState<
    (DriverResult & { year: number })[] | undefined
  >();
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams<DriverParams>();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { driver } = params;
      if (driver) {
        const response = await getDriver(driver);
        if (!response.data) alert(response.error);
        else {
          setData(response.data);
        }
      }
      await delay(500);
      setLoading(false);
    };
    fetchData();
  }, [params]);

  if (loading) return <Loading />;
  return (
    <BaseLayout>
      {data ? (
        <>
          <Title page={data[0].driver || ""} changer={false} />
          <div className={classes.container}>
            <h1 className={classes.section}>Driver result:</h1>
            <Table
              pagination={false}
              dataSource={data}
              columns={[
                {
                  title: "Year",
                  dataIndex: "year",
                  key: "year",
                  render: (driver, row) => {
                    return (
                      <Link
                        className={classes.year}
                        to={`/drivers/${row.driver_name_code}/${row.year}`}
                      >
                        {driver}
                      </Link>
                    );
                  },
                  sorter: (a, b) => b.year - a.year,
                  sortDirections: ["descend", "ascend"],
                  sortOrder: "ascend",
                },
                {
                  title: "Pos",
                  dataIndex: "pos",
                  key: "pos",
                  render: (pos) => <span>{ordinal_suffix_of(pos)}</span>,
                },
                {
                  title: "Car",
                  dataIndex: "car",
                  key: "car",
                  render: (car, row) => {
                    return (
                      <Link
                        className={classes.car}
                        to={`/teams/${row.car_name_code}`}
                      >
                        {car}
                      </Link>
                    );
                  },
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
            <h1 className={classes.section}>Point and Position statistics:</h1>
            <ColumnLineChart data={data} />
          </div>
        </>
      ) : (
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Link to={`/drivers`}>
              <Button type="primary">Back To Drivers</Button>
            </Link>
          }
        />
      )}
    </BaseLayout>
  );
};
