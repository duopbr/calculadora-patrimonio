
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { formatCurrency } from '@/utils/formatCurrency';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { motion } from 'framer-motion';

interface PatrimonyChartProps {
  data: Array<{ month: number; patrimony: number; adjustedTarget: number }>;
}

const PatrimonyChart: React.FC<PatrimonyChartProps> = ({ data }) => {
  // Format the month values for display on x-axis
  const formattedData = data.map(item => ({
    month: formatMonthsToYearsMonths(item.month),
    patrimony: item.patrimony,
    adjustedTarget: item.adjustedTarget,
    monthValue: item.month // Keep the original month value for sorting
  })).sort((a, b) => a.monthValue - b.monthValue);

  // For better chart visualization, limit the number of data points
  const filteredData = filterDataPoints(formattedData, 12);

  return (
    <motion.div
      className="w-full h-[300px] mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <ChartContainer 
        config={{
          patrimony: {
            theme: { light: '#00B2E3', dark: '#00B2E3' },
            label: 'Patrimônio'
          },
          adjustedTarget: {
            theme: { light: '#8E9196', dark: '#8E9196' },
            label: 'Meta Corrigida'
          }
        }}
      >
        <LineChart data={filteredData} margin={{ top: 5, right: 5, left: 5, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 10 }} 
            angle={-45} 
            textAnchor="end"
            tickMargin={15}
          />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value).split(',')[0]} 
            tick={{ fontSize: 10 }}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border rounded shadow">
                    <p className="text-xs font-medium">{payload[0]?.payload.month}</p>
                    <p className="text-xs text-duop">
                      <strong>Patrimônio:</strong> {formatCurrency(payload[0]?.value as number)}
                    </p>
                    <p className="text-xs text-gray-500">
                      <strong>Meta Corrigida:</strong> {formatCurrency(payload[1]?.value as number)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend verticalAlign="top" height={36} />
          <Line 
            type="monotone" 
            dataKey="patrimony" 
            stroke="#00B2E3" 
            strokeWidth={2} 
            name="Patrimônio" 
            dot={{ r: 1 }}
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="adjustedTarget" 
            stroke="#8E9196" 
            strokeWidth={2} 
            name="Meta Corrigida"
            dot={{ r: 1 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>
    </motion.div>
  );
};

// Helper to format month number to years and months
const formatMonthsToYearsMonths = (months: number): string => {
  if (months === 0) return '0m';
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) return `${remainingMonths}m`;
  if (remainingMonths === 0) return `${years}a`;
  return `${years}a ${remainingMonths}m`;
};

// Function to filter data points for better visualization
const filterDataPoints = (
  data: Array<any>,
  maxPoints: number
): Array<any> => {
  if (data.length <= maxPoints) return data;
  
  const step = Math.ceil(data.length / maxPoints);
  
  return data.filter((_, index) => {
    // Always include first and last point
    if (index === 0 || index === data.length - 1) return true;
    return index % step === 0;
  });
};

export default PatrimonyChart;
