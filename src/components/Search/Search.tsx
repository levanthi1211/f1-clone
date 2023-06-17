import { FC, Dispatch, SetStateAction, useState } from "react";
import classes from "./Search.module.scss";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Row, Col } from "antd";
import { debounce } from "../../shared/utils";
import { search } from "@/shared/services";
import { SearchResult, SearchResultFull } from "@/shared/types";
import { Link } from "react-router-dom";

interface ISearchProps {
  setOpenSearch: Dispatch<SetStateAction<boolean>>;
}

export const Search: FC<ISearchProps> = ({ setOpenSearch }) => {
  const [data, setData] = useState<SearchResultFull>({
    grand_prixs: [],
    drivers: [],
    teams: [],
  });
  const onSearchData = debounce(async (keyword: string) => {
    if (keyword.length >= 2) {
      const response = await search(keyword);
      console.log(response);
      if (response.data) {
        setData(response.data);
      }
    } else {
      setData({
        grand_prixs: [],
        drivers: [],
        teams: [],
      });
    }
  }, 500);

  return (
    <div className={classes.search}>
      <Button
        className={classes.close_button}
        type="ghost"
        onClick={() => setOpenSearch(false)}
        icon={<CloseOutlined className={classes.close_icon} />}
      />
      <input
        onChange={(e) => {
          onSearchData(e.target.value);
        }}
        className={classes.input}
        placeholder="What are you looking for...?"
      />
      <div className={classes.results}>
        <Row justify="center">
          {data.drivers.length > 0 && (
            <Col span={8} className={classes.col_result}>
              <p className={classes.title}>Drivers:</p>
              {data.drivers.map((driver: SearchResult, index: number) => (
                <Link key={index} to={`/drivers/${driver.name_code}`}>
                  <p className={classes.result}>{driver.name}</p>
                </Link>
              ))}
            </Col>
          )}
          {data.teams.length > 0 && (
            <Col span={8} className={classes.col_result}>
              <p className={classes.title}>Teams:</p>
              {data.teams.map((team: SearchResult, index: number) => (
                <Link key={index} to={`/teams/${team.name_code}`}>
                  <p className={classes.result}>{team.name}</p>
                </Link>
              ))}
            </Col>
          )}
          {data.grand_prixs.length > 0 && (
            <Col span={8} className={classes.col_result}>
              <p className={classes.title}>Grand Prix:</p>
              {data.grand_prixs.map(
                (grand_prix: SearchResult, index: number) => (
                  <Link
                    key={index}
                    to={`/races/${grand_prix.name.split(" ")[0]}/${
                      grand_prix.name_code
                    }`}
                  >
                    <p className={classes.result}>{grand_prix.name}</p>
                  </Link>
                )
              )}
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};
