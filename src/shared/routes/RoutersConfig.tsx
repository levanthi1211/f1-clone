import { createBrowserRouter } from "react-router-dom";

import {
  Home,
  Drivers,
  Races,
  Teams,
  GrandPrix,
  Driver,
  DriverByYear,
  TeamByYear,
  Team,
} from "@/pages";

export const paths = {
  races: "/races",
  home: "/",
  drivers: "/drivers",
  teams: "/teams",
  grand_prix: "races/:grand_prix",
  grand_prix_by_year: "races/:grand_prix/:year",
  driver_by_year: "/drivers/:driver/:year",
  driver: "/drivers/:driver",
  team_by_year: "/teams/:team/:year",
  team: "/teams/:team",
};

export const router = createBrowserRouter([
  {
    path: paths.races,
    element: <Races />,
  },
  {
    path: paths.home,
    element: <Home />,
  },
  {
    path: paths.drivers,
    element: <Drivers />,
  },
  {
    path: paths.teams,
    element: <Teams />,
  },
  {
    path: paths.grand_prix_by_year,
    element: <GrandPrix />,
  },
  {
    path: paths.grand_prix,
    element: <GrandPrix />,
  },
  {
    path: paths.driver_by_year,
    element: <DriverByYear />,
  },
  {
    path: paths.driver,
    element: <Driver />,
  },
  {
    path: paths.team_by_year,
    element: <TeamByYear />,
  },
  {
    path: paths.team,
    element: <Team />,
  },
]);
