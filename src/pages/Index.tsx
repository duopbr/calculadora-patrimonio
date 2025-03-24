
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import PatrimonyForm from '@/components/PatrimonyForm';
import PatrimonyResults from '@/components/PatrimonyResults';

const Index = () => {
  // State for calculation results
  const [results, setResults] = useState<{
    years: number;
    months: number;
    adjustedPatrimony: number;
    chartData: Array<{ month: number; patrimony: number; adjustedTarget: number }>;
  } | null>(null);

  return (
    <div className="min-h-screen bg-duop-background px-4 sm:px-6 py-12">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <PatrimonyForm onCalculateResults={setResults} />
          <PatrimonyResults results={results} />
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
