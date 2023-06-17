import BaseLayout from "@/components/Layout/Layout";
import { getDriverByYear } from "@/shared/services";
import { DriverResult, ResultWithWinner } from "@/shared/types";
import { Row, Col, Result, Button } from "antd";
import { FC, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import classes from "./DriverByYear.module.scss";
import { Title } from "@/components/Title/Title";
import { Rank } from "@/components/Rank/Rank";
import { delay } from "@/shared/utils";
import { Loading } from "@/components/Loading/Loading";
import { LineChart } from "./LineChart/LineChart";

type DriverByYearParams = {
  year: string;
  driver: string;
};

export const DriverByYear: FC = () => {
  const [data, setData] = useState<DriverResult | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams<DriverByYearParams>();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { year, driver } = params;
      if (year && driver) {
        const response = await getDriverByYear(parseInt(year), driver);
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
            page={`#${data?.no} ${data?.driver}`}
            currentYear={parseInt(params.year || "")}
            setCurrentYear={(year: number) => {
              navigate(`/drivers/${data?.driver_name_code}/${year}`);
            }}
          />
          <div className={classes.container}>
            <h1 className={classes.section}>
              Team:{" "}
              <Link to={`/teams/${data.car_name_code}/${params.year}`}>
                {data.car}
              </Link>
            </h1>
            <h1 className={classes.section}>{params.year} races</h1>
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
                        {result.race_results.length > 0 && (
                          <Rank rank={result.race_results[0].pos} />
                        )}
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
