import { useState } from 'react';
import { TABS } from '../../../utils/common';
import ExpensesComponent from './ExpenseTab';
import CategoryComponent from './CategoryComponent';
import IncomeComponent from './IncomeTab';

interface TabConfig {
  id: (typeof TABS)[number];
  label: string;
}

const TAB_CONFIG: TabConfig[] = [
  {
    id: 'expenses',
    label: 'Expenses',
  },
  {
    id: 'income',
    label: 'Income',
  },
  {
    id: 'category',
    label: 'Category',
  },
];

const TabComponent = () => {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('expenses');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'expenses':
        return <ExpensesComponent />;
      case 'income':
        return <IncomeComponent />;
      case 'category':
        return <CategoryComponent />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="tabs-container">
        {TAB_CONFIG.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {renderTabContent()}
    </>
  );
};

export default TabComponent;
