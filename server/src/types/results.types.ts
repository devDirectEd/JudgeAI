type CategoryResponse = {
  name: string;
  weight: number;
  questions: any[];
};
export type ResultsConfigResponse = {
  message: string;
  config: {
    categories: CategoryResponse[];
  };
};
