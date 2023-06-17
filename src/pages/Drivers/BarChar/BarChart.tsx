import { FC, useEffect, useState } from "react";
import { Bar, BarConfig } from "@ant-design/plots";
import { DriverWithWinner } from "@/shared/types";
import { Col, Row } from "antd";

interface IBarChartProps {
  data: DriverWithWinner[];
}

interface BarChartDataItem {
  label: string;
  type: string;
  value: number;
}

export const BarChart: FC<IBarChartProps> = ({ data }) => {
  const [ptsData, setPtsData] = useState<BarChartDataItem[]>([]);
  const [winnerData, setWinnerData] = useState<BarChartDataItem[]>([]);

  useEffect(() => {
    const ptsData: BarChartDataItem[] = [],
      winnerData: BarChartDataItem[] = [];

    data.forEach((item: DriverWithWinner) => {
      ptsData.push({
        label: item.driver,
        type: "pts",
        value: item.pts,
      });

      winnerData.push({
        label: item.driver,
        type: "winner",
        value: item.winner,
      });
    });

    setPtsData(ptsData);
    setWinnerData(winnerData);
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

  const ptsConfig: BarConfig = {
    ...baseConfig,
    data: ptsData.sort((a, b) => b.value - a.value),
    barStyle: {
      radius: [2, 2, 0, 0],
      fill: "#e30118",
    },
  };

  const winnerConfig: BarConfig = {
    ...baseConfig,
    data: winnerData.sort((a, b) => b.value - a.value),
    barStyle: {
      radius: [2, 2, 0, 0],
      fill: "#000979",
    },
  };

  return (
    <Row gutter={32}>
      <Col span={12}>
        <h1>PTS result:</h1>
        <Bar {...ptsConfig} />
      </Col>
      <Col span={12}>
        <h1>Winner result:</h1>
        <Bar {...winnerConfig} />
      </Col>
    </Row>
  );
};
