import { Paper, Box, Typography } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface SummaryCardsProps {
  income: number;
  expense: number;
}

interface CardData {
  title: string;
  value: string;
  color: string;
  icon: React.ReactNode;
  subtitle?: string;
}

const SummaryCards = ({ income = 0, expense = 0 }: SummaryCardsProps) => {
  // Ensure values are numbers, fallback to 0 if undefined
  const cardsData: CardData[] = [
    {
      title: 'Total Balance',
      value: `${(income - expense).toLocaleString()}`,
      color: '#10b981',
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 28 }} />,
    },
    {
      title: 'Total Income',
      value: `${income.toLocaleString()}`,
      color: '#10b981',
      icon: <TrendingUpIcon sx={{ fontSize: 28 }} />,
    },
    {
      title: 'Total Expenses',
      value: `${expense.toLocaleString()}`,
      color: '#ef4444',
      icon: <TrendingDownIcon sx={{ fontSize: 28 }} />,
    },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
      {cardsData.map((card, index) => (
        <Box key={index} sx={{ flex: '1 1 300px' }}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                  {card.title}
                </Typography>
                <Typography variant="h4" sx={{ color: card.color, fontWeight: 'bold', mb: card.subtitle ? 1 : 0 }}>
                  {card.value}
                </Typography>
                {card.subtitle && (
                  <Typography variant="caption" sx={{ color: card.color }}>
                    {card.subtitle}
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  backgroundColor: `${card.color}1a`,
                  borderRadius: 2,
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.color,
                }}
              >
                {card.icon}
              </Box>
            </Box>
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

export default SummaryCards;
