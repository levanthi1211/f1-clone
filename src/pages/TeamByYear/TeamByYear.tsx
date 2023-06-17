import BaseLayout from "@/components/Layout/Layout";
import { getTeamByYear } from "@/shared/services";
import { ResultWithWinner, TeamResult } from "@/shared/types";
import { Row, Col, Result, Button, Table } from "antd";
import { FC, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import classes from "./TeamByYear.module.scss";
import { delay, ordinal_suffix_of } from "@/shared/utils";
import { Title } from "@/components/Title/Title";
import { LineChart } from "./LineChart/LineChart";
import { Loading } from "@/components/Loading/Loading";

type TeamByYearParams = {
  year: string;
  team: string;
};

export const TeamByYear: FC = () => {
  const [data, setData] = useState<TeamResult | undefined>();
  const params = useParams<TeamByYearParams>();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { year, team } = params;
      if (year && team) {
        const response = await getTeamByYear(parseInt(year), team);
        if (!response.data) setData(undefined);
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
          <Title
            changer={true}
            page={`${data?.car}`}
            currentYear={parseInt(params.year || "")}
            setCurrentYear={(year: number) => {
              navigate(`/teams/${data?.car_name_code}/${year}`);
            }}
          />
          <div className={classes.container}>
            <h1 className={classes.section}>{params.year} drivers:</h1>
            <Table
              pagination={false}
              dataSource={data.drivers}
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
                        to={`/drivers/${row.driver_name_code}/${params.year}`}
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
                  title: "Winner",
                  dataIndex: "winner",
                  key: "winner",
                },
                {
                  title: "PTS",
                  dataIndex: "pts",
                  key: "pts",
                },
              ]}
            />
            <h1 className={classes.section}>{params.year} races:</h1>
            <Row gutter={[16, 16]} style={{ marginBottom: "3rem" }}>
              {data?.race_results.map((result: ResultWithWinner) => {
                return (
                  <Col span={6}>
                    <Link to={`/races/${result.race_name_code}/${params.year}`}>
                      <div className={classes.grand_prix_container}>
                        <p className={classes.grand_prix}>
                          {result.grand_prix}
                        </p>
                        <p className={classes.date}>{result.date}</p>
                        {result.race_results.length > 0 &&
                          result.race_results.map((result) => (
                            <p>
                              {result.driver}:{" "}
                              {result.pos !== null
                                ? ordinal_suffix_of(result.pos)
                                : "DNF"}
                            </p>
                          ))}
                      </div>
                    </Link>
                  </Col>
                );
              })}
            </Row>
            <h1 className={classes.section}>
              {params.year} standings statistics:
            </h1>
            <LineChart data={data} />
          </div>
        </>
      ) : (
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Link to={`/drivers`}>
              <Button type="primary">Back Home</Button>
            </Link>
          }
        />
      )}
    </BaseLayout>
  );
};
