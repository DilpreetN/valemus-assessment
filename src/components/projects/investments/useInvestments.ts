import {useAppDispatch, useAppSelector} from "@/store/store.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import {fetchAsync} from "@/utils/fetchJson.ts";
import type {
  Investment,
  InvestmentFormFields
} from "@/components/projects/investments/investment.ts";
import {jsonStore} from "@/utils/cache.ts";
import {DateTime} from "luxon";
import {useCallback} from "react";
import {investmentActions} from "@/store/investmentSlice.ts";
import {toast} from "sonner";

const fetchInvestments = async (projectId: string) => {
  const data = await fetchAsync<Investment[]>("investments");
  return data.filter(x => x.projectId == projectId);
};

const createInvestment = async (investment: Investment) => {
  const prev = jsonStore.get<Investment[]>("investments")!;

  jsonStore.set("investments", [...prev, investment]);
};

const updateInvestment = async (investment: Investment) => {
  const investments = jsonStore.get<Investment[]>("investments")!;

  const targetId = investment.id;
  const updatedInvestments = investments.map(x => {
    if (x.id != targetId) {
      return x;
    }

    return {
      ...x,
      ...investment,
    }
  })

  jsonStore.set("investments", updatedInvestments);
};

const useInvestments = () => {
  const selectedProject = useAppSelector(
      (state) => state.projects.selectedProject,
  );
  const selectedProjectId = selectedProject!.id;
  const isCreatingInvestment = useAppSelector(state => state.investments.isCreatingInvestment);
  const editInvestment = useAppSelector(state => state.investments.editableInvestment);
  const dispatch = useAppDispatch();

  const {data, error, status} = useQuery({
    queryKey: ["investments", selectedProjectId],
    queryFn: async () => await fetchInvestments(selectedProjectId),
    enabled: selectedProjectId != null,
  });

  const createMutation = useMutation({
    mutationFn: createInvestment,
    onSuccess: async (_, __, ___, context) => {
      await context.client.invalidateQueries({queryKey: ['investments', selectedProjectId]})
      dispatch(investmentActions.clear());
      toast("Created investment.")
    }
  })

  const updateMutation = useMutation({
    mutationFn: updateInvestment,
    onSuccess: async (_, __, ___, context) => {
      await context.client.invalidateQueries({queryKey: ['investments', selectedProjectId]})
      dispatch(investmentActions.clear());
      toast("Updated investment.")
    }
  })

  const handleAddInvestment = useCallback((fields: InvestmentFormFields) => {
    const investment: Investment = {
      ...fields,
      projectId: selectedProjectId,
      id: DateTime.now().toISO(),
    }

    createMutation.mutate(investment);
  }, [selectedProjectId, createMutation.mutate])

  const handleUpdateInvestment = useCallback((fields: InvestmentFormFields) => {
    console.assert(editInvestment != null, "EditInvestment should not be null when updating an investment");

    const updatedInvestment: Investment = {
      ...editInvestment!,
      ...fields,
    };

    updateMutation.mutate(updatedInvestment)
  }, [updateMutation.mutate, editInvestment]);

  const handleCreateInvestment = useCallback(() => {
    dispatch(investmentActions.createInvestment());
  }, [dispatch])

  const handleInvestmentEdit = useCallback((investment: Investment) => {
    dispatch(investmentActions.editInvestment(investment))
  }, [dispatch]);

  const handleCancelCreateInvestment = useCallback(() => {
    dispatch(investmentActions.clear());
  }, [dispatch])

  const handleCancelEditInvestment = useCallback(() => {
    dispatch(investmentActions.clear());
  }, [dispatch])

  return {
    investments: data,
    error,
    isLoading: status == 'pending',
    isCreatingInvestment,
    editInvestment,
    handleCreateInvestment,
    handleCancelCreateInvestment,
    handleAddInvestment,
    handleInvestmentEdit,
    handleUpdateInvestment,
    handleCancelEditInvestment,
  }
}

export default useInvestments;