
import React from 'react';
import { ChartLine, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import ResultCard from '@/components/ResultCard';
import PatrimonyChart from '@/components/PatrimonyChart';
import { formatCurrency } from '@/utils/formatCurrency';

interface PatrimonyResultsProps {
  results: {
    years: number;
    months: number;
    adjustedPatrimony: number;
    chartData: Array<{ month: number; patrimony: number; adjustedTarget: number }>;
  } | null;
}

const PatrimonyResults: React.FC<PatrimonyResultsProps> = ({ results }) => {
  return (
    <motion.div 
      className="lg:col-span-1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
        <h3 className="text-xl font-semibold text-duop-dark mb-6 flex items-center gap-2">
          <ChartLine size={20} className="text-duop" />
          Resultados
        </h3>
        
        {results ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ResultCard 
              label="Anos até atingir esse patrimônio"
              value={results.years === 999 ? "Nunca" : `${results.years} anos ${results.months} meses`}
            />
            
            <ResultCard 
              label="Patrimônio Corrigido pela Inflação"
              value={formatCurrency(results.adjustedPatrimony)}
            />
            
            {/* Chart Section */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Evolução do Patrimônio</h4>
              <PatrimonyChart data={results.chartData} />
            </div>
          </motion.div>
        ) : (
          <div className="h-[calc(100%-2rem)] flex flex-col items-center justify-center text-gray-400">
            <Calculator size={32} className="mb-4 text-duop/30" />
            <p className="text-sm text-center">
              Preencha os campos e clique em calcular para ver os resultados
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PatrimonyResults;
