import {
  DriverWithWinner,
  ResultWithWinner,
  SearchResult,
  SearchResultFull,
} from "./types.d";
import {
  Data,
  Result,
  RaceResult,
  Team,
  DriverResult,
  TeamResult,
} from "./types";

interface Response<T> {
  data?: T;
  error?: string;
}

export const loadJSON = async (): Promise<Response<Data[]>> => {
  const response = await fetch("/data.json");
  const data: Data[] = await response.json();
  if (!data) {
    return {
      error: `Can't find file data.json`,
    };
  }
  return { data };
};

export const getRacesByYear = async (
  year: number
): Promise<Response<ResultWithWinner[]>> => {
  const results = await loadJSON();
  if (!results.data) {
    return { error: `Error when fecth file` };
  }
  const resultByYear: Data | undefined = results.data.find(
    (result: Data) => result.year === year
  );
  if (resultByYear === undefined) {
    return { error: `Can't find result year ${year}` };
  }
  const data: ResultWithWinner[] = resultByYear?.result.map(
    (result: Result) => {
      if (result.race_results.length > 0) {
        const { driver } = result.race_results[0]; // Get top 1 driver
        return {
          ...result,
          winner: driver,
        };
      }
      return result;
    }
  );
  return { data };
};

export const getDriversByYear = async (
  year: number
): Promise<Response<DriverWithWinner[]>> => {
  const results = await loadJSON();
  if (!results.data) {
    return { error: `Error when fecth file` };
  }
  const resultByYear: Data | undefined = results.data.find(
    (result: Data) => result.year === year
  );
  if (resultByYear === undefined) {
    return { error: `Can't find result year ${year}` };
  }
  const drivers: DriverWithWinner[] = [];
  resultByYear.result.forEach((result: Result) => {
    const { race_results } = result;
    race_results.forEach((race_result: RaceResult) => {
      const { no, driver_name_code } = race_result;
      const winner = race_result.pos === 1 ? 1 : 0;
      const foundDriver = drivers.findIndex((driver) => driver.no === no);
      const foundDriverInStading = resultByYear.drivers.find(
        (driver) => driver.driver_name_code === driver_name_code
      );
      if (foundDriver < 0) {
        drivers.push({
          driver: race_result.driver,
          driver_name_code: race_result.driver_name_code,
          no: race_result.no,
          car: race_result.car,
          winner,
          pts: foundDriverInStading?.pts || 0,
          car_name_code: race_result.car_name_code,
          pos: foundDriverInStading?.pos as number,
        });
      } else {
        drivers[foundDriver].winner += winner;
      }
    });
  });
  return { data: drivers };
};

export const getTeamsByYear = async (
  year: number
): Promise<Response<Team[]>> => {
  const { data: drivers } = await getDriversByYear(year);
  if (!drivers) {
    return { error: "Fetch driver error" };
  }
  const teams: Omit<Team, "pos">[] = [];
  drivers.forEach((driver: DriverWithWinner) => {
    const car = driver.car;
    const foundTeam = teams.findIndex((team) => team.car === car);
    if (foundTeam < 0) {
      teams.push({
        car: car,
        winner: driver.winner,
        drivers: [driver],
        pts: driver.pts,
        car_name_code: driver.car_name_code,
      });
    } else {
      teams[foundTeam].drivers.push(driver);
      teams[foundTeam].winner += driver.winner;
      teams[foundTeam].pts += driver.pts;
    }
  });
  return {
    data: teams
      .sort((a, b) => b.pts - a.pts)
      .map((team, index) => ({
        ...team,
        pos: index + 1,
      })),
  };
};

export const getRaceByYear = async (
  year: number,
  race: string
): Promise<Response<Result>> => {
  const result = await loadJSON();
  if (!result.data) {
    return { error: result.error };
  }
  const resultByYear: Data | undefined = result.data.find(
    (result: Data) => result.year === year
  );
  if (resultByYear === undefined) {
    return { error: `Can't find result year ${year}` };
  }
  const race_results = resultByYear.result.find(
    (result: Result) => result.race_name_code === race
  );
  if (!race_results) {
    return {
      error: `Can't find race ${race} year ${year}`,
    };
  }
  return {
    data: race_results,
  };
};

export const getDriverByYear = async (
  year: number,
  driver: string
): Promise<Response<DriverResult>> => {
  const { data: drivers, error: drivers_error } = await getDriversByYear(year);
  if (!drivers) {
    return { error: drivers_error };
  }
  const { data: races_results, error: races_result_error } =
    await getRacesByYear(year);
  if (!races_results) {
    return { error: races_result_error };
  }
  const foundDriver = drivers.find(
    (_driver) => _driver.driver_name_code === driver
  );
  if (!foundDriver) {
    return {
      error: `Driver ${driver} dont play at ${year}`,
    };
  }

  const getDriverPerRace: ResultWithWinner[] = races_results.map(
    (races_result: ResultWithWinner) => {
      const { race_results } = races_result;
      const result_of_driver = race_results.filter(
        (race_result) => race_result.driver_name_code === driver
      );
      return {
        ...races_result,
        race_results: result_of_driver,
      };
    }
  );

  return {
    data: {
      ...foundDriver,
      race_results: getDriverPerRace,
    },
  };
};

export const getDriver = async (
  driver: string
): Promise<Response<(DriverResult & { year: number })[]>> => {
  const results = await loadJSON();
  if (!results.data) {
    return { error: `Error when fecth file` };
  }
  const years: number[] = [];
  results.data.forEach((result: Data) => {
    const { year, drivers } = result;
    const foundDriver = drivers.find(
      (_driver) => _driver.driver_name_code === driver
    );
    if (foundDriver) {
      years.push(year);
    }
  });
  const result: (DriverResult & { year: number })[] = [];
  for (let i = years[0]; i <= years[years.length - 1]; i++) {
    const { data: driver_by_year } = await getDriverByYear(i, driver);
    if (driver_by_year) {
      result.push({
        ...driver_by_year,
        year: i,
      });
    }
  }
  return { data: result };
};

export const getTeamByYear = async (year: number, team: string) => {
  const { data: teams, error: teams_error } = await getTeamsByYear(year);
  if (!teams) {
    return { error: teams_error };
  }
  const { data: races_results, error: races_result_error } =
    await getRacesByYear(year);
  if (!races_results) {
    return { error: races_result_error };
  }
  const foundTeam = teams.find((_driver) => _driver.car_name_code === team);
  if (!foundTeam) {
    return {
      error: `Team ${team} dont play at ${year}`,
    };
  }

  const getDriverPerRace: ResultWithWinner[] = races_results.map(
    (races_result: ResultWithWinner) => {
      const { race_results } = races_result;
      const result_of_driver = race_results.filter(
        (race_result) => race_result.car_name_code === team
      );
      return {
        ...races_result,
        race_results: result_of_driver,
      };
    }
  );

  return {
    data: {
      ...foundTeam,
      race_results: getDriverPerRace,
    },
  };
};

export const getTeam = async (team: string) => {
  const results = await loadJSON();
  if (!results.data) {
    return { error: `Error when fecth file` };
  }
  const years: number[] = [];
  results.data.forEach((result: Data) => {
    const { year, drivers } = result;
    const foundTeam = drivers.find((_driver) => _driver.car_name_code === team);
    if (foundTeam) {
      years.push(year);
    }
  });
  const result: (TeamResult & { year: number })[] = [];
  for (let i = years[0]; i <= years[years.length - 1]; i++) {
    const { data: team_by_year } = await getTeamByYear(i, team);
    if (team_by_year) {
      result.push({
        ...team_by_year,
        year: i,
      });
    }
  }
  return { data: result };
};

export const search = async (
  keyword: string
): Promise<Response<SearchResultFull>> => {
  const results = await loadJSON();
  if (!results.data) {
    return { error: `Error when fecth file` };
  }

  let found_teams: SearchResult[] = [],
    found_drivers: SearchResult[] = [],
    found_grand_prixs: SearchResult[] = [];

  results.data.forEach((_result: Data) => {
    const { result, drivers } = _result;

    const found_grand_prixs_by_year = [
      ...new Set(
        result
          .filter((item: Result) =>
            item.race_name.toLowerCase().includes(keyword.toLowerCase())
          )
          .map((item: Result) => ({
            name: item.race_name,
            name_code: item.race_name_code,
          }))
      ),
    ];
    found_grand_prixs = found_grand_prixs.concat(found_grand_prixs_by_year);
    const found_drivers_by_year = [
      ...new Set(
        drivers
          .filter((item) =>
            item.driver
              .toLocaleLowerCase()
              .includes(keyword.toLocaleLowerCase())
          )
          .map((item) => ({
            name: item.driver,
            name_code: item.driver_name_code,
          }))
      ),
    ];
    found_drivers = found_drivers.concat(found_drivers_by_year);
    const found_teams_by_year = [
      ...new Set(
        drivers
          .filter((item) =>
            item.car.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
          )
          .map((item) => ({ name: item.car, name_code: item.car_name_code }))
      ),
    ];
    found_teams = found_teams.concat(found_teams_by_year);
  });

  return {
    data: {
      teams: found_teams.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t.name === value.name && t.name_code === value.name_code
          )
      ),
      drivers: found_drivers.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t.name === value.name && t.name_code === value.name_code
          )
      ),
      grand_prixs: found_grand_prixs.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t.name === value.name && t.name_code === value.name_code
          )
      ),
    },
  };
};
