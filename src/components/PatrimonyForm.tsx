
import React, { useState } from 'react';
import { Calculator, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CurrencyInput from '@/components/CurrencyInput';
import { parseCurrency } from '@/utils/formatCurrency';
import { motion } from 'framer-motion';
import { calculateTimeToPatrimony } from '@/utils/calculatePatrimony';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

interface PatrimonyFormProps {
  onCalculateResults: (results: {
    years: number;
    months: number;
    adjustedPatrimony: number;
    chartData: Array<{ month: number; patrimony: number; adjustedTarget: number }>;
  }) => void;
}

const PatrimonyForm: React.FC<PatrimonyFormProps> = ({ onCalculateResults }) => {
  // State for input values
  const [initialValue, setInitialValue] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [desiredPatrimony, setDesiredPatrimony] = useState('');
  const [monthlyReturn, setMonthlyReturn] = useState('');
  const [inflationRate, setInflationRate] = useState('');
  const [annualContributionIncrease, setAnnualContributionIncrease] = useState('');
  
  // State for animations
  const [isCalculating, setIsCalculating] = useState(false);
  
  const clearForm = () => {
    setInitialValue('');
    setMonthlyContribution('');
    setDesiredPatrimony('');
    setMonthlyReturn('');
    setInflationRate('');
    setAnnualContributionIncrease('');
    toast.success('Formulário limpo com sucesso');
  };
  
  const validateInputs = (): boolean => {
    if (!desiredPatrimony) {
      toast.error('Por favor, insira o patrimônio desejado');
      return false;
    }
    
    if (!monthlyReturn) {
      toast.error('Por favor, insira a rentabilidade mensal esperada');
      return false;
    }
    
    return true;
  };
  
  const handleCalculate = () => {
    if (!validateInputs()) return;
    
    setIsCalculating(true);
    
    // Small delay for animation effect
    setTimeout(() => {
      try {
        const result = calculateTimeToPatrimony(
          parseCurrency(initialValue) || 0,
          parseCurrency(monthlyContribution) || 0,
          parseCurrency(desiredPatrimony),
          parseFloat(monthlyReturn) || 0,
          parseFloat(inflationRate) || 0,
          parseFloat(annualContributionIncrease) || 0
        );
        
        onCalculateResults(result);
        toast.success('Cálculo realizado com sucesso');
      } catch (error) {
        console.error(error);
        toast.error('Erro ao calcular. Verifique os valores inseridos.');
      } finally {
        setIsCalculating(false);
      }
    }, 500);
  };

  return (
    <motion.div 
      className="lg:col-span-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <CurrencyInput
              label="Aporte Inicial"
              value={initialValue}
              onChange={setInitialValue}
              placeholder="R$ 150.000,00"
              onClear={() => setInitialValue('')}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <CurrencyInput
              label="Aporte Mensal"
              value={monthlyContribution}
              onChange={setMonthlyContribution}
              placeholder="R$ 1.000,00"
              onClear={() => setMonthlyContribution('')}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <CurrencyInput
              label="Rentabilidade Mensal Esperada"
              value={monthlyReturn}
              onChange={setMonthlyReturn}
              placeholder="1"
              isPercentage={true}
              onClear={() => setMonthlyReturn('')}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <CurrencyInput
              label="Patrimônio Desejado"
              value={desiredPatrimony}
              onChange={setDesiredPatrimony}
              placeholder="R$ 1.000.000,00"
              onClear={() => setDesiredPatrimony('')}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <CurrencyInput
              label="Inflação Média Histórica"
              value={inflationRate}
              onChange={setInflationRate}
              placeholder="6"
              isPercentage={true}
              onClear={() => setInflationRate('')}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <CurrencyInput
              label="Aumento Anual de aporte %"
              value={annualContributionIncrease}
              onChange={setAnnualContributionIncrease}
              placeholder="2"
              isPercentage={true}
              onClear={() => setAnnualContributionIncrease('')}
            />
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-8 flex space-x-4"
          variants={itemVariants}
        >
          <Button
            variant="outline"
            onClick={clearForm}
            className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 border-none gap-2"
          >
            <Trash2 size={18} />
            Limpar
          </Button>
          
          <Button
            onClick={handleCalculate}
            className="flex-1 sm:flex-none bg-duop hover:bg-duop/90 gap-2"
            disabled={isCalculating}
          >
            <Calculator size={18} />
            Calcular
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PatrimonyForm;
