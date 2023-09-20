export type Document = {
  namespace: string;
  flags: { key: string; variants?: { key: string }[] }[];
  segments?: {
    constraints?: {
      property: string;
      type:
        | "STRING_COMPARISON_TYPE"
        | "BOOLEAN_COMPARISON_TYPE"
        | "NUMBER_COMPARISON_TYPE"
        | "DATETIME_COMPARISON_TYPE";
    }[];
  }[];
};
