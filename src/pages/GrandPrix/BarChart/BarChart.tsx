import { FC, useEffect, useState } from "react";
import { Bar, BarConfig } from "@ant-design/plots";
import { DriverWithWinner, RaceResult } from "@/shared/types";
import { Col, Row } from "antd";

interface IBarChartProps {
  data: RaceResult[];
}

interface BarChartDataItem {
  label: string;
  type: string;
  value: number;
}

export const BarChart: FC<IBarChartProps> = ({ data }) => {
  const [driversData, setDriversData] = useState<BarChartDataItem[]>([]);
  const [teamsData, setTeamsData] = useState<BarChartDataItem[]>([]);

  useEffect(() => {
    const driversData: BarChartDataItem[] = [];
    const teamsData: BarChartDataItem[] = [];
    data.forEach((item: RaceResult) => {
      const { car } = item;

      driversData.push({
        label: item.driver,
        type: "pts",
        value: item.pts,
      });
      const foundTeam = teamsData.findIndex((team) => team.label === car);
      if (foundTeam < 0) {
        teamsData.push({
          label: item.car,
          type: "pts",
          value: item.pts,
        });
      } else {
        teamsData[foundTeam].value += item.pts;
      }
    });

    setDriversData(driversData);
    setTeamsData(teamsData);
  }, [data]);

  const baseConfig: Omit<BarConfig, "data" | "barStyle"> = {
    isGroup: true,
    xField: "value",
    yField: "label",
    seriesField: "type",
    legend: false,
    label: {
      position: "middle",
      layout: [
        {
          type: "interval-adjust-position",
        },
        {
          type: "interval-hide-overlap",
        },
        {
          type: "adjust-color",
        },
      ],
    },
    style: {
      height: "800px",
      padding: "1rem",
    },
  };

  const driversConfig: BarConfig = {
    ...baseConfig,
    data: driversData.sort((a, b) => b.value - a.value),
    barStyle: {
      radius: [2, 2, 0, 0],
      fill: "#e30118",
    },
  };

  const teamsConfig: BarConfig = {
    ...baseConfig,
    data: teamsData.sort((a, b) => b.value - a.value),
    barStyle: {
      radius: [2, 2, 0, 0],
      fill: "#000979",
    },
  };

  return (
    <Row gutter={32}>
      <Col span={12}>
        <h1>Drivers:</h1>
        <Bar {...driversConfig} />
      </Col>
      <Col span={12}>
        <h1>Teams:</h1>
        <Bar {...teamsConfig} />
      </Col>
    </Row>
  );
};
