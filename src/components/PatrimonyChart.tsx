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
import { ChartContainer } from '@/components/ui/chart';
import { motion } from 'framer-motion';

interface PatrimonyChartProps {
  data: Array<{ month: number; patrimony: number; adjustedTarget: number }>;
}

// Helper to format large currency values into millions (e.g., 1.5M)
const formatMillions = (value: number): string => {
  if (Math.abs(value) < 1e6) return (value / 1e6).toFixed(1) + 'M';
  return (value / 1e6).toFixed(1).replace('\.0', '') + 'M';
};

// Helper to format currency without cents and with R$
const formatSimpleCurrency = (value: number): string => {
  return `R$ ${formatCurrency(value).split(',')[0]}`;
};

// Creates the appropriate Y-axis tick formatter based on the max value
const createYAxisFormatter = (maxValue: number): ((value: number) => string) => {
  const MILLION = 1_000_000;
  if (maxValue >= MILLION) {
    return formatMillions;
  } else {
    return formatSimpleCurrency;
  }
};

// --- NEW LOGIC FOR YEARLY DATA AND DYNAMIC X-AXIS --- 

const PatrimonyChart: React.FC<PatrimonyChartProps> = ({ data }) => {

  // 1. Find month when target is reached
  const targetReachedMonth = data.find(
    (item) => item.patrimony >= item.adjustedTarget
  )?.month ?? (35 * 12); // Default to 35 years if not reached

  // 2. Calculate max year for X-axis
  const targetReachedYear = Math.ceil(targetReachedMonth / 12);
  const maxXAxisYear = Math.min(targetReachedYear + 5, 35);
  const maxXAxisMonth = maxXAxisYear * 12;

  // 3. Filter data for yearly points up to maxXAxisMonth
  const yearlyData = data.filter(
    (item) => item.month === 0 || (item.month % 12 === 0 && item.month <= maxXAxisMonth)
  );

  // 4. Prepare data for the chart (add 'year' property)
  const chartData = yearlyData.map(item => ({
    ...item,
    year: item.month / 12,
  }));

  // Calculate Max Y value based *only* on the filtered yearly data
  const yearlyMaxValue = chartData.reduce((max, item) => {
    const patrimonyVal = typeof item.patrimony === 'number' ? item.patrimony : 0;
    const adjustedTargetVal = typeof item.adjustedTarget === 'number' ? item.adjustedTarget : 0;
    return Math.max(max, patrimonyVal, adjustedTargetVal);
  }, 0);
  const yAxisMax = Math.ceil(yearlyMaxValue * 1.1); // Add 10% padding

  // Get the appropriate Y-axis formatter
  const yTickFormatter = createYAxisFormatter(yAxisMax);
  
  // Generate ticks for X-axis (0, 1, 2, ..., maxXAxisYear)
  const xAxisTicks = Array.from({ length: maxXAxisYear + 1 }, (_, i) => i);

  // --- END OF NEW LOGIC --- 

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ChartContainer 
        config={{
          patrimony: {
            theme: { light: '#00B2E3', dark: '#00B2E3' },
            label: 'Patrimônio (Anual)'
          },
          adjustedTarget: {
            theme: { light: '#8E9196', dark: '#8E9196' },
            label: 'Meta Corrigida (Anual)'
          }
        }}
        className="h-full w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData} // Use the filtered yearly data
            margin={{ top: 5, right: 15, left: 5, bottom: 5 }} // Reduced bottom margin 
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="year" // Use the 'year' property
              type="number" 
              domain={[0, maxXAxisYear]} // Dynamic domain based on years
              ticks={xAxisTicks} // Explicitly set year ticks
              tick={{ fontSize: 11 }} 
              axisLine={false}
              tickLine={false}
              height={25} // Reduced height as labels are simple numbers
            />
            <YAxis 
              tickFormatter={yTickFormatter} 
              tick={{ fontSize: 11 }}
              width={55}
              domain={[0, yAxisMax]}
              allowDataOverflow={false}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pointData = payload[0].payload;
                  return (
                    <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
                      {/* Display Year in tooltip */}
                      <p className="font-medium mb-1.5">Ano: {pointData.year}</p> 
                      <p className="text-[#00B2E3] mb-0.5">
                        <strong>Patrimônio:</strong> {formatCurrency(payload[0]?.value as number)}
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Meta Corrigida:</strong> {formatCurrency(payload[1]?.value as number)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ stroke: '#888', strokeDasharray: '3 3' }}
            />
            {/* Adjusted Legend label to reflect yearly data */}
            <Legend verticalAlign="top" height={30} iconSize={10} wrapperStyle={{ top: -5, left: 20}} />
            <Line 
              type="monotone" 
              dataKey="patrimony" 
              stroke="#00B2E3" 
              strokeWidth={2.5}
              name="Patrimônio (Anual)" // Updated name
              dot={true} // Re-enable dots for yearly data points
              activeDot={{ r: 6, strokeWidth: 1 }} // Make active dot slightly more prominent
            />
            <Line 
              type="monotone" 
              dataKey="adjustedTarget" 
              stroke="#8E9196" 
              strokeWidth={2} 
              name="Meta Corrigida (Anual)" // Updated name
              dot={true} // Re-enable dots
              activeDot={{ r: 6, strokeWidth: 1 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </motion.div>
  );
};

export default PatrimonyChart;
