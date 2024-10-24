import { LocationCity } from "./location_city";

export type StateUf =
  | 'RO'
  | 'AC'
  | 'AM'
  | 'RR'
  | 'PA'
  | 'AP'
  | 'TO'
  | 'MA'
  | 'PI'
  | 'CE'
  | 'RN'
  | 'PB'
  | 'PE'
  | 'AL'
  | 'SE'
  | 'BA'
  | 'MG'
  | 'ES'
  | 'RJ'
  | 'SP'
  | 'PR'
  | 'SC'
  | 'RS'
  | 'MS'
  | 'MT'
  | 'GO'
  | 'DF';

export type StateCities = {
  [key in StateUf]?: LocationCity[];
};

export interface LocationState {
  id: number;
  name: string;
  uf: StateUf;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  ibgeId: number;
}