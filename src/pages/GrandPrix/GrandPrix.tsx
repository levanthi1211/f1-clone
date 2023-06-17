import BaseLayout from "@/components/Layout/Layout";
import { Title } from "@/components/Title/Title";
import { getRaceByYear } from "@/shared/services";
import { Result } from "@/shared/types";
import { Table, Result as ResultAntd, Button } from "antd";
import { FC, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import classes from "./GrandPrix.module.scss";
import { Loading } from "@/components/Loading/Loading";
import { delay } from "@/shared/utils";
import { BarChart } from "./BarChart/BarChart";

type GrandPrixParams = {
  year: string;
  grand_prix: string;
};

export const GrandPrix: FC = () => {
  const [data, setData] = useState<Result | undefined>();
  const params = useParams<GrandPrixParams>();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { grand_prix } = params;
      let { year } = params;
      if (!year) {
        year = new Date().getFullYear().toString();
      }
      if (year && grand_prix) {
        const response = await getRaceByYear(parseInt(year), grand_prix);
        if (response.data) setData(response.data);
        else {
          setData(undefined);
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
          <Title
            changer={true}
            page={data?.race_name || ""}
            currentYear={parseInt(
              params.year || new Date().getFullYear().toString()
            )}
            setCurrentYear={(year: number) => {
              navigate(`/races/${data?.race_name_code}/${year}`);
            }}
          />
          <div className={classes.container}>
            <h1 className={classes.section}>Grand prix result:</h1>
            <Table
              pagination={false}
              dataSource={data?.race_results}
              columns={[
                {
                  title: "Pos",
                  dataIndex: "pos",
                  key: "pos",
                },
                {
                  title: "Driver",
                  dataIndex: "driver",
                  key: "driver",
                  render: (winner, row) => (
                    <Link
                      className={classes.link}
                      to={`/drivers/${row.driver_name_code}/${params.year}`}
                    >
                      {winner}
                    </Link>
                  ),
                },
                {
                  title: "Car",
                  dataIndex: "car",
                  key: "car",
                  render: (car, row) => (
                    <Link
                      className={classes.link}
                      to={`/teams/${row.car_name_code}/${params.year}`}
                    >
                      {car}
                    </Link>
                  ),
                },
                {
                  title: "Time/retired",
                  dataIndex: "time-retired",
                  key: "time-retired",
                },
                {
                  title: "Laps",
                  dataIndex: "laps",
                  key: "laps",
                },
                {
                  title: "Pts",
                  dataIndex: "pts",
                  key: "pts",
                },
              ]}
            />
            <h1 className={classes.section}>Grand prix statistics:</h1>
            <BarChart data={data.race_results} />
          </div>
        </>
      ) : (
        <ResultAntd
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Link to={`/races`}>
              <Button type="primary">Back Home</Button>
            </Link>
          }
        />
      )}
    </BaseLayout>
  );
};
