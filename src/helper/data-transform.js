export const getClosingBalance = (passbooks) => {
    const parseCurrency = (value) => Number(value.replace(/[₹,]/g, ""));
    const formatCurrency = (value) => `₹ ${value.toLocaleString("en-IN")}`;

    // Find the latest year dynamically and calculate totals
    let totalEmployeeShare = 0;
    let totalEmployerShare = 0;
    let totalPensionShare = 0;
    let totalInterestShare = 0;
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
        if (passbook[latestYear] && passbook[latestYear].interestDetails) {
          const { employeeShare, employerShare, pensionShare } = passbook[latestYear].interestDetails;
            totalInterestShare += parseCurrency(employeeShare) + parseCurrency(employerShare) + parseCurrency(pensionShare);
        }
    }

    return { 
        employeeShare: formatCurrency(totalEmployeeShare), 
        employerShare: formatCurrency(totalEmployerShare), 
        pensionShare: formatCurrency(totalPensionShare), 
        interestShare: formatCurrency(totalInterestShare),
        year
    }
}

export const getLastContribution = (data) => {
    if(!data) return 'N/A'

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

    if(mostRecentTransaction) {
        contribution = formatCurrency(parseCurrency(mostRecentTransaction.employeeShare) + parseCurrency(mostRecentTransaction.employerShare) + parseCurrency(mostRecentTransaction.pensionShare))
    }

    return contribution;
}