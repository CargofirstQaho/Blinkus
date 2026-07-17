import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setDnLoading,
  setDnSaving,
  setDnGenerating,
  setDnDraft,
  setDnError,
} from '../store/debitNoteSlice';
import {
  saveDebitNoteDraftApi,
  getLatestDebitNoteDraftApi,
  getDebitNoteByIdApi,
  generateDebitNotePdfApi,
} from '../services/debitNoteApi';

export function useDebitNote() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { draft, loading, saving, generating, error } = useSelector(s => s.debitNote);

  const loadDraft = useCallback(async () => {
    dispatch(setDnLoading(true));
    try {
      const dn = await getLatestDebitNoteDraftApi();
      dispatch(setDnDraft(dn));
    } catch (err) {
      dispatch(setDnError(err.message));
    } finally {
      dispatch(setDnLoading(false));
    }
  }, [dispatch]);

  const loadById = useCallback(async (id) => {
    dispatch(setDnLoading(true));
    try {
      const dn = await getDebitNoteByIdApi(id);
      dispatch(setDnDraft(dn));
    } catch (err) {
      dispatch(setDnError(err.message));
    } finally {
      dispatch(setDnLoading(false));
    }
  }, [dispatch]);

  const saveDraft = useCallback(async (formData) => {
    dispatch(setDnSaving(true));
    dispatch(setDnError(null));
    try {
      const dn = await saveDebitNoteDraftApi(formData);
      dispatch(setDnDraft(dn));
      return dn;
    } catch (err) {
      dispatch(setDnError(err.message));
      return null;
    } finally {
      dispatch(setDnSaving(false));
    }
  }, [dispatch]);

  const saveAndNavigateToReview = useCallback(async (formData) => {
    dispatch(setDnSaving(true));
    dispatch(setDnError(null));
    try {
      const dn = await saveDebitNoteDraftApi(formData);
      dispatch(setDnDraft(dn));
      if (dn?._id) navigate(`/trade/domestic/debit-note/review?id=${dn._id}`);
    } catch (err) {
      dispatch(setDnError(err.message));
    } finally {
      dispatch(setDnSaving(false));
    }
  }, [dispatch, navigate]);

  const generatePdf = useCallback(async (id, formData) => {
    dispatch(setDnGenerating(true));
    dispatch(setDnError(null));
    try {
      const dn = await generateDebitNotePdfApi(id, formData);
      dispatch(setDnDraft(dn));
      return dn;
    } catch (err) {
      dispatch(setDnError(err.message));
      return null;
    } finally {
      dispatch(setDnGenerating(false));
    }
  }, [dispatch]);

  const clearDraft = useCallback(() => {
    dispatch(setDnDraft(null));
  }, [dispatch]);

  return { draft, loading, saving, generating, error, loadDraft, loadById, saveDraft, saveAndNavigateToReview, generatePdf, clearDraft };
}
