import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setContractDraft,
  setContractList,
  setContractLoading,
  setContractSaving,
  setContractUploading,
  setContractGenerating,
  setContractError,
} from '../store/contractSlice';
import {
  saveContractDraftApi,
  getLatestContractDraftApi,
  getContractByIdApi,
  listFinalizedContractsApi,
  finalizeContractApi,
  uploadContractApi,
  uploadSignedContractApi,
  updateShipmentStatusApi,
  deleteContractDraftApi,
} from '../services/contractApi';

export function useContract() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state    = useSelector(s => s.contract);

  const loadDraft = useCallback(async () => {
    dispatch(setContractLoading(true));
    try {
      const contract = await getLatestContractDraftApi();
      dispatch(setContractDraft(contract));
    } catch (err) {
      dispatch(setContractError(err.message));
    } finally {
      dispatch(setContractLoading(false));
    }
  }, [dispatch]);

  const loadById = useCallback(async (id) => {
    dispatch(setContractLoading(true));
    try {
      const contract = await getContractByIdApi(id);
      dispatch(setContractDraft(contract));
    } catch (err) {
      dispatch(setContractError(err.message));
    } finally {
      dispatch(setContractLoading(false));
    }
  }, [dispatch]);

  const loadFinalized = useCallback(async (opts) => {
    dispatch(setContractLoading(true));
    try {
      const contracts = await listFinalizedContractsApi(opts);
      dispatch(setContractList(contracts));
    } catch (err) {
      dispatch(setContractError(err.message));
    } finally {
      dispatch(setContractLoading(false));
    }
  }, [dispatch]);

  const saveDraft = useCallback(async (formData) => {
    dispatch(setContractSaving(true));
    dispatch(setContractError(null));
    try {
      const contract = await saveContractDraftApi(formData);
      dispatch(setContractDraft(contract));
      return contract;
    } catch (err) {
      dispatch(setContractError(err.message));
      return null;
    } finally {
      dispatch(setContractSaving(false));
    }
  }, [dispatch]);

  const saveAndNavigateToReview = useCallback(async (id, formData) => {
    dispatch(setContractSaving(true));
    dispatch(setContractError(null));
    try {
      const contract = await saveContractDraftApi(formData);
      dispatch(setContractDraft(contract));
      if (contract?._id) {
        navigate(`/trade/international/contract-drafting/review?id=${contract._id}`);
      }
    } catch (err) {
      dispatch(setContractError(err.message));
    } finally {
      dispatch(setContractSaving(false));
    }
  }, [dispatch, navigate]);

  const finalizeContract = useCallback(async (id, formData) => {
    dispatch(setContractGenerating(true));
    dispatch(setContractError(null));
    try {
      const contract = await finalizeContractApi(id, formData);
      dispatch(setContractDraft(contract));
      return contract;
    } catch (err) {
      dispatch(setContractError(err.message));
      return null;
    } finally {
      dispatch(setContractGenerating(false));
    }
  }, [dispatch]);

  const uploadContract = useCallback(async (formData) => {
    dispatch(setContractUploading(true));
    dispatch(setContractError(null));
    try {
      const contract = await uploadContractApi(formData);
      dispatch(setContractDraft(contract));
      return contract;
    } catch (err) {
      dispatch(setContractError(err.message));
      return null;
    } finally {
      dispatch(setContractUploading(false));
    }
  }, [dispatch]);

  const uploadSignedContract = useCallback(async (id, formData) => {
    dispatch(setContractUploading(true));
    dispatch(setContractError(null));
    try {
      const contract = await uploadSignedContractApi(id, formData);
      dispatch(setContractDraft(contract));
      return contract;
    } catch (err) {
      dispatch(setContractError(err.message));
      return null;
    } finally {
      dispatch(setContractUploading(false));
    }
  }, [dispatch]);

  const updateShipmentStatus = useCallback(async (id, status) => {
    try {
      return await updateShipmentStatusApi(id, status);
    } catch (err) {
      dispatch(setContractError(err.message));
      return null;
    }
  }, [dispatch]);

  const deleteDraft = useCallback(async () => {
    dispatch(setContractLoading(true));
    try {
      await deleteContractDraftApi();
      dispatch(setContractDraft(null));
    } catch (err) {
      dispatch(setContractError(err.message));
    } finally {
      dispatch(setContractLoading(false));
    }
  }, [dispatch]);

  const clearDraft = useCallback(() => {
    dispatch(setContractDraft(null));
  }, [dispatch]);

  return {
    ...state,
    loadDraft,
    loadById,
    loadFinalized,
    saveDraft,
    saveAndNavigateToReview,
    finalizeContract,
    uploadContract,
    uploadSignedContract,
    updateShipmentStatus,
    deleteDraft,
    clearDraft,
  };
}
