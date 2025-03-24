
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
  const monthlyInflationDecimal = inflationRate / 1200; // Annual to monthly and to decimal
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
  
  // Maximum number of months to prevent infinite loops (100 years)
  const MAX_MONTHS = 12 * 100;
  
  // Store the adjustedTarget for each month
  let adjustedTarget = desiredPatrimony;
  
  while (currentPatrimony < desiredPatrimony && totalMonths < MAX_MONTHS) {
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
  
  // Add final data point when target is reached
  chartData.push({
    month: totalMonths,
    patrimony: currentPatrimony,
    adjustedTarget: adjustedTarget
  });
  
  // If we hit the maximum, return a very large number to indicate "never"
  if (totalMonths >= MAX_MONTHS) {
    return { years: 999, months: 0, adjustedPatrimony, chartData };
  }
  
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
