export type Investment = {
  id: string;
  projectId: string;
  description: string;
  categoryId: string;
  date: string;
  investor: string;
  amount: number;
  note: string | null;
};

export type InvestmentFormFields = Omit<
  Investment,
  "id" | "projectId"
>;
