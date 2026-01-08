import { useState } from 'react';
import HeaderComponent from './Header';
import './Dashboard.css';
import TabComponent from './Tabs/TabComponent';

const DashboardComponent = () => {
  return (
    <>
      <HeaderComponent />
      <TabComponent />
    </>
  );
};

export default DashboardComponent;
