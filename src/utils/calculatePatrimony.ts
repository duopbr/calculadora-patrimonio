/**
 * Calculates the time to reach a desired patrimony
 * 
 * @param initialValue - Initial investment amount
 * @param monthlyContribution - Monthly contribution amount
 * @param desiredPatrimony - Target patrimony amount
 * @param monthlyReturn - Monthly return percentage (e.g., 1 for 1%)
 * @param inflationRate - Annual inflation rate percentage (e.g., 6 for 6%)
 * @param annualContributionIncrease - Annual increase in monthly contribution percentage (e.g., 2 for 2%)
 * @returns Object with years, months, and inflation-adjusted target
 */
export const calculateTimeToPatrimony = (
  initialValue: number,
  monthlyContribution: number,
  desiredPatrimony: number,
  monthlyReturn: number,
  inflationRate: number,
  annualContributionIncrease: number
): { 
  years: number; 
  months: number; 
  adjustedPatrimony: number;
  chartData: Array<{ month: number; patrimony: number; adjustedTarget: number }>;
} => {
  // Convert percentages to decimal
  const monthlyReturnDecimal = monthlyReturn / 100;
  // Use compound interest formula for monthly inflation
  const monthlyInflationDecimal = inflationRate > 0 ? Math.pow(1 + inflationRate / 100, 1/12) - 1 : 0;
  const annualContributionIncreaseDecimal = annualContributionIncrease / 100;
  
  let currentPatrimony = initialValue;
  let currentMonthlyContribution = monthlyContribution;
  let totalMonths = 0;
  
  // Calculate inflation-adjusted target patrimony
  const adjustedPatrimony = calculateInflationAdjustedValue(
    desiredPatrimony,
    inflationRate,
    30 // Default to 30 years for the inflation adjustment estimate
  );
  
  // Data for the chart
  const chartData: Array<{ month: number; patrimony: number; adjustedTarget: number }> = [];
  
  // If impossible scenario (negative or zero returns with insufficient initial value)
  if (
    monthlyReturnDecimal <= 0 && 
    initialValue < desiredPatrimony && 
    monthlyContribution <= 0
  ) {
    return { years: 0, months: 0, adjustedPatrimony, chartData: [] };
  }
  
  const MAX_MONTHS = 12 * 100; // Keep max limit as safeguard
  const SIMULATION_MONTHS = 35 * 12; // Simulate for 35 years
  
  // Store the adjustedTarget for each month
  let adjustedTarget = desiredPatrimony;
  
  // Simulate month by month for the fixed duration
  while (totalMonths < SIMULATION_MONTHS) {
    // Add data point for this month
    chartData.push({
      month: totalMonths,
      patrimony: currentPatrimony,
      adjustedTarget: adjustedTarget
    });
    
    // Apply monthly return
    currentPatrimony = currentPatrimony * (1 + monthlyReturnDecimal);
    
    // Add monthly contribution
    currentPatrimony += currentMonthlyContribution;
    
    totalMonths++;
    
    // Adjust monthly contribution annually
    if (totalMonths % 12 === 0) {
      currentMonthlyContribution *= (1 + annualContributionIncreaseDecimal);
    }
    
    // Adjust target for inflation (monthly)
    adjustedTarget *= (1 + monthlyInflationDecimal);
  }
  
  // Add final data point at the end of the simulation
  chartData.push({
    month: totalMonths,
    patrimony: currentPatrimony,
    adjustedTarget: adjustedTarget
  });
  
  // Return the total simulation duration
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  return { years, months, adjustedPatrimony, chartData };
};

/**
 * Calculates the inflation-adjusted value after a given number of years
 */
export const calculateInflationAdjustedValue = (
  currentValue: number,
  annualInflationRate: number,
  years: number
): number => {
  const inflationFactor = Math.pow(1 + annualInflationRate / 100, years);
  return currentValue * inflationFactor;
};
