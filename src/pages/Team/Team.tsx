import BaseLayout from "@/components/Layout/Layout";
import { getTeam } from "@/shared/services";
import { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TeamResult, Driver } from "@/shared/types";
import { delay, ordinal_suffix_of } from "@/shared/utils";
import { Loading } from "@/components/Loading/Loading";
import { Result, Table, Button } from "antd";
import { Title } from "@/components/Title/Title";
import classes from "./Team.module.scss";
import { ColumnLineChart } from "./ColumnLineChart/ColumnLineChart";

type TeamParams = {
  team: string;
};

export const Team: FC = () => {
  const [data, setData] = useState<
    (TeamResult & { year: number })[] | undefined
  >();
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams<TeamParams>();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { team } = params;
      if (team) {
        const response = await getTeam(team);

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
          <Title page={data[0].car || ""} changer={false} />
          <div className={classes.container}>
            <h1 className={classes.section}>Team result:</h1>
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
                        to={`/teams/${row.car_name_code}/${row.year}`}
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
                  title: "Winner",
                  dataIndex: "winner",
                  key: "winner",
                },
                {
                  title: "Drivers",
                  dataIndex: "drivers",
                  key: "drivers",
                  render: (drivers) =>
                    drivers.map((driver: Driver, index: number) => (
                      <span className={classes.driver}>
                        <span>{index !== 0 && "|"}</span>
                        <Link to={`/drivers/${driver.driver_name_code}`}>
                          {driver.driver}
                        </Link>
                      </span>
                    )),
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
            <h1 className={classes.section}>point and position statistics:</h1>
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
