import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setPoDraft,
  setPoLoading,
  setPoSaving,
  setPoGenerating,
  setPoError,
  clearPoDraft,
  selectPoDraft,
  selectPoLoading,
  selectPoSaving,
  selectPoGenerating,
  selectPoPdfUrl,
  selectPoError,
} from '../store/purchaseOrderSlice';
import { selectOrganizationLoaded } from '../../organization/store/organizationSlice';
import {
  saveDraftApi,
  getLatestDraftApi,
  getPurchaseOrderByIdApi,
  generatePdfApi,
  deleteDraftApi,
} from '../services/purchaseOrderApi';

export function usePurchaseOrder({ autoLoad = false } = {}) {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const draft      = useSelector(selectPoDraft);
  const loading    = useSelector(selectPoLoading);
  const saving     = useSelector(selectPoSaving);
  const generating = useSelector(selectPoGenerating);
  const pdfUrl     = useSelector(selectPoPdfUrl);
  const error      = useSelector(selectPoError);
  const orgLoaded  = useSelector(selectOrganizationLoaded);

  useEffect(() => {
    if (!orgLoaded || !autoLoad) return;

    async function loadDraft() {
      dispatch(setPoLoading(true));
      dispatch(setPoError(null));
      try {
        const po = await getLatestDraftApi();
        dispatch(setPoDraft(po));
      } catch (err) {
        dispatch(setPoError(err.message));
      } finally {
        dispatch(setPoLoading(false));
      }
    }
    loadDraft();

    return () => { dispatch(clearPoDraft()); };
  }, [dispatch, orgLoaded, autoLoad]);

  const saveDraft = useCallback(async (formData) => {
    dispatch(setPoSaving(true));
    dispatch(setPoError(null));
    try {
      const po = await saveDraftApi(formData);
      dispatch(setPoDraft(po));
      return po;
    } catch (err) {
      dispatch(setPoError(err.message));
      throw err;
    } finally {
      dispatch(setPoSaving(false));
    }
  }, [dispatch]);

  const saveAndNavigateToReview = useCallback(async (formData) => {
    dispatch(setPoSaving(true));
    dispatch(setPoError(null));
    try {
      const po = await saveDraftApi(formData);
      dispatch(setPoDraft(po));
      navigate(`/trade/domestic/purchase-order/review?id=${po._id}`);
    } catch (err) {
      dispatch(setPoError(err.message));
      throw err;
    } finally {
      dispatch(setPoSaving(false));
    }
  }, [dispatch, navigate]);

  const loadById = useCallback(async (id) => {
    dispatch(setPoLoading(true));
    dispatch(setPoError(null));
    try {
      const po = await getPurchaseOrderByIdApi(id);
      dispatch(setPoDraft(po));
      return po;
    } catch (err) {
      dispatch(setPoError(err.message));
      throw err;
    } finally {
      dispatch(setPoLoading(false));
    }
  }, [dispatch]);

  const generatePdf = useCallback(async (id) => {
    dispatch(setPoGenerating(true));
    dispatch(setPoError(null));
    try {
      const po = await generatePdfApi(id);
      dispatch(setPoDraft(po));
      return po;
    } catch (err) {
      dispatch(setPoError(err.message));
      throw err;
    } finally {
      dispatch(setPoGenerating(false));
    }
  }, [dispatch]);

  const deleteDraft = useCallback(async () => {
    dispatch(setPoError(null));
    try {
      await deleteDraftApi();
      dispatch(clearPoDraft());
    } catch (err) {
      dispatch(setPoError(err.message));
      throw err;
    }
  }, [dispatch]);

  const clearDraft = useCallback(() => {
    dispatch(clearPoDraft());
  }, [dispatch]);

  return { draft, loading, saving, generating, pdfUrl, error, saveDraft, saveAndNavigateToReview, loadById, generatePdf, deleteDraft, clearDraft };
}
