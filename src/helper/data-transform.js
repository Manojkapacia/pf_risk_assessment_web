export const getClosingBalance = (passbooks) => {
    console.log(passbooks)
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
        year = year + latestYear.toString().slice(-2)

        if (passbook[latestYear] && passbook[latestYear].closingBalance) {
            const { employeeShare, employerShare, pensionShare } = passbook[latestYear].closingBalance;
            totalEmployeeShare += parseCurrency(employeeShare);
            totalEmployerShare += parseCurrency(employerShare);
            totalPensionShare += parseCurrency(pensionShare);
        }
        if (passbook[latestYear] && passbook[latestYear].interestDetails) {
            const { employeeShare, employerShare, pensionShare } = passbook[latestYear].interestDetails;
            totalInterestShare = parseCurrency(employeeShare) + parseCurrency(employerShare) + parseCurrency(pensionShare);
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