
import React from 'react';
import { BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

const PageHeader: React.FC = () => {
  return (
    <motion.div 
      className="mb-8 flex items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mr-4">
        <div className="w-12 h-12 bg-duop rounded-full flex items-center justify-center text-white">
          <BarChart size={24} />
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-duop-dark">Calculadora de</h1>
        <h2 className="text-2xl font-medium text-duop">Patrimônio</h2>
      </div>
    </motion.div>
  );
};

export default PageHeader;
