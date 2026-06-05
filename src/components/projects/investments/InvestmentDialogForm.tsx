import {type FC, useCallback, useState} from "react";
import InvestmentForm from "@/components/projects/investments/InvestmentForm.tsx";
import type {InvestmentFormFields} from "@/components/projects/investments/investment.ts";
import type {Category} from "@/components/projects/investments/category.ts";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";

type InvestmentDialogFormProps = {
  isOpen: boolean;
  initialValues?: InvestmentFormFields;
  categories: Category[];
  onSubmit: (fields: InvestmentFormFields) => void;
  onCancel: () => void;
  title: string;
  submitLabel: string;
  confirmTitle: string;
  confirmDescription: string;
  confirmActionLabel: string;
  confirmCancelLabel: string;
}

const InvestmentDialogForm: FC<InvestmentDialogFormProps> = ({
                                                               isOpen,
                                                               categories,
                                                               onSubmit,
                                                               onCancel,
                                                               initialValues,
                                                               title,
                                                               submitLabel,
                                                               confirmTitle,
                                                               confirmDescription,
                                                               confirmCancelLabel,
                                                               confirmActionLabel
                                                             }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleConfirmCancel = useCallback(() => {
    setIsConfirmOpen(false);
    onCancel();
  }, [onCancel, setIsConfirmOpen]);

  const handleCancel = useCallback(() => {
    setIsConfirmOpen(true);
  }, [setIsConfirmOpen]);

  return (
      <>
        <Dialog open={isOpen}>
          <DialogContent showCloseButton={false} className="sm:max-w-2xl"
                         aria-label="investment-form"
                         aria-describedby={undefined}>
            <DialogTitle>{title}</DialogTitle>
            <InvestmentForm initialValues={initialValues} categories={categories}
                            onSubmit={onSubmit}/>
            <DialogFooter>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleCancel}
                        aria-label="Cancel investment">
                  Cancel
                </Button>

                <Button type="submit" form="investment-form"
                        aria-label={submitLabel}>{submitLabel}</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isConfirmOpen}>
          <AlertDialogContent aria-label="Confirm cancel">
            <AlertDialogHeader>
              <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                  onClick={() => setIsConfirmOpen(false)}
                  aria-label={confirmCancelLabel}>{confirmCancelLabel}</AlertDialogCancel>
              <AlertDialogAction
                  onClick={() => handleConfirmCancel()}
                  aria-label={confirmActionLabel}>{confirmActionLabel}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
  );
};

export default InvestmentDialogForm;