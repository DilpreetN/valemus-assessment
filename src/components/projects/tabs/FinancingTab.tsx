import {type FC} from "react";
import useCategories from "../investments/useCategories";
import LoadingSpinner from "@/components/utils/LoadingSpinner";
import useInvestments from "@/components/projects/investments/useInvestments.ts";
import InvestmentTable from "@/components/projects/investments/InvestmentTable.tsx";
import type {
  Investment,
  InvestmentFormFields
} from "@/components/projects/investments/investment.ts";
import InvestmentDialogForm from "@/components/projects/investments/InvestmentDialogForm.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";

const investmentToFormFields = (investment: Investment | null): InvestmentFormFields | undefined => {
  return investment ?? undefined;
}

const FinancingTab: FC = () => {
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError
  } = useCategories();
  const {
    investments: investmentsData,
    isLoading: isLoadingInvestments,
    error: investmentsError,
    isCreatingInvestment,
    editInvestment,
    handleAddInvestment,
    handleCreateInvestment,
    handleCancelCreateInvestment,
    handleInvestmentEdit,
    handleCancelEditInvestment,
    handleUpdateInvestment,
  } = useInvestments();

  if (isLoadingInvestments || isLoadingCategories) {
    return <LoadingSpinner/>;
  }

  if (categoriesError != null || investmentsError != null) {
    return <>ERROR: {categoriesError ?? investmentsError}</>;
  }

  console.assert(investmentsData != null, "Investmentdata should not be null");
  console.assert(categoriesData != null, "CategoriesData should not be null");

  return (
      <div className="flex flex-col gap-2">
        <div className="flex justify-end">
          <Button className="w-fit" variant="outline" onClick={handleCreateInvestment}>
            <Plus/> Create investment
          </Button>
        </div>
        <InvestmentTable
            investments={investmentsData!}
            categories={categoriesData!}
            onEdit={handleInvestmentEdit}
        />
        <InvestmentDialogForm
            key="create-investment"
            isOpen={isCreatingInvestment} categories={categoriesData!}
            onSubmit={handleAddInvestment} onCancel={handleCancelCreateInvestment}
            title="Create investment"
            submitLabel="Create"
            confirmTitle="Cancelling creation of investment"
            confirmActionLabel="Cancel creation"
            confirmCancelLabel="Go back"
            confirmDescription="You are about to close the creation of an investment. The data will not be saved. Cancel?"
        />
        <InvestmentDialogForm
            key="edit-investment"
            isOpen={editInvestment != null}
            initialValues={investmentToFormFields(editInvestment!)}
            categories={categoriesData!}
            onSubmit={handleUpdateInvestment} onCancel={handleCancelEditInvestment}
            title="Edit investment"
            submitLabel="Save changes"
            confirmTitle="Cancelling edit of investment"
            confirmActionLabel="Cancel edit"
            confirmCancelLabel="Go back"
            confirmDescription="You are about to close the edit of an investment. The data will not be saved. Cancel?"
        />
      </div>
  );
};

export default FinancingTab;
