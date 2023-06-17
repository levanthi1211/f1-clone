import { FC, useEffect, useState } from "react";
import { DualAxes, DualAxesConfig } from "@ant-design/plots";
import { DriverResult } from "@/shared/types";
import { Col, Row } from "antd";

interface ILineChartProps {
  data: (DriverResult & {
    year: number;
  })[];
}

interface PosDataItem {
  year: number;

  pos: number;
}

interface PtsDataItem {
  year: number;
  pts: number;
}

export const ColumnLineChart: FC<ILineChartProps> = ({ data }) => {
  const [posData, setPosData] = useState<PosDataItem[]>([]);
  const [ptsData, setPtsData] = useState<PtsDataItem[]>([]);
  useEffect(() => {
    const posData: PosDataItem[] = [];
    const ptsData: PtsDataItem[] = [];
    data.forEach(
      (
        result: DriverResult & {
          year: number;
        }
      ) => {
        posData.push({
          year: result.year,

          pos: result.pos,
        });
        ptsData.push({
          year: result.year,

          pts: result.pts,
        });
      }
    );
    setPosData(posData);
    setPtsData(ptsData);
  }, [data]);

  const config: DualAxesConfig = {
    data: [posData, ptsData],
    xField: "year",
    yField: ["pos", "pts"],
    yAxis: [
      {
        min: 0,
        max: 25,
        range: [1, 0],
      },
    ],
    geometryOptions: [
      {
        geometry: "line",
        lineStyle: {
          lineWidth: 2,
        },
      },
      {
        geometry: "column",
      },
    ],
    label: {},
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: "#000",
          fill: "red",
        },
      },
    },
    interactions: [
      {
        type: "marker-active",
      },
    ],
  };

  return (
    <Row gutter={32}>
      <Col span={24}>
        <DualAxes {...config} />
      </Col>
    </Row>
  );
};
