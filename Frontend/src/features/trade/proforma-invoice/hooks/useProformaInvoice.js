import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setPiLoading,
  setPiSaving,
  setPiGenerating,
  setPiDraft,
  setPiError,
} from '../store/proformaInvoiceSlice';
import {
  saveProformaInvoiceDraftApi,
  getLatestProformaInvoiceDraftApi,
  getProformaInvoiceByIdApi,
  generateProformaInvoicePdfApi,
} from '../services/proformaInvoiceApi';

export function useProformaInvoice() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { draft, loading, saving, generating, error } = useSelector(s => s.proformaInvoice);

  const loadDraft = useCallback(async () => {
    dispatch(setPiLoading(true));
    try {
      const pi = await getLatestProformaInvoiceDraftApi();
      dispatch(setPiDraft(pi));
    } catch (err) {
      dispatch(setPiError(err.message));
    } finally {
      dispatch(setPiLoading(false));
    }
  }, [dispatch]);

  const loadById = useCallback(async (id) => {
    dispatch(setPiLoading(true));
    try {
      const pi = await getProformaInvoiceByIdApi(id);
      dispatch(setPiDraft(pi));
    } catch (err) {
      dispatch(setPiError(err.message));
    } finally {
      dispatch(setPiLoading(false));
    }
  }, [dispatch]);

  const saveDraft = useCallback(async (formData) => {
    dispatch(setPiSaving(true));
    dispatch(setPiError(null));
    try {
      const pi = await saveProformaInvoiceDraftApi(formData);
      dispatch(setPiDraft(pi));
      return pi;
    } catch (err) {
      dispatch(setPiError(err.message));
      return null;
    } finally {
      dispatch(setPiSaving(false));
    }
  }, [dispatch]);

  const saveAndNavigateToReview = useCallback(async (formData) => {
    dispatch(setPiSaving(true));
    dispatch(setPiError(null));
    try {
      const pi = await saveProformaInvoiceDraftApi(formData);
      dispatch(setPiDraft(pi));
      if (pi?._id) navigate(`/trade/international/proforma-invoice/review?id=${pi._id}`);
    } catch (err) {
      dispatch(setPiError(err.message));
    } finally {
      dispatch(setPiSaving(false));
    }
  }, [dispatch, navigate]);

  const generatePdf = useCallback(async (id, formData) => {
    dispatch(setPiGenerating(true));
    dispatch(setPiError(null));
    try {
      const pi = await generateProformaInvoicePdfApi(id, formData);
      dispatch(setPiDraft(pi));
      return pi;
    } catch (err) {
      dispatch(setPiError(err.message));
      return null;
    } finally {
      dispatch(setPiGenerating(false));
    }
  }, [dispatch]);

  const clearDraft = useCallback(() => {
    dispatch(setPiDraft(null));
  }, [dispatch]);

  return { draft, loading, saving, generating, error, loadDraft, loadById, saveDraft, saveAndNavigateToReview, generatePdf, clearDraft };
}
