export const getClosingBalance = (passbooks) => {
  const parseCurrency = (value) => Number(value.replace(/[₹,]/g, ""));
  const formatCurrency = (value) => `₹ ${value.toLocaleString("en-IN")}`;

  // Find the latest year dynamically and calculate totals
  let totalEmployeeShare = 0;
  let totalEmployerShare = 0;
  let totalPensionShare = 0;
  let totalEmployeeShareInterest = 0;
  let totalEmployerShareInterest = 0;
  let totalPensionShareInterest = 0;
  let totalInterestShare = 0;
  let currentYearInterestShare = 0;
  let year = "FY'"

  for (const passbook of Object.values(passbooks)) {
    // Extract years and find the latest one
    const years = Object.keys(passbook).map(Number);
    const latestYear = Math.max(...years);
    if (year === "FY'") {
      // Set year to the last two digits of the latest year
      year = year + latestYear.toString().slice(-2)
    }

    if (passbook[latestYear] && passbook[latestYear].closingBalance) {
      const { employeeShare, employerShare, pensionShare } = passbook[latestYear].closingBalance;
      totalEmployeeShare += parseCurrency(employeeShare);
      totalEmployerShare += parseCurrency(employerShare);
      totalPensionShare += parseCurrency(pensionShare);
    }

    // get latest year interest
    if (passbook[latestYear] && passbook[latestYear].interestDetails) {
      const { employeeShare, employerShare, pensionShare } = passbook[latestYear].interestDetails;
      currentYearInterestShare += parseCurrency(employeeShare) + parseCurrency(employerShare) + parseCurrency(pensionShare);
    }

    // get complete interest details
    for (const year of years) {
      // Check if interestDetails exist for the current year
      if (passbook[year] && passbook[year].interestDetails) {
        const { employeeShare, employerShare, pensionShare } = passbook[year].interestDetails;
        // Accumulate the shares
        totalEmployeeShareInterest += parseCurrency(employeeShare);
        totalEmployerShareInterest += parseCurrency(employerShare);
        totalPensionShareInterest += parseCurrency(pensionShare);
      }
    }
    totalInterestShare = totalEmployeeShareInterest + totalEmployerShareInterest + totalPensionShareInterest
  }

  return {
    employeeShare: formatCurrency(totalEmployeeShare - totalEmployeeShareInterest),
    employerShare: formatCurrency(totalEmployerShare - totalEmployerShareInterest),
    pensionShare: formatCurrency(totalPensionShare - totalPensionShareInterest),
    interestShare: formatCurrency(totalInterestShare),
    currentYearInterestShare: formatCurrency(currentYearInterestShare),
    year
  }
}

export const getLastContribution = (data) => {
  if (!data) return 'N/A'

  const parseCurrency = (value) => Number(value.replace(/[,]/g, ""));
  const formatCurrency = (value) => `₹ ${value.toLocaleString("en-IN")}`;

  let contribution = 'N/A'

  const currentEmployer = data.serviceHistory.history.find(
    (entry) => entry.period.toLowerCase().includes("present")
  );

  if (!currentEmployer) return contribution;

  const memberId = currentEmployer.details["Member Id"];
  const passbook = data.passbooks[memberId];

  if (!passbook) return 'N/A';

  let mostRecentTransaction = null;

  // Iterate through years to find the most recent transaction
  Object.values(passbook).forEach((yearData) => {
    yearData.transactions.forEach((transaction) => {
      if (
        !mostRecentTransaction ||
        new Date(transaction.transactionDate.split("-").reverse().join("-")) >
        new Date(
          mostRecentTransaction.transactionDate.split("-").reverse().join("-")
        )
      ) {
        mostRecentTransaction = transaction;
      }
    });
  });

  if (mostRecentTransaction) {
    contribution = formatCurrency(parseCurrency(mostRecentTransaction.employeeShare) + parseCurrency(mostRecentTransaction.employerShare) + parseCurrency(mostRecentTransaction.pensionShare))
  }

  return contribution;
}

export const formatCurrency = (value) => {
  if(!value) return 
  return `₹ ${value.toLocaleString("en-IN")}`
}