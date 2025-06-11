import api from "./api";
import { IEdition } from "../types";

const getEditions = () => {
  return api.get<IEdition[]>("/works");
};

const searchEditions = (query: string) => {
    return api.get<IEdition[]>(`/works/search?q=${query}`);
};

const WorkService = { getEditions, searchEditions };
export default WorkService;