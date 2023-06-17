import { ordinal_suffix_of } from "@/shared/utils";
import { FC } from "react";
import { Tag } from "antd";
import classes from "./Rank.module.scss";

interface IRankProps {
  rank: number;
}

export const Rank: FC<IRankProps> = ({ rank }) => {
  const text = ordinal_suffix_of(rank);
  if (rank === 1)
    return (
      <Tag color="#ffb400" className={`${classes.rank} ${classes.rank_1}`}>
        {text}
      </Tag>
    );
  else if (rank === 2)
    return (
      <Tag color="#1c95f3" className={`${classes.rank} ${classes.rank_2}`}>
        {text}
      </Tag>
    );
  else if (rank === 3)
    return (
      <Tag color="#CD7F32" className={`${classes.rank} ${classes.rank_3}`}>
        {text}
      </Tag>
    );
  else if (!rank)
    return (
      <Tag color="black" className={`${classes.rank} ${classes.rank_dnf}`}>
        DNF
      </Tag>
    );
  return (
    <Tag color="#dddddd" className={classes.rank}>
      {text}
    </Tag>
  );
};
