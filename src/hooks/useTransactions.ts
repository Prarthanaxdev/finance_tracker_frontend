import { useState, useCallback } from 'react';
import { getTransactions, TransactionApiItem, GetTransactionsResult } from '../api/getTransactions';
import { saveTransaction, removeTransaction } from '../utils/transactionHelpers';
import { getAuthToken } from '../utils/common';

export type TransactionType = 'income' | 'expense';

export interface TransactionFormData {
  amount: string;
  description: string;
  categoryId: string;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionApiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentType, setCurrentType] = useState<TransactionType | undefined>(undefined);

  const token = getAuthToken() || undefined;

  const loadTransactions = useCallback(
    async (limit: number = 50, offset: number = 0, type?: TransactionType) => {
      setLoading(true);
      setError(null);
      try {
        const t = type ?? currentType;
        if (t) setCurrentType(t);
        if (!token) {
          throw new Error('Not authenticated');
        }
        const res = await getTransactions(token, limit, offset, t);
        const list: TransactionApiItem[] = Array.isArray(res)
          ? res
          : (res as GetTransactionsResult).data?.transactions || [];
        setTransactions(list || []);
        return list;
      } catch (e: any) {
        const msg = e?.message || 'Failed to load transactions';
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [token, currentType]
  );

  const save = useCallback(
    async (formData: TransactionFormData, type: TransactionType, editingId?: string | null) => {
      setLoading(true);
      setError(null);
      try {
        if (!token) {
          throw new Error('Not authenticated');
        }
        const message = await saveTransaction({
          token,
          formData,
          type,
          editingId: editingId || null,
        });
        // Refresh list after save
        await loadTransactions(50, 0, type);
        return message;
      } catch (e: any) {
        const msg = e?.message || 'Failed to save transaction';
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [token, loadTransactions]
  );

  const remove = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        if (!token) {
          throw new Error('Not authenticated');
        }
        await removeTransaction(token, id);
        // Refresh list after delete (keep currentType)
        await loadTransactions(50, 0, currentType);
      } catch (e: any) {
        const msg = e?.message || 'Failed to delete transaction';
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [token, loadTransactions, currentType]
  );

  return {
    transactions,
    loading,
    error,
    currentType,
    setCurrentType,
    loadTransactions,
    saveTransaction: save,
    deleteTransaction: remove,
  };
}
