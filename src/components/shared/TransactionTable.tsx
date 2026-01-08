import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { getTransactions } from '../../api/getTransactions';
import { getAuthToken } from '../../utils/common';

interface TransactionRow {
  id: string;
  categoryId: string;
  amount: number;
  description: string;
}

interface TransactionTableProps {
  type: 'income' | 'expense';
}

const columns: GridColDef[] = [
  { field: 'categoryId', headerName: 'Category', width: 200 },
  { field: 'amount', headerName: 'Amount', width: 120 },
  { field: 'description', headerName: 'Description', width: 240 },
];

const TransactionTable = ({ type }: TransactionTableProps) => {
  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rowCount, setRowCount] = useState(0);

  const token = getAuthToken();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!token) {
        setError('Missing auth token');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await getTransactions(
          token,
          paginationModel.pageSize,
          paginationModel.page * paginationModel.pageSize,
          type
        );

        const dataArray = Array.isArray(result)
          ? result
          : Array.isArray((result as any)?.data?.transactions)
          ? (result as any).data.transactions
          : Array.isArray((result as any)?.data)
          ? (result as any).data
          : [];

        const mapped: TransactionRow[] = dataArray.map((t: any) => ({
          id: t._id || t.id,
          categoryId: t.categoryId?.name || '-',
          amount: t.amount ?? 0,
          description: t.description ?? '-',
        }));

        setRows(mapped);
        setRowCount((result as any)?.data?.total ?? dataArray.length);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err?.message || `Failed to fetch ${type} transactions`);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [paginationModel, token, type]);

  return (
    <div className="tab-content">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
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
            getRowId={(row) => row.id}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowCount={rowCount}
            pageSizeOptions={[5, 10, 20]}
            sx={{ border: 0 }}
          />
        )}
      </Paper>
    </div>
  );
};

export default TransactionTable;
