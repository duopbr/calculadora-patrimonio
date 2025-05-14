import React, { useState, useEffect } from 'react';
import { ChartLine, Trash2, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import CurrencyInput from '@/components/CurrencyInput';
import ResultCard from '@/components/ResultCard';
import PatrimonyChart from '@/components/PatrimonyChart';
import { calculateTimeToPatrimony } from '@/utils/calculatePatrimony';
import { formatCurrency, parseCurrency } from '@/utils/formatCurrency';

const Index = () => {
  // State for input values
  const [initialValue, setInitialValue] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [desiredPatrimony, setDesiredPatrimony] = useState('');
  const [monthlyReturn, setMonthlyReturn] = useState('');
  const [inflationRate, setInflationRate] = useState('');
  const [annualContributionIncrease, setAnnualContributionIncrease] = useState('');
  
  // State for calculation results
  const [results, setResults] = useState<{
    years: number;
    months: number;
    adjustedPatrimony: number;
    chartData: Array<{ month: number; patrimony: number; adjustedTarget: number }>;
  } | null>(null);
  
  // State for animations
  const [isCalculating, setIsCalculating] = useState(false);
  
  const clearForm = () => {
    setInitialValue('');
    setMonthlyContribution('');
    setDesiredPatrimony('');
    setMonthlyReturn('');
    setInflationRate('');
    setAnnualContributionIncrease('');
    setResults(null);
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
        
        setResults(result);
        toast.success('Cálculo realizado com sucesso');
      } catch (error) {
        console.error(error);
        toast.error('Erro ao calcular. Verifique os valores inseridos.');
      } finally {
        setIsCalculating(false);
      }
    }, 500);
  };
  
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

  return (
    <div className="min-h-screen bg-duop-background px-4 sm:px-6 py-8">
      <motion.div 
        className="max-w-[1600px] mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with Logo at top-left corner */}
        <div className="mb-8">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/2cf9cfe8-9aee-4757-950f-7ef15e233b12.png" 
              alt="Duop Logo" 
              className="h-12 w-auto mr-3"
            />
            <div>
              <h1 className="text-3xl font-bold text-duop-dark">Calculadora de</h1>
              <h2 className="text-2xl font-medium text-duop">Patrimônio</h2>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-8">
          {/* Inputs and Results in horizontal layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Section */}
            <motion.div 
              className="flex-1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
                <h3 className="text-xl font-semibold text-duop-dark mb-6">Dados para Cálculo</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            
            {/* Results Summary Section */}
            <motion.div 
              className="flex-1"
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
                    className="h-full"
                  >
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      <ResultCard 
                        label="Anos até atingir esse patrimônio"
                        value={results.years === 999 ? "Nunca" : `${results.years} anos ${results.months} meses`}
                      />
                      
                      <ResultCard 
                        label="Patrimônio Corrigido pela Inflação"
                        value={formatCurrency(results.adjustedPatrimony)}
                      />
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
          </div>

          {/* Chart Section in full width */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden pb-10">
                <h3 className="text-xl font-semibold text-duop-dark mb-4 flex items-center gap-2">
                  <ChartLine size={20} className="text-duop" />
                  Evolução do Patrimônio
                </h3>
                <div className="relative w-full h-[350px] md:h-[400px]">
                  <PatrimonyChart data={results.chartData} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
