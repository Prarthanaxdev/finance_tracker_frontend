import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCategory } from '../../api/getCategory';
import { useTransactions } from '../../hooks/useTransactions';
import { getAuthToken } from '../../utils/common';
import {
  Button,
  Modal,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { useDispatch } from 'react-redux';
import { incrementVersion } from '../../reducers/refreshSlice';
interface TransactionRow {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  description: string;
}

interface TransactionTableProps {
  type: 'income' | 'expense';
}

const mapTransactions = (dataArray: any[]): TransactionRow[] => {
  return dataArray.map((t: any) => ({
    id: t._id || t.id,
    categoryId: t.categoryId?._id || t.categoryId?.id || '',
    categoryName: t.categoryId?.name || '-',
    amount: t.amount ?? 0,
    description: t.description ?? '-',
  }));
};

const TransactionTable = ({ type }: TransactionTableProps) => {
  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const {
    transactions,
    loading,
    error,
    loadTransactions,
    saveTransaction: save,
    deleteTransaction: del,
  } = useTransactions();
  const [rowCount, setRowCount] = useState(0);
  const [tableError, setTableError] = useState<string | null>(null);
  const [transactionModal, setTransactionModal] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    categoryId: '',
  });
  const [formErrors, setFormErrors] = useState({
    amount: false,
    description: false,
    categoryId: false,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const dispatch = useDispatch();
  // Load transactions when pagination or type changes
  const refreshTransactions = async () => {
    await loadTransactions(
      paginationModel.pageSize,
      paginationModel.page * paginationModel.pageSize,
      type,
    );
  };

  useEffect(() => {
    refreshTransactions();
  }, [paginationModel, type]);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = getAuthToken();
      if (!token) return;
      try {
        const result = await getCategory(token, 100, 0);
        const dataArray = Array.isArray(result)
          ? result
          : Array.isArray((result as any)?.data?.categories)
            ? (result as any).data.categories
            : Array.isArray((result as any)?.data)
              ? (result as any).data
              : [];
        setCategories(
          dataArray.map((c: any) => ({
            id: c._id || c.id,
            name: c.name ?? '',
          })),
        );
      } catch (err: any) {
        setTableError(err?.message || 'Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const transactionData = Array.isArray(transactions)
      ? { transactions, total: transactions.length }
      : transactions;

    const mapped = mapTransactions(transactionData.transactions || []);
    setRows(mapped);
    setRowCount(transactionData.total || 0);
  }, [transactions]);

  const validateForm = () => {
    const errors = {
      amount: !formData.amount || formData.amount === '',
      description: !formData.description.trim(),
      categoryId: !formData.categoryId,
    };
    setFormErrors(errors);
    return !Object.values(errors).some((err) => err);
  };

  const handleSaveTransaction = async () => {
    if (!validateForm()) return;
    try {
      setModalError(null);
      const message = await save(formData, type, editingId);
      setSuccessMessage(message);
      setSuccessOpen(true);
      handleCloseModal();
      await refreshTransactions();
      dispatch(incrementVersion());
    } catch (err: any) {
      setModalError(err?.message || 'Failed to save transaction');
    }
  };

  const handleCloseModal = () => {
    setTransactionModal(false);
    setFormData({ amount: '', description: '', categoryId: '' });
    setFormErrors({ amount: false, description: false, categoryId: false });
    setModalError(null);
    setEditingId(null);
  };

  const handleEditTransaction = (id: string, row: TransactionRow) => {
    setEditingId(id);
    setFormData({
      amount: row.amount.toString(),
      description: row.description,
      categoryId: row.categoryId,
    });
    setTransactionModal(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await del(id);
      setSuccessMessage('Transaction deleted successfully');
      setSuccessOpen(true);
      await refreshTransactions();
      dispatch(incrementVersion());
    } catch (err: any) {
      setTableError(err?.message || 'Failed to delete transaction');
    }
  };

  const columns: GridColDef[] = [
    { field: 'categoryName', headerName: 'Category', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 120 },
    { field: 'description', headerName: 'Description', width: 240 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const id = params.row.id;
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              aria-label="edit transaction"
              onClick={() => handleEditTransaction(id, params.row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              aria-label="delete transaction"
              onClick={() => handleDeleteTransaction(id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <div className="tab-content">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => setTransactionModal(true)}>
          Add Transaction
        </Button>
      </Box>
      {(error || tableError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {tableError || error}
        </Alert>
      )}

      <Paper sx={{ height: 420, width: '100%', position: 'relative' }}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row: any) => row.id}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowCount={rowCount}
            pageSizeOptions={[5, 10, 20]}
            sx={{ border: 0 }}
          />
        )}
      </Paper>
      <Modal open={transactionModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
            {editingId ? 'Edit Transaction' : 'Add New Transaction'}
          </Typography>
          {modalError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {modalError}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Amount"
            type="number"
            sx={{ mb: 2 }}
            required
            error={formErrors.amount}
            helperText={formErrors.amount ? 'Amount is required' : ''}
            value={formData.amount}
            onChange={(e: any) => setFormData({ ...formData, amount: e.target.value })}
          />
          <TextField
            fullWidth
            label="Description"
            sx={{ mb: 2 }}
            required
            error={formErrors.description}
            helperText={formErrors.description ? 'Description is required' : ''}
            value={formData.description}
            onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
          />
          <FormControl fullWidth sx={{ mb: 2 }} error={formErrors.categoryId}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={formData.categoryId}
              onChange={(e: any) => setFormData({ ...formData, categoryId: e.target.value })}
            >
              <MenuItem value="">Select Category</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name || 'Unnamed Category'}
                </MenuItem>
              ))}
            </Select>
            {formErrors.categoryId && (
              <Typography
                sx={{
                  color: '#d32f2f',
                  fontSize: '0.75rem',
                  mt: 0.5,
                }}
              >
                Category is required
              </Typography>
            )}
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSaveTransaction}>
              {editingId ? 'Update' : 'Add'}
            </Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={successOpen}
        autoHideDuration={6000}
        onClose={() => setSuccessOpen(false)}
        message={successMessage}
      />
    </div>
  );
};

export default TransactionTable;
