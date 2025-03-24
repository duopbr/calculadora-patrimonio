
import React from 'react';
import { motion } from 'framer-motion';

interface ResultCardProps {
  label: string;
  value: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ label, value }) => {
  return (
    <motion.div 
      className="result-card card-hover mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <span className="text-gray-600">{label}</span>
      <span className="text-duop-dark font-semibold">{value}</span>
    </motion.div>
  );
};

export default ResultCard;
