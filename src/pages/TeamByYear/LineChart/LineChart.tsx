import { FC, useEffect, useState } from "react";
import { Line, LineConfig } from "@ant-design/plots";
import { ResultWithWinner, TeamResult } from "@/shared/types";
import { Col, Row } from "antd";

interface ILineChartProps {
  data: TeamResult;
}

interface LineChartDataItem {
  grand_prix: string;
  pos?: number;
  name?: string;
}

export const LineChart: FC<ILineChartProps> = ({ data }) => {
  const [posData, setPosData] = useState<LineChartDataItem[]>([]);
  useEffect(() => {
    const posData: LineChartDataItem[] = [];
    data.race_results.forEach((result: ResultWithWinner) => {
      if (result.race_results.length > 0) {
        posData.push(
          {
            grand_prix: result.grand_prix,
            pos: result.race_results[0].pos,
            name: result.race_results[0].driver,
          },
          {
            grand_prix: result.grand_prix,
            pos: result.race_results[1].pos,
            name: result.race_results[1].driver,
          }
        );
      } else {
        posData.push(
          {
            grand_prix: result.grand_prix,
          },
          {
            grand_prix: result.grand_prix,
          }
        );
      }
    });
    setPosData(posData);
  }, [data]);

  const config: LineConfig = {
    data: posData,
    xField: "grand_prix",
    yField: "pos",
    seriesField: "name",
    yAxis: {
      min: 1,
      max: 25,
      range: [1, 0],
    },
    label: {},
    point: {
      size: 5,
      shape: "diamond",
      style: {
        fill: "white",
        stroke: "#5B8FF9",
        lineWidth: 2,
      },
    },
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
        <Line {...config} />
      </Col>
    </Row>
  );
};
