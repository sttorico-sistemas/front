import axios from "axios"

export const useAxios = () => {
  const instance = axios.create({
    baseURL: 'https://dev-02-apiv2.management.infoconsig.tec.br/api'
  })
  return instance;
}