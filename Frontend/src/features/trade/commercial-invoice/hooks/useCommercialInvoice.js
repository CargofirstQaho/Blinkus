import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setCiLoading,
  setCiSaving,
  setCiGenerating,
  setCiDraft,
  setCiError,
} from '../store/commercialInvoiceSlice';
import {
  saveCommercialInvoiceDraftApi,
  getLatestCommercialInvoiceDraftApi,
  getCommercialInvoiceByIdApi,
  generateCommercialInvoicePdfApi,
} from '../services/commercialInvoiceApi';

export function useCommercialInvoice() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { draft, loading, saving, generating, error } = useSelector(s => s.commercialInvoice);

  const loadDraft = useCallback(async () => {
    dispatch(setCiLoading(true));
    try {
      const ci = await getLatestCommercialInvoiceDraftApi();
      dispatch(setCiDraft(ci));
    } catch (err) {
      dispatch(setCiError(err.message));
    } finally {
      dispatch(setCiLoading(false));
    }
  }, [dispatch]);

  const loadById = useCallback(async (id) => {
    dispatch(setCiLoading(true));
    try {
      const ci = await getCommercialInvoiceByIdApi(id);
      dispatch(setCiDraft(ci));
    } catch (err) {
      dispatch(setCiError(err.message));
    } finally {
      dispatch(setCiLoading(false));
    }
  }, [dispatch]);

  const saveDraft = useCallback(async (formData) => {
    dispatch(setCiSaving(true));
    dispatch(setCiError(null));
    try {
      const ci = await saveCommercialInvoiceDraftApi(formData);
      dispatch(setCiDraft(ci));
      return ci;
    } catch (err) {
      dispatch(setCiError(err.message));
      return null;
    } finally {
      dispatch(setCiSaving(false));
    }
  }, [dispatch]);

  const saveAndNavigateToReview = useCallback(async (formData) => {
    dispatch(setCiSaving(true));
    dispatch(setCiError(null));
    try {
      const ci = await saveCommercialInvoiceDraftApi(formData);
      dispatch(setCiDraft(ci));
      if (ci?._id) navigate(`/trade/international/commercial-invoice/review?id=${ci._id}`);
    } catch (err) {
      dispatch(setCiError(err.message));
    } finally {
      dispatch(setCiSaving(false));
    }
  }, [dispatch, navigate]);

  const generatePdf = useCallback(async (id, formData) => {
    dispatch(setCiGenerating(true));
    dispatch(setCiError(null));
    try {
      const ci = await generateCommercialInvoicePdfApi(id, formData);
      dispatch(setCiDraft(ci));
      return ci;
    } catch (err) {
      dispatch(setCiError(err.message));
      return null;
    } finally {
      dispatch(setCiGenerating(false));
    }
  }, [dispatch]);

  const clearDraft = useCallback(() => {
    dispatch(setCiDraft(null));
  }, [dispatch]);

  return { draft, loading, saving, generating, error, loadDraft, loadById, saveDraft, saveAndNavigateToReview, generatePdf, clearDraft };
}
