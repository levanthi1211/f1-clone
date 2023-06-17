import { FC, useEffect, useState } from "react";
import { Bar, BarConfig } from "@ant-design/plots";
import { Team } from "@/shared/types";
import { Col, Row } from "antd";

interface IBarChartProps {
  data: Team[];
}

interface BarChartDataItem {
  label: string;
  type: string;
  value: number;
}

export const BarChart: FC<IBarChartProps> = ({ data }) => {
  const [ptsData, setPtsData] = useState<BarChartDataItem[]>([]);

  useEffect(() => {
    const ptsData: BarChartDataItem[] = [];

    data.forEach((item: Team) => {
      ptsData.push({
        label: item.car,
        type: "pts",
        value: item.pts,
      });
    });

    setPtsData(ptsData);
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

  return (
    <Row gutter={32}>
      <Col span={12} offset={6}>
        <h1>PTS result:</h1>
        <Bar {...ptsConfig} />
      </Col>
    </Row>
  );
};
