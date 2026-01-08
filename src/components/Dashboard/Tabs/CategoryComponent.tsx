import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { getCategory } from '../../../api/getCategory';
import {
  Button,
  Modal,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { addCategory } from '../../../api/addCategory';
import { getAuthToken } from '../../../utils/common';

interface CategoryRow {
  id: string;
  name: string;
  type: 'income' | 'expense';
  description: string;
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'type', headerName: 'Type', width: 130 },
  { field: 'description', headerName: 'Description', width: 300 },
];

const CategoryComponent = () => {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rowCount, setRowCount] = useState<number>(0);
  const [categoryModal, setCategoryModal] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense',
    description: ''
  });

  const token = getAuthToken();

  const handleModalClose = () => {
    setCategoryModal(false);
    setFormData({ name: '', type: 'expense', description: '' });
    setModalError(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setModalError('Category name is required');
      return;
    }
    try {
      setModalError(null);
      if (!token) {
        setModalError('Missing auth token');
        return;
      }
      await addCategory(token as string, {
        name: formData.name.trim(),
        type: formData.type,
        description: formData.description.trim(),
      });

      // Refresh the categories list after successful add
      setLoading(true);
      const result = await getCategory(
        token as string,
        paginationModel.pageSize,
        paginationModel.page * paginationModel.pageSize,
      );
      const dataArray = Array.isArray(result)
        ? result
        : Array.isArray((result as any)?.data?.categories)
        ? (result as any).data.categories
        : Array.isArray((result as any)?.data)
        ? (result as any).data
        : [];

      const mapped: CategoryRow[] = dataArray.map((c: any) => ({
        id: c._id || c.id,
        name: c.name ?? '',
        type: c.type ?? 'expense',
        description: c.description ?? '-',
      }));

      setRows(mapped);
      setRowCount((result as any)?.data?.total || dataArray.length);
      handleModalClose();
      setSuccessMessage('Category added successfully');
      setSuccessOpen(true);
    } catch (err: any) {
      setModalError(err?.message || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      if (!token) {
        setError('Missing auth token');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const result = await getCategory(token, paginationModel.pageSize, paginationModel.page * paginationModel.pageSize);
        const dataArray = Array.isArray(result)
          ? result
          : Array.isArray((result as any)?.data?.categories)
          ? (result as any).data.categories
          : Array.isArray((result as any)?.data)
          ? (result as any).data
          : [];

        const mapped: CategoryRow[] = dataArray.map((c: any) => ({
          id: c._id || c.id || `${c.name || 'row'}-${Math.random().toString(36).slice(2)}`,
          name: c.name ?? '',
          type: c.type ?? 'expense',
          description: c.description ?? '',
        }));

        setRows(mapped);
        setRowCount((result as any)?.data?.total || dataArray.length);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err?.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token, paginationModel.page, paginationModel.pageSize]);

  return (
    <div className="tab-content">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => setCategoryModal(true)}>Add Category</Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Paper sx={{ height: 400, width: '100%', position: 'relative' }}>
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            rowCount={rowCount}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 15, 20]}
            sx={{ border: 0 }}
          />
        )}
      </Paper>
      <Modal
        open={categoryModal}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
            Add New Category
          </Typography>
          {modalError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {modalError}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
            required
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type}
              label="Type"
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            multiline
            rows={3}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Add Category
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default CategoryComponent;
