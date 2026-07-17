import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setPlLoading,
  setPlSaving,
  setPlGenerating,
  setPlDraft,
  setPlError,
} from '../store/packingListSlice';
import {
  savePackingListDraftApi,
  getLatestPackingListDraftApi,
  getPackingListByIdApi,
  generatePackingListPdfApi,
} from '../services/packingListApi';

export function usePackingList() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { draft, loading, saving, generating, error } = useSelector(s => s.packingList);

  const loadDraft = useCallback(async () => {
    dispatch(setPlLoading(true));
    try {
      const pl = await getLatestPackingListDraftApi();
      dispatch(setPlDraft(pl));
    } catch (err) {
      dispatch(setPlError(err.message));
    } finally {
      dispatch(setPlLoading(false));
    }
  }, [dispatch]);

  const loadById = useCallback(async (id) => {
    dispatch(setPlLoading(true));
    try {
      const pl = await getPackingListByIdApi(id);
      dispatch(setPlDraft(pl));
    } catch (err) {
      dispatch(setPlError(err.message));
    } finally {
      dispatch(setPlLoading(false));
    }
  }, [dispatch]);

  const saveDraft = useCallback(async (formData) => {
    dispatch(setPlSaving(true));
    dispatch(setPlError(null));
    try {
      const pl = await savePackingListDraftApi(formData);
      dispatch(setPlDraft(pl));
      return pl;
    } catch (err) {
      dispatch(setPlError(err.message));
      return null;
    } finally {
      dispatch(setPlSaving(false));
    }
  }, [dispatch]);

  const saveAndNavigateToReview = useCallback(async (formData) => {
    dispatch(setPlSaving(true));
    dispatch(setPlError(null));
    try {
      const pl = await savePackingListDraftApi(formData);
      dispatch(setPlDraft(pl));
      if (pl?._id) navigate(`/trade/international/packing-list/review?id=${pl._id}`);
    } catch (err) {
      dispatch(setPlError(err.message));
    } finally {
      dispatch(setPlSaving(false));
    }
  }, [dispatch, navigate]);

  const generatePdf = useCallback(async (id, formData) => {
    dispatch(setPlGenerating(true));
    dispatch(setPlError(null));
    try {
      const pl = await generatePackingListPdfApi(id, formData);
      dispatch(setPlDraft(pl));
      return pl;
    } catch (err) {
      dispatch(setPlError(err.message));
      return null;
    } finally {
      dispatch(setPlGenerating(false));
    }
  }, [dispatch]);

  const clearDraft = useCallback(() => {
    dispatch(setPlDraft(null));
  }, [dispatch]);

  return { draft, loading, saving, generating, error, loadDraft, loadById, saveDraft, saveAndNavigateToReview, generatePdf, clearDraft };
}
