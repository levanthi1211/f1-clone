export interface RaceResult {
  pos: number;
  no: number;
  driver: string;
  driver_name_code: string;
  car: string;
  laps: number;
  "time-retired": string;
  pts: number;
  car_name_code: string;
}

export interface Result {
  grand_prix: string;
  date: string;
  race_name: string;
  race_name_code: string;
  race_results: RaceResult[];
  circuit: string;
}

export interface ResultWithWinner extends Result {
  winner?: string;
}

export interface DriverResult extends Driver {
  race_results: ResultWithWinner[];
}

export interface Data {
  year: number;
  result: Result[];
  drivers: Driver[];
}

export interface Driver {
  driver: string;
  no: number;
  car: string;
  pts: number;
  driver_name_code: string;
  car_name_code: string;
  pos: number;
}

export interface DriverWithWinner extends Driver {
  winner: number;
}

export interface Team {
  car: string;
  car_name_code: string;
  winner: number;
  drivers: Driver[];
  pts: number;
  pos: number;
}

export interface TeamResult extends Team {
  race_results: ResultWithWinner[];
}

export interface SearchResult {
  name: string;
  name_code: string;
}

export interface SearchResultFull {
  grand_prixs: SearchResult[];
  drivers: SearchResult[];
  teams: SearchResult[];
}
