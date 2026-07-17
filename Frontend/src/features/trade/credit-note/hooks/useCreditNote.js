import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setCnLoading,
  setCnSaving,
  setCnGenerating,
  setCnDraft,
  setCnError,
} from '../store/creditNoteSlice';
import {
  saveCreditNoteDraftApi,
  getLatestCreditNoteDraftApi,
  getCreditNoteByIdApi,
  generateCreditNotePdfApi,
} from '../services/creditNoteApi';

export function useCreditNote() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { draft, loading, saving, generating, error } = useSelector(s => s.creditNote);

  const loadDraft = useCallback(async () => {
    dispatch(setCnLoading(true));
    try {
      const cn = await getLatestCreditNoteDraftApi();
      dispatch(setCnDraft(cn));
    } catch (err) {
      dispatch(setCnError(err.message));
    } finally {
      dispatch(setCnLoading(false));
    }
  }, [dispatch]);

  const loadById = useCallback(async (id) => {
    dispatch(setCnLoading(true));
    try {
      const cn = await getCreditNoteByIdApi(id);
      dispatch(setCnDraft(cn));
    } catch (err) {
      dispatch(setCnError(err.message));
    } finally {
      dispatch(setCnLoading(false));
    }
  }, [dispatch]);

  const saveDraft = useCallback(async (formData) => {
    dispatch(setCnSaving(true));
    dispatch(setCnError(null));
    try {
      const cn = await saveCreditNoteDraftApi(formData);
      dispatch(setCnDraft(cn));
      return cn;
    } catch (err) {
      dispatch(setCnError(err.message));
      return null;
    } finally {
      dispatch(setCnSaving(false));
    }
  }, [dispatch]);

  const saveAndNavigateToReview = useCallback(async (formData) => {
    dispatch(setCnSaving(true));
    dispatch(setCnError(null));
    try {
      const cn = await saveCreditNoteDraftApi(formData);
      dispatch(setCnDraft(cn));
      if (cn?._id) navigate(`/trade/domestic/credit-note/review?id=${cn._id}`);
    } catch (err) {
      dispatch(setCnError(err.message));
    } finally {
      dispatch(setCnSaving(false));
    }
  }, [dispatch, navigate]);

  const generatePdf = useCallback(async (id, formData) => {
    dispatch(setCnGenerating(true));
    dispatch(setCnError(null));
    try {
      const cn = await generateCreditNotePdfApi(id, formData);
      dispatch(setCnDraft(cn));
      return cn;
    } catch (err) {
      dispatch(setCnError(err.message));
      return null;
    } finally {
      dispatch(setCnGenerating(false));
    }
  }, [dispatch]);

  const clearDraft = useCallback(() => {
    dispatch(setCnDraft(null));
  }, [dispatch]);

  return { draft, loading, saving, generating, error, loadDraft, loadById, saveDraft, saveAndNavigateToReview, generatePdf, clearDraft };
}
