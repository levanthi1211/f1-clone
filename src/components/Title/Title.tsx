import { FC, useState, Dispatch, SetStateAction } from "react";
import classes from "./Title.module.scss";

interface ITitleProps {
  currentYear?: number;
  setCurrentYear?: Dispatch<SetStateAction<number>> | ((year: number) => void);
  page: string;
  changer: boolean;
}

export const Title: FC<ITitleProps> = ({
  currentYear,
  setCurrentYear,
  page,
  changer,
}) => {
  const [isOpenSelectYear, setOpenSelectYear] = useState<boolean>(false);
  return (
    <div className={classes.title_container}>
      <div className={classes.title}>
        <h1>FORMULA 1</h1>
        <h1>{page}</h1>
        <p className={classes.year}>{currentYear}</p>
        {changer && (
          <div
            className={classes.changer}
            onClick={() => setOpenSelectYear((isOpen) => !isOpen)}
          >
            Select year
          </div>
        )}
      </div>
      {isOpenSelectYear && (
        <div className={classes.years}>
          {[...Array(74).keys()]
            .map((year) => year + 1950)
            .reverse()
            .map((year: number, index: number) => {
              return (
                <span
                  key={index}
                  className={classes.year}
                  style={
                    year === currentYear
                      ? { backgroundColor: "white", color: "#e30118" }
                      : {}
                  }
                  onClick={() => {
                    if (setCurrentYear) {
                      setCurrentYear(year);
                    }
                    setOpenSelectYear(false);
                  }}
                >
                  {year}
                </span>
              );
            })}
        </div>
      )}
    </div>
  );
};
