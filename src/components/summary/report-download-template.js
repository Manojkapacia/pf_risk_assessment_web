import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import FinRightlogo from './../../assets/images/FinRightlogo.png';
import HighRisk from './../../assets/images/highRiskMeter.png';
import ModerateRisk from './../../assets/images/moderateRiskMeter.png';
import LowRisk from './../../assets/images/lowRiskMeter.png';
import NoRisk from './../../assets/images/noRiskMeter.png';
import { formatCurrency, getClosingBalance, getLastContribution } from './../../helper/data-transform'
import checkIcon from './../../assets/images/correct.png';
import crossIcon from './../../assets/images/incorrect.png';
import warning from './../../assets/images/warning.png';

// Define PDF styles
const styles = StyleSheet.create({
    // page: {
    //     position: "relative",
    //     width: "100%",
    //     height: "100%",
    //     flexDirection: "column",
    //     paddingTop: 40,
    //     paddingBottom: 40,
    //     paddingLeft: 60,
    //     paddingRight: 60,
    //     fontSize: 13,
    // },
    // backgroundImage: {
    //     position: "absolute",
    //     top: 0,
    //     left: 0,
    //     width: "100%",
    //     height: "100%",
    //     opacity: 0.2,
    //   },
    page: {
        position: "relative",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 60,
        paddingRight: 60,
        fontSize: 13,
    },
    backgroundContainer: {
        position: "relative",
        width: "100%",
        height: "100%",
    },
    backgroundImage: {
        position: "absolute",
        width: 220,
        height: 90,
        top: "50%",
        left: "35%",
        transform: "translate(-50%, -50%)",
        opacity: 0.2,
    },
    content: {
        position: "relative",
        zIndex: 1,
    },
    section: {
        marginBottom: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        // textAlign: "center",
    },
    text: {
        marginBottom: 10,
        textAlign: "justify",
        // fontFamily: "Roboto",
    },
    table: {
        display: "flex",
        flexDirection: "column",
        // borderWidth: 1,
        // borderColor: "#000",
        // marginBottom: 10,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableCell: {
        flex: 1,
        borderTopWidth: 1,
        padding: 5,
    },
    summary: {
        marginBottom: 20,
    },
    bold: {
        fontWeight: "bold",
    },
    highRisk: {
        color: "red",
        fontWeight: "bold",
        marginTop: 10,
    },
    firstPageLogoContainer: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 100,
        height: "auto",
    },
    logoContainer: {
        textAlign: "right",
    },
    logo: {
        width: "5rem",
        height: "1.5rem"
    },
    riskImage: {
        width: '12rem',
        height: '6rem',
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    textContainer: {
        flex: 1, // Take up remaining space on the left
        textAlign: "left",
    },
    redText: {
        color: "red",
    },
    greenText: {
        color: "green",
    },
    warningText: {
        color: '#F56905'
    }
});

// PDF Component
const ReportDownloadTemplate = ({ summaryData }) => {
    const [blockedAmountPercentage, setBlockedAmountPercentage] = useState("");
    const [lastContribution, setLastContribution] = useState(0);
    const [balanceDetails, setBalanceDetails] = useState(null);
    const [categoryDetailsFromReport, setCategoryDetailsFromReport] = useState([])
    const userFullName = summaryData?.rawData?.data?.profile?.basicDetails?.fullName;
    const userUANnumber = summaryData?.rawData?.data?.profile?.UAN;
    const riskProbability = summaryData?.reportData?.claimRejectionProbability.toLowerCase();

    useEffect(() => {
        processReportData()
        // set width % for graph line
        if (summaryData?.reportData) setChartWidths();

        if (summaryData?.rawData) {
            const balances = getClosingBalance(summaryData?.rawData?.data?.passbooks)
            setBalanceDetails(balances)

            const lastContribution = getLastContribution(summaryData?.rawData?.data);
            setLastContribution(lastContribution)
        }
    }, [summaryData]);

    const assessmentDate = (dateString) => {
        if (dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
        }
        return "";
    };
    function formatDuration(duration) {
        if (duration) {
            const parts = duration?.split(" ");
            const years = parts[0] !== "0" ? `${parts[0]} Yrs` : "";
            const months = parts[2] !== "0" ? `${parts[2]} M` : "";
            return [years, months].filter(Boolean).join(" ");
        }
    }

    const getMemberWiseBalance = (memberId) => {
        const memberDetails = summaryData?.rawData?.data?.home?.memberWiseBalances.find((item) => item.memberId === memberId)
        if (!memberDetails) return 'N/A'
        return memberDetails?.balance
    }

    // function to check status for KYC 
    const isInvalid = (valueToCheck) => {
        const kycCategory = summaryData?.reportData?.withdrawabilityCheckupReport.find((item) => item.category.toUpperCase() === 'KYC')
        return kycCategory?.subCategory?.length && kycCategory?.subCategory[0].errorMessages.some(msg => msg.toLowerCase().includes(valueToCheck.toLowerCase()))
    }

    const getSelectedSubCategoryData = (subCategory) => {
        return categoryDetailsFromReport && categoryDetailsFromReport.find((item) => item.subCategory.toUpperCase() === subCategory.toUpperCase())
    }

    const processReportData = () => {
        if (!summaryData?.reportData?.withdrawabilityCheckupReport) return;

        const processedData = summaryData?.reportData.withdrawabilityCheckupReport.map(category => {
            return category.subCategory.map(sub => ({
                category: category.category,
                subCategory: sub.name,
                criticalCount: sub.critical,
                mediumCount: sub.medium,
                totalErrorCount: sub.critical + sub.medium,
                consolidatedErrorMessage: sub?.errorMessages?.filter((msg) => msg)
                    ?.map((msg, index) => (
                        <span
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start'
                            }}
                        >
                            <span style={{ marginRight: '0.5rem' }}>{index + 1}.</span>
                            <span style={{ textAlign: 'left', flex: 1 }}>{msg}.</span>
                        </span>
                    ))
            }));
        }).flat(); // Flattening to avoid nested arrays

        setCategoryDetailsFromReport(processedData);
    };
    
    const getSelectedCategoryData = (category) => {
        if (!summaryData?.reportData?.withdrawabilityCheckupReport) return;
        const categoryData = summaryData?.reportData?.withdrawabilityCheckupReport.find((item) => item.category.toUpperCase() === category.toUpperCase())
       
        return {
            isEpsMember: categoryData?.isEpsMember,
            totalCritical: categoryData?.totalCritical,
            totalMedium: categoryData?.totalMedium,
            consolidatedErrorMessage: categoryData?.subCategory
                ?.flatMap((sub) => sub.errorMessages)
                ?.filter((msg) => msg)
                ?.map((msg, index) => (
                    <>{index + 1}{". "}{msg}{"\n"}</>
                    // <span
                    //     key={index}
                    //     style={{
                    //         display: 'flex',
                    //         alignItems: 'flex-start',
                    //     }}
                    // >
                    //     <span style={{ marginRight: 5 }}>{index + 1}.</span>
                    //     <span style={{ textAlign: 'left', flex: 1 }}>{msg}.</span>
                    // </span>
                ))
        }
        

    }

    const maskAdharNumber = (number) => {
        if (number) {
            const lastFourDigits = number.slice(-3);
            return `XXXXXXXXX${lastFourDigits}`;
        }
    };

    const maskPanNumber = (number) => {
        if (number) {
            const lastFourDigits = number.slice(-4);
            return `XXXXXX${lastFourDigits}`;
        }
    };
    const removeCurrencySymbol = (amount) => {
        if (!amount) return "0";
        let amountString = typeof amount === "number" ? amount.toString() : amount;

        let numericValue = amountString.replace(/[^0-9.]/g, "");

        let numberValue = parseFloat(numericValue);
        if (isNaN(numberValue)) return "0";

        return new Intl.NumberFormat("en-IN").format(numberValue);
    };

    const setChartWidths = () => {
        // set blocked amount width
        const blockedWidth = Number(Number((summaryData?.reportData?.totalAmountStuck * 100) / summaryData?.reportData?.totalPfBalance).toFixed(0))
        const blockedFinalWidth = (blockedWidth * 0.60).toFixed(0); // 60% of the calculated width

        // set original blocked amount width
        setBlockedAmountPercentage(blockedWidth + "%")
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.backgroundContainer}>
                    <Image src={FinRightlogo} style={styles.backgroundImage} />

                    <View style={styles.content}>
                        <View style={{ ...styles.firstPageLogoContainer, marginRight: -33, marginTop: -7 }}>
                            <Image src={FinRightlogo} style={styles.logo} />
                        </View>

                        <View style={styles.section}>
                            <Text style={{ ...styles.text, marginTop: 100, marginBottom: 20 }}>Dear {userFullName},</Text>
                            <Text style={{ ...styles.text, marginBottom: 0 }}>
                                Thank you for trusting FinRight.
                            </Text>
                            <Text style={{ ...styles.text, marginTop: 10 }}>
                                After serving more than 5000 customers and settling more than Rs. 20 Crore PF claims, our research helped us create the PF withdrawability check, which checks if there are any issues in your provident fund balance.
                            </Text>
                            <Text style={{ ...styles.text, marginTop: 20 }}>
                                On average, 40% of your entire net worth is in provident fund that you sacrifice as part of your salary. This is your hard-earned money that secures your retirement or provides a cushion in times of emergency. You should have access to it at all times, and having even a single rupee blocked should be unacceptable.
                            </Text>
                            <Text style={{ ...styles.text, marginTop: 20 }}>
                                In this report, we truly hope you get a “No amount blocked” message, but if there are any issues, we sincerely hope this report helps you understand them and get a resolution.
                            </Text>
                            <Text style={{ ...styles.text, marginTop: 10 }}>
                                Regards,
                                {"\n"}Team FinRight
                            </Text>
                        </View>
                    </View>
                </View>
            </Page>
            {/* Page 2 */}
            <Page size="A4" style={styles.page}>
                <View style={styles.backgroundContainer}>
                    <Image src={FinRightlogo} style={styles.backgroundImage} />

                    <View style={styles.content}>
                        <View style={styles.headerRow}>
                            <View style={styles.textContainer}>
                                <Text style={{ ...styles.text, marginBottom: 0 }}>{userFullName}</Text>
                                <Text style={{ ...styles.text, marginBottom: 0 }}>UAN: {userUANnumber}</Text>
                                <Text style={styles.text}>Assessment Date: {assessmentDate(summaryData?.reportData?.createdAt)}</Text>
                            </View>
                            <View style={styles.logoContainer}>
                                <Image
                                    src={FinRightlogo}
                                    style={styles.logo}
                                />
                            </View>
                        </View>
                        <Text style={styles.header}>Report Summary</Text>
                        <Text style={styles.text}>This section shows the overall summary of the output of PF withdrawability report</Text>


                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>Your PF Claim Rejection Probability</Text>
                                <View style={styles.tableCell}>
                                    <Image src={riskProbability === "high" ? HighRisk :
                                        riskProbability === "moderate" ? ModerateRisk : riskProbability === "low" ? LowRisk : NoRisk} style={styles.riskImage} />

                                </View>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>Issues Identified</Text>
                                <Text style={[styles.tableCell, styles.boldText]}>{summaryData?.reportData?.totalIssuesFound?.critical > 0 ? (summaryData?.reportData?.totalIssuesFound?.critical + " " + "Critical") : " "}
                                    {summaryData?.reportData?.totalIssuesFound?.medium > 0 ? " & " +summaryData?.reportData?.totalIssuesFound?.medium + " " + 'Medium' : ''}
                                    {(summaryData?.reportData?.totalIssuesFound?.critical === 0 && summaryData?.reportData?.totalIssuesFound?.medium === 0) ? "No Issues" : ''}</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>Estimated Resolution Time</Text>
                                <Text style={[styles.tableCell, styles.boldText]}>{summaryData?.reportData?.estimatedResolutionTime}</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>Total Corpus</Text>
                                <Text style={[styles.tableCell, styles.boldText]}>Rs. {removeCurrencySymbol(summaryData?.reportData?.totalPfBalance)}</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>Amount Blocked</Text>
                                <Text style={[styles.tableCell, styles.boldText]}>Rs. {removeCurrencySymbol(summaryData?.reportData?.totalAmountStuck)}</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>Maximum Withdrawal Limit</Text>
                                <Text style={[styles.tableCell, styles.boldText]}>Rs. {removeCurrencySymbol(summaryData?.reportData?.maxWithdrawableLimit)}</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>Amount Withdrawable in 30 Days</Text>
                                <Text style={[styles.tableCell, styles.boldText]}>Rs. {removeCurrencySymbol(summaryData?.reportData?.amountWithdrawableWithin30Days)}</Text>
                            </View>

                        </View>
                        <View style={{ borderTop: 1 }} />
                        {summaryData?.reportData?.totalAmountStuck > 0 &&
                            <Text style={styles.highRisk}>
                                {blockedAmountPercentage}  of your total PF corpus is stuck due to issues
                            </Text>}
                        {summaryData?.reportData?.totalAmountStuck === 0 &&
                            <Text style={{ color: 'green' }}>
                                Yay! you have complete access to your fund
                            </Text>}
                        <View style={{ borderTop: 1, marginTop: 10, marginBottom: 10 }} />
                        <View style={styles.section}>
                            <Text>
                                For employees who are still working, Minimum Withdrawal Limit is calculated as follows:
                            </Text>
                            <View style={{ marginLeft: 20, marginBottom: 5 }}>
                                <Text style={{ marginRight: 10 }}>• Task 1: Review the report</Text>
                                <Text style={{ marginRight: 10 }}>• Task 2: Finalize presentation</Text>
                                <Text style={{ marginRight: 10 }}>• Task 3: Send email updates</Text>
                                <Text style={{ marginRight: 10 }}>• Task 4: Attend the meeting</Text>
                            </View>
                            <Text>If you are retired or current not working then you can withdraw your entire fund
                                * Blocked amount is total of employer and pension share of companies where issues are found, but if there is an issue in your KYC then your entire Fund balance gets blocked
                                ** Amount Withdrawable within 30 days is 6 times the average of your last 6 months EPF wages
                            </Text>
                        </View>
                        <View style={{ borderTop: 1 }} />
                    </View>
                </View>

            </Page>
            {/* Page 3 */}
            <Page size="A4" style={styles.page}>
                <View style={styles.backgroundContainer}>
                    <Image src={FinRightlogo} style={styles.backgroundImage} />

                    <View style={styles.content}>
                        <View style={styles.headerRow}>
                            <View style={styles.textContainer}>
                                <Text style={{ ...styles.text, marginBottom: 0 }}>{userFullName}</Text>
                                <Text style={{ ...styles.text, marginBottom: 0 }}>UAN: {userUANnumber}</Text>
                                <Text style={styles.text}>Assessment Date: {assessmentDate(summaryData?.reportData?.createdAt)}</Text>
                            </View>
                            <View style={styles.logoContainer}>
                                <Image
                                    src={FinRightlogo}
                                    style={styles.logo}
                                />
                            </View>
                        </View>
                        <Text style={styles.header}>Account Summary</Text>
                        <Text style={styles.text}>Lets look at the overview of your provident fund account</Text>
                        <View style={{ backgroundColor: '#a8d5ea', borderTop: 1, borderBottom: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5, marginBottom: 5, marginLeft: 8 }}>
                                Account Summary
                            </Text>
                        </View>
                        <View >
                            <View style={{ flexDirection: "row", marginTop: 5, marginBottom: 5 }}>
                                <Text style={{ flex: 1, fontSize: 10 }}>Parameter</Text>
                                <Text style={{ flex: 1, fontSize: 10 }}>Result</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5 }}>Total Service</Text>
                                <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5 }}>{formatDuration(summaryData?.rawData?.data?.serviceHistory?.overview?.['Total Experience'])}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5 }}>Number of Employers</Text>
                                <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5 }}>{summaryData?.rawData?.data?.serviceHistory?.history.length}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5 }}>Current Employer</Text>
                                <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5 }}>{summaryData?.rawData?.data?.home?.currentEstablishmentDetails?.establishmentName}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5 }}>Last Contribution</Text>
                                <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5 }}>Rs. {removeCurrencySymbol(lastContribution)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5 }}>{balanceDetails?.year}  Interest</Text>
                                <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5 }}>Rs. {removeCurrencySymbol(balanceDetails?.currentYearInterestShare)}</Text>
                            </View>
                        </View>
                        <View style={{ borderTop: 1, marginBottom: 30 }} />
                        <View style={{ backgroundColor: '#a8d5ea', borderTop: 1, borderBottom: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5, marginBottom: 5, marginLeft: 8 }}>
                                Employment History
                            </Text>
                        </View>
                        <View >
                            <View style={{ flexDirection: "row", marginTop: 5, marginBottom: 5 }}>
                                <Text style={{ flex: 1, fontSize: 10 }}>Employer</Text>
                                <Text style={{ flex: 1, fontSize: 10, marginLeft: 10 }}>Tenure</Text>
                                <Text style={{ flex: 1, fontSize: 10, marginLeft: 10 }}>Balance</Text>
                                <Text style={{ flex: 1, fontSize: 10 }}>
                                    Experience
                                </Text>
                            </View>
                            {summaryData?.rawData?.data?.serviceHistory?.history.map((row, index) => (
                                <View style={{ flexDirection: 'row', borderTop: 1 }} key={index}>
                                    <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5 }}>{row?.company}</Text>
                                    <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5, marginLeft: 10 }}>{row?.period}</Text>
                                    <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5, marginLeft: 10 }}>Rs. {removeCurrencySymbol(getMemberWiseBalance(row?.details?.['Member Id']))}</Text>
                                    <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5 }}>{formatDuration(row?.details?.['Total Service'])}</Text>
                                </View>
                            ))}

                        </View>
                        <View style={{ borderTop: 1 }} />
                    </View>
                </View>

            </Page>
            {/* Page 4 */}
            <Page size="A4" style={styles.page}>
                <View style={styles.backgroundContainer}>
                    <Image src={FinRightlogo} style={styles.backgroundImage} />

                    <View style={styles.content}>
                        <View style={styles.headerRow}>
                            <View style={styles.textContainer}>
                                <Text style={{ ...styles.text, marginBottom: 0 }}>{userFullName}</Text>
                                <Text style={{ ...styles.text, marginBottom: 0 }}>UAN: {userUANnumber}</Text>
                                <Text style={styles.text}>Assessment Date: {assessmentDate(summaryData?.reportData?.createdAt)}</Text>
                            </View>
                            <View style={styles.logoContainer}>
                                <Image
                                    src={FinRightlogo}
                                    style={styles.logo}
                                />
                            </View>
                        </View>
                        <Text style={styles.header}>Drill Down Analysis</Text>
                        <Text style={styles.text}>This section will drill down into each check-up parameter and identify
                            what went wrong and what went well.
                        </Text>
                        <View style={{ backgroundColor: '#a8d5ea', borderTop: 1, borderBottom: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5, marginBottom: 5, marginLeft: 8 }}>
                                Issue analysis - KYC
                            </Text>
                        </View>
                        <View >
                            <View style={{ flexDirection: "row", marginTop: 5, marginBottom: 5 }}>
                                <Text style={{ flex: 1, fontSize: 10, marginLeft: 8 }}>Parameter</Text>
                                <Text style={{ flex: 1, fontSize: 10 }}>Result</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5, marginLeft: 8 }}>
                                    Name:{"\n"}
                                    <Text style={{ fontWeight: "bold" }}>{summaryData?.rawData?.data?.profile?.basicDetails?.fullName}</Text>
                                </Text>
                                {isInvalid(('Full Name')) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.redText}>
                                            Incorrect
                                        </Text>
                                    </View>
                                }
                                {!isInvalid(('Full Name')) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={checkIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.greenText}>
                                            Verified
                                        </Text>
                                    </View>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5, marginLeft: 8 }}>
                                    {summaryData?.rawData?.data?.profile?.basicDetails?.relation.toUpperCase() === 'F' ? "Father's Name" : "Husband's Name"}:{"\n"}
                                    <Text style={{ fontWeight: "bold" }}>{summaryData?.rawData?.data?.profile?.basicDetails?.fatherHusbandName}</Text>
                                </Text>
                                {isInvalid(('Father/Husband Name')) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.redText}>
                                            Incorrect
                                        </Text>
                                    </View>
                                }
                                {!isInvalid(('Father/Husband Name')) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={checkIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.greenText}>
                                            Verified
                                        </Text>
                                    </View>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5, marginLeft: 8 }}>
                                    Date of Birth:{"\n"}
                                    <Text style={{ fontWeight: "bold" }}>{summaryData?.rawData?.data?.profile?.basicDetails?.dateOfBirth}</Text>
                                </Text>
                                {isInvalid(('Date of Birth')) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.redText}>
                                            Incorrect
                                        </Text>
                                    </View>
                                }
                                {!isInvalid(('Date of Birth')) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={checkIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.greenText}>
                                            Verified
                                        </Text>
                                    </View>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5, marginLeft: 8 }}>
                                    Gender:{"\n"}
                                    <Text style={{ fontWeight: "bold" }}>{summaryData?.rawData?.data?.profile?.basicDetails?.gender.toUpperCase() === "M" ? "Male" : "Female"}</Text>
                                </Text>
                                {isInvalid(('Father/Husband Name')) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.redText}>
                                            Incorrect
                                        </Text>
                                    </View>
                                }
                                {!isInvalid(('Father/Husband Name')) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={checkIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.greenText}>
                                            Verified
                                        </Text>
                                    </View>
                                }
                            </View>

                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5, marginLeft: 8 }}>
                                    Physically Handiccapped:{"\n"}
                                    <Text style={{ fontWeight: "bold" }}>{summaryData?.rawData?.data?.profile?.basicDetails?.physicallyHandicapped.toUpperCase() === "N" ? "None" : "Yes"}</Text>
                                </Text>
                                {isInvalid(('Physically Handicapped')) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.redText}>
                                            Incorrect
                                        </Text>
                                    </View>
                                }
                                {!isInvalid(('Physically Handicapped')) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={checkIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.greenText}>
                                            Verified
                                        </Text>
                                    </View>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5, marginLeft: 8 }}>
                                    International Worker:{"\n"}
                                    <Text style={{ fontWeight: "bold" }}>{summaryData?.rawData?.data?.profile?.basicDetails?.internationalWorker.toUpperCase() === "N" ? "No" : "Yes"}</Text>
                                </Text>
                                {isInvalid(('International Worker')) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.redText}>
                                            Incorrect
                                        </Text>
                                    </View>
                                }
                                {!isInvalid(('International Worker')) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={checkIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.greenText}>
                                            Verified
                                        </Text>
                                    </View>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5, marginLeft: 8 }}>
                                    Adhaar Number:{"\n"}
                                    <Text style={{ fontWeight: "bold" }}>{maskAdharNumber(summaryData?.rawData?.data?.profile?.kycDetails?.aadhaar)}</Text>
                                </Text>
                                {isInvalid(('Aadhaar Number')) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.redText}>
                                            Incorrect
                                        </Text>
                                    </View>
                                }
                                {!isInvalid(('Aadhaar Number')) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={checkIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.greenText}>
                                            Verified
                                        </Text>
                                    </View>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5, marginLeft: 8 }}>
                                    PAN number:{"\n"}
                                    <Text style={{ fontWeight: "bold" }}>{maskPanNumber(summaryData?.rawData?.data?.profile?.kycDetails?.pan)}</Text>
                                </Text>
                                {isInvalid(('Pan Number')) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.redText}>
                                            Incorrect
                                        </Text>
                                    </View>
                                }
                                {!isInvalid(('Pan Number')) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={checkIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.greenText}>
                                            Verified
                                        </Text>
                                    </View>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5, marginLeft: 8 }}>
                                    Bank Account No.{"\n"}
                                    <Text style={{ fontWeight: "bold" }}>{maskAdharNumber(summaryData?.rawData?.data?.profile?.kycDetails?.bankAccountNumber)}</Text>
                                </Text>
                                {isInvalid(('Bank Account Number')) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.redText}>
                                            Incorrect
                                        </Text>
                                    </View>
                                }
                                {!isInvalid(('Bank Account Number')) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={checkIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.greenText}>
                                            Verified
                                        </Text>
                                    </View>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1, fontSize: 13, marginTop: 5, marginBottom: 5, marginLeft: 8 }}>
                                    IFSC No.{"\n"}
                                    <Text style={{ fontWeight: "bold" }}>{maskAdharNumber(summaryData?.rawData?.data?.profile?.kycDetails?.bankIFSC)}</Text>
                                </Text>
                                {isInvalid(('Bank IFSC')) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.redText}>
                                            Incorrect
                                        </Text>
                                    </View>
                                }
                                {!isInvalid(('Bank IFSC')) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={checkIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.greenText}>
                                            Verified
                                        </Text>
                                    </View>
                                }
                            </View>
                        </View>
                        <View style={{ borderTop: 1 }} />
                    </View>
                </View>
            </Page>

            {/* Page 5 */}
            <Page size="A4" style={styles.page}>
                <View style={styles.backgroundContainer}>
                    <Image src={FinRightlogo} style={styles.backgroundImage} />

                    <View style={styles.content}>
                        <View style={styles.headerRow}>
                            <View style={styles.textContainer}>
                                <Text style={{ ...styles.text, marginBottom: 0 }}>{userFullName}</Text>
                                <Text style={{ ...styles.text, marginBottom: 0 }}>UAN: {userUANnumber}</Text>
                                <Text style={styles.text}>Assessment Date: {assessmentDate(summaryData?.reportData?.createdAt)}</Text>
                            </View>
                            <View style={styles.logoContainer}>
                                <Image
                                    src={FinRightlogo}
                                    style={styles.logo}
                                />
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#a8d5ea', borderTop: 1, borderBottom: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5, marginBottom: 5, marginLeft: 8 }}>
                                Issue analysis - Employment History
                            </Text>
                        </View>
                        <View >
                            <View style={{ flexDirection: "row", marginTop: 5, marginBottom: 5 }}>
                                <Text style={{ flex: 1, fontSize: 10 }}>Parameter</Text>
                                <Text style={{ flex: 1, fontSize: 10 }}>Result</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1, }}>Full employment History</Text>
                                {(getSelectedSubCategoryData('Employement_Record')?.criticalCount > 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text>
                                            {getSelectedSubCategoryData('Employement_Record')?.criticalCount} Missing Employment Record
                                        </Text>
                                    </View>
                                }
                                {(getSelectedSubCategoryData('Employement_Record')?.criticalCount === 0 && getSelectedSubCategoryData('Employement_Record')?.mediumCount > 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={warning} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text>
                                            Not Eligible
                                        </Text>
                                    </View>
                                }
                                {(getSelectedSubCategoryData('Employement_Record')?.criticalCount === 0 && getSelectedSubCategoryData('Employement_Record')?.mediumCount === 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={checkIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.greenText}>
                                            No Issue Found
                                        </Text>
                                    </View>
                                }

                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1 }}>Full withdrawability</Text>
                                {(getSelectedSubCategoryData('Full_Withdrawability')?.criticalCount > 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.redText}>
                                            {getSelectedSubCategoryData('Full_Withdrawability')?.criticalCount} Missing Employment Record
                                        </Text>
                                    </View>
                                }
                                {(getSelectedSubCategoryData('Full_Withdrawability')?.criticalCount === 0 && getSelectedSubCategoryData('Full_Withdrawability')?.mediumCount > 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={warning} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.warningText}>
                                            Not Eligible
                                        </Text>
                                    </View>
                                }
                                {(getSelectedSubCategoryData('Full_Withdrawability')?.criticalCount === 0 && getSelectedSubCategoryData('Full_Withdrawability')?.mediumCount === 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={checkIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.greenText}>
                                            No Issue Found
                                        </Text>
                                    </View>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1 }}>Date of exit</Text>
                                {(getSelectedSubCategoryData('Date_Of_Exit')?.criticalCount > 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.redText}>
                                            {getSelectedSubCategoryData('Date_Of_Exit')?.criticalCount} Missing Employment Record
                                        </Text>
                                    </View>
                                }
                                {(getSelectedSubCategoryData('Date_Of_Exit')?.criticalCount === 0 && getSelectedSubCategoryData('Date_Of_Exit')?.mediumCount > 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={warning} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.warningText}>
                                            Not Eligible
                                        </Text>
                                    </View>
                                }
                                {(getSelectedSubCategoryData('Date_Of_Exit')?.criticalCount === 0 && getSelectedSubCategoryData('Date_Of_Exit')?.mediumCount === 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={checkIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.greenText}>
                                            No Issue Found
                                        </Text>
                                    </View>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1 }}>Service Overlap</Text>
                                {(getSelectedSubCategoryData('Service_Overlap')?.criticalCount > 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.redText}>
                                            {getSelectedSubCategoryData('Service_Overlap')?.criticalCount} Missing Employment Record
                                        </Text>
                                    </View>
                                }
                                {(getSelectedSubCategoryData('Service_Overlap')?.criticalCount === 0 && getSelectedSubCategoryData('Service_Overlap')?.mediumCount > 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={warning} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.warningText}>
                                            Not Eligible
                                        </Text>
                                    </View>
                                }
                                {(getSelectedSubCategoryData('Service_Overlap')?.criticalCount === 0 && getSelectedSubCategoryData('Service_Overlap')?.mediumCount === 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={checkIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.greenText}>
                                            No Issue Found
                                        </Text>
                                    </View>
                                }
                            </View>
                        </View>
                        {(getSelectedCategoryData('Employment History')?.totalCritical > 0) &&
                            <View style={{ borderTop: 1 }}>
                                <Text style={[{ marginBottom: 5, marginTop: 5 }, styles.redText]}>
                                <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                    <Text style={{ fontWeight: 'bold' }}>{getSelectedCategoryData('Employment History')?.totalCritical} Issue Found:{"\n"} </Text>
                                    {getSelectedCategoryData('Employment History')?.consolidatedErrorMessage}
                                </Text>
                            </View>
                        }
                        {(getSelectedCategoryData('Employment History')?.totalCritical === 0) &&
                            <View style={{ borderTop: 1 }}>
                                <Text style={[{ marginBottom: 5, marginTop: 5 }, styles.greenText]}>
                                    <Text style={{ fontWeight: 'bold' }}> No Issue Found,</Text> All Good! 1 less thing to worry about
                                </Text>
                            </View>
                        }

                        <View style={{ borderTop: 1, marginBottom: 30 }} />
                        <View style={{ backgroundColor: '#a8d5ea', borderTop: 1, borderBottom: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5, marginBottom: 5, marginLeft: 8 }}>
                                Issue analysis - PF Contributions
                            </Text>
                        </View>
                        <View >
                            <View style={{ flexDirection: "row", marginTop: 5, marginBottom: 5 }}>
                                <Text style={{ flex: 1, fontSize: 10 }}>Parameter</Text>
                                <Text style={{ flex: 1, fontSize: 10 }}>Result</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1 }}>Amount Consolidation</Text>
                                {(getSelectedSubCategoryData('Amount_Consolidation')?.criticalCount > 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.redText}>
                                            {getSelectedSubCategoryData('Amount_Consolidation')?.criticalCount} critical issue found
                                        </Text>
                                    </View>
                                }
                                {(getSelectedSubCategoryData('Amount_Consolidation')?.criticalCount === 0 && getSelectedSubCategoryData('Amount_Consolidation')?.mediumCount > 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={warning} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.warningText}>
                                            {getSelectedSubCategoryData('Amount_Consolidation')?.mediumCount} Not Eligible
                                        </Text>
                                    </View>
                                }
                                {(getSelectedSubCategoryData('Amount_Consolidation')?.criticalCount === 0 && getSelectedSubCategoryData('Amount_Consolidation')?.mediumCount === 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={checkIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.greenText}>
                                            No Issue Found
                                        </Text>
                                    </View>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1 }}>Contribution anomalies - DOE</Text>
                                {(getSelectedSubCategoryData('Contribution_DOE_Anomalies')?.criticalCount > 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.redText}>
                                            {getSelectedSubCategoryData('Contribution_DOE_Anomalies')?.criticalCount} critical issue found
                                        </Text>
                                    </View>
                                }
                                {(getSelectedSubCategoryData('Contribution_DOE_Anomalies')?.criticalCount === 0 && getSelectedSubCategoryData('Contribution_DOE_Anomalies')?.mediumCount > 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={warning} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.warningText}>
                                            {getSelectedSubCategoryData('Contribution_DOE_Anomalies')?.mediumCount} Not Eligible
                                        </Text>
                                    </View>
                                }
                                {(getSelectedSubCategoryData('Contribution_DOE_Anomalies')?.criticalCount === 0 && getSelectedSubCategoryData('Contribution_DOE_Anomalies')?.mediumCount === 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={checkIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.greenText}>
                                            No Issue Found
                                        </Text>
                                    </View>
                                }
                            </View>

                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1 }}>Contribution anomalies - DOJ</Text>
                                {(getSelectedSubCategoryData('Contribution_DOJ_Anomalies')?.criticalCount > 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.redText}>
                                            {getSelectedSubCategoryData('Contribution_DOJ_Anomalies')?.criticalCount} critical issue found
                                        </Text>
                                    </View>
                                }
                                {(getSelectedSubCategoryData('Contribution_DOJ_Anomalies')?.criticalCount === 0 && getSelectedSubCategoryData('Contribution_DOJ_Anomalies')?.mediumCount > 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={warning} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.warningText}>
                                            {getSelectedSubCategoryData('Contribution_DOJ_Anomalies')?.mediumCount} Not Eligible
                                        </Text>
                                    </View>
                                }
                                {(getSelectedSubCategoryData('Contribution_DOJ_Anomalies')?.criticalCount === 0 && getSelectedSubCategoryData('Contribution_DOJ_Anomalies')?.mediumCount === 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={checkIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.greenText}>
                                            No Issue Found
                                        </Text>
                                    </View>
                                }
                            </View>


                        </View>
                        {(getSelectedCategoryData('PF Contributions')?.totalCritical > 0 || getSelectedCategoryData('PF Contributions')?.totalMedium > 0) &&
                            <View style={{ borderTop: 1 }}>
                                
                                <Text style={[ { marginBottom: 5, marginTop: 5 }, getSelectedCategoryData('PF Contributions')?.totalCritical > 0
                                        ? styles.redText
                                        : styles.warningText ]
                                }>
                                    <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                    <Text style={{ fontWeight: "bold" }}>{getSelectedCategoryData('PF Contributions')?.totalCritical + getSelectedCategoryData('PF Contributions')?.totalMedium} Issue Found:{"\n"}</Text>
                                    {getSelectedCategoryData('PF Contributions')?.consolidatedErrorMessage}
                                </Text>
                            </View>
                        }
                        {(getSelectedCategoryData('PF Contributions')?.totalCritical === 0 && getSelectedCategoryData('PF Contributions')?.totalMedium === 0) &&
                            <View style={{ borderTop: 1 }}>
                                <Text style={[{ marginBottom: 5, marginTop: 5 }, styles.greenText]}>
                                    <Text style={{ fontWeight: 'bold' }}> No Issue Found,</Text>
                                    All Good! 1 less thing to worry about.
                                </Text>
                            </View>
                        }

                        <View style={{ borderTop: 1 }}></View>
                    </View>
                </View>
            </Page>

            {/* Page 6 */}
            <Page size="A4" style={styles.page}>
                <View style={styles.backgroundContainer}>
                    <Image src={FinRightlogo} style={styles.backgroundImage} />

                    <View style={styles.content}>
                        <View style={styles.headerRow}>
                            <View style={styles.textContainer}>
                                <Text style={{ ...styles.text, marginBottom: 0 }}>{userFullName}</Text>
                                <Text style={{ ...styles.text, marginBottom: 0 }}>UAN: {userUANnumber}</Text>
                                <Text style={styles.text}>Assessment Date: {assessmentDate(summaryData?.reportData?.createdAt)}</Text>
                            </View>
                            <View style={styles.logoContainer}>
                                <Image
                                    src={FinRightlogo}
                                    style={styles.logo}
                                />
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#a8d5ea', borderTop: 1, borderBottom: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5, marginBottom: 5, marginLeft: 8 }}>
                                Issue analysis - EPS Pension Records
                            </Text>
                        </View>
                        <View >
                            <View style={{ flexDirection: "row", marginTop: 5, marginBottom: 5 }}>
                                <Text style={{ flex: 1, fontSize: 10 }}>Parameter</Text>
                                <Text style={{ flex: 1, fontSize: 10 }}>Result</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1 }}>IS EPS Member</Text>
                                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                    <Text
                                     style={getSelectedCategoryData("EPF Pension Records")?.isEpsMember === "N"
                                            ? styles.redText
                                            : styles.greenText}
                                    >
                                        {getSelectedCategoryData('EPF Pension Records')?.isEpsMember === "N" ? "Not a Member" : "Yes"}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1, }}>EPS Contribution Anomalies</Text>
                                {(getSelectedSubCategoryData('Pension')?.criticalCount > 0 || getSelectedSubCategoryData('Pension')?.mediumCount > 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.redText}>
                                            Critical Issue Found
                                        </Text>
                                    </View>
                                }
                                {(getSelectedSubCategoryData('Pension')?.criticalCount === 0 && getSelectedSubCategoryData('Pension')?.mediumCount === 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={checkIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.greenText}>
                                            No Issue Found
                                        </Text>
                                    </View>
                                }
                            </View>
                        </View>
                        <View style={{ borderTop: 1 }}>
                            {(getSelectedCategoryData('EPF Pension Records')?.totalCritical > 0 || getSelectedCategoryData('EPF Pension Records')?.totalMedium > 0) &&
                                <Text style={
                                    
                                        getSelectedCategoryData("EPF Pension Records")?.totalCritical > 0
                                            ? styles.redText
                                            : styles.warningText
                                }>
                                    <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                    <Text style={{ fontWeight: 'bold' }}>{getSelectedCategoryData('EPF Pension Records')?.totalCritical + getSelectedCategoryData('EPF Pension Records')?.totalMedium} Issue Found:{"\n"}</Text>
                                    <Text>{getSelectedCategoryData('EPF Pension Records')?.consolidatedErrorMessage} </Text>
                                </Text>
                            }
                            {(getSelectedCategoryData('EPF Pension Records')?.totalCritical === 0 && getSelectedCategoryData('EPF Pension Records')?.totalMedium === 0) &&
                                <View style={{ borderTop: 1 }}>
                                    <Text style={[{ marginBottom: 5, marginTop: 5 }, styles.greenText]}>
                                        <Text style={{ fontWeight: 'bold' }}> No Issue Found,</Text> All Good! 1 less thing to worry about
                                    </Text>
                                </View>
                            }

                        </View>
                        <View style={{ borderTop: 1, marginBottom: 30 }} />
                        <View style={{ backgroundColor: '#a8d5ea', borderTop: 1, borderBottom: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5, marginBottom: 5, marginLeft: 8 }}>
                                Issue analysis - Transfer Records
                            </Text>
                        </View>
                        <View >
                            <View style={{ flexDirection: "row", marginTop: 5, marginBottom: 5 }}>
                                <Text style={{ flex: 1, fontSize: 10 }}>Parameter</Text>
                                <Text style={{ flex: 1, fontSize: 10 }}>Result</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1 }}>Transfer out Missing</Text>
                                {(getSelectedSubCategoryData('Transfer_Out')?.criticalCount > 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.redText}>
                                            {getSelectedSubCategoryData('Transfer_Out')?.criticalCount} critical issue found
                                        </Text>
                                    </View>
                                }
                                {(getSelectedSubCategoryData('Transfer_Out')?.criticalCount === 0 && getSelectedSubCategoryData('Transfer_Out')?.mediumCount > 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={warning} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.warningText}>
                                            {getSelectedSubCategoryData('Transfer_Out')?.mediumCount} medium issue found
                                        </Text>
                                    </View>
                                }
                                {(getSelectedSubCategoryData('Transfer_Out')?.criticalCount === 0 && getSelectedSubCategoryData('Transfer_Out')?.mediumCount === 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={checkIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.greenText}>
                                            No Issue Found
                                        </Text>
                                    </View>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1 }}>Transfer In Missing</Text>
                                {(getSelectedSubCategoryData('Transfer_Out')?.criticalCount > 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.redText}>
                                            {getSelectedSubCategoryData('Transfer_Out')?.criticalCount} critical issue found
                                        </Text>
                                    </View>
                                }
                                {(getSelectedSubCategoryData('Transfer_Out')?.criticalCount === 0 && getSelectedSubCategoryData('Transfer_Out')?.mediumCount > 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={warning} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.warningText}>
                                            {getSelectedSubCategoryData('Transfer_Out')?.mediumCount} medium issue found
                                        </Text>
                                    </View>
                                }
                                {(getSelectedSubCategoryData('Transfer_Out')?.criticalCount === 0 && getSelectedSubCategoryData('Transfer_Out')?.mediumCount === 0) &&
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                        <Image src={checkIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                        <Text style={styles.greenText}>
                                            No Issue Found
                                        </Text>
                                    </View>
                                }
                            </View>
                        </View>
                        {(getSelectedCategoryData('Passbook Records')?.totalCritical > 0 || getSelectedCategoryData('Passbook Records')?.totalMedium > 0) &&
                            <View style={{ borderTop: 1 }}>
                                <Text style={{
                                    marginBottom: 5, marginTop: 5, color:
                                        getSelectedCategoryData("Passbook Records")?.totalCritical > 0
                                            ? styles.redText
                                            : styles.warningText
                                }}>
                                    <Image src={crossIcon} style={{ height: 15, width: 15, marginRight: 5 }} />
                                    <Text style={{ fontWeight: 'bold' }}>{getSelectedCategoryData('Passbook Records')?.totalCritical + getSelectedCategoryData('Passbook Records')?.totalMedium} Issue Found:{"\n"}</Text>
                                    {getSelectedCategoryData('Passbook Records')?.consolidatedErrorMessage}
                                </Text>
                            </View>
                        }
                        {(getSelectedCategoryData('Passbook Records')?.totalCritical === 0 && getSelectedCategoryData('Passbook Records')?.totalMedium === 0) &&
                            <View style={{ borderTop: 1 }}>
                                <Text style={[{ marginBottom: 5, marginTop: 5 }, styles.greenText]}>
                                    <Text style={{ fontWeight: 'bold' }}> No Issue Found,</Text> All Good! 1 less thing to worry about
                                </Text>
                            </View>
                        }

                        <View style={{ borderTop: 1 }}></View>
                    </View>
                </View>

            </Page>

            {/* Page 7 */}
            <Page size="A4" style={styles.page}>
                <View style={styles.backgroundContainer}>
                    <Image src={FinRightlogo} style={styles.backgroundImage} />

                    <View style={styles.content}>
                        <View style={styles.headerRow}>
                            <View style={styles.textContainer}>
                                <Text style={{ ...styles.text, marginBottom: 0 }}>{userFullName}</Text>
                                <Text style={{ ...styles.text, marginBottom: 0 }}>UAN: {userUANnumber}</Text>
                                <Text style={styles.text}>Assessment Date: {assessmentDate(summaryData?.reportData?.createdAt)}</Text>
                            </View>
                            <View style={styles.logoContainer}>
                                <Image
                                    src={FinRightlogo}
                                    style={styles.logo}
                                />
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#a8d5ea', borderTop: 1, borderBottom: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5, marginBottom: 5, marginLeft: 8 }}>
                                Fund ROI
                            </Text>
                        </View>
                        <View >
                            <View style={{ flexDirection: "row", marginTop: 5, marginBottom: 5 }}>
                                <Text style={{ flex: 1, fontSize: 10 }}>Parameter</Text>
                                <Text style={{ flex: 1, fontSize: 10 }}>Result</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1 }}>Amount contributed by you</Text>
                                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                    <Text>
                                        {"Rs." + " " + removeCurrencySymbol(summaryData?.reportData?.amountContributed?.totalEmployeeShare) || "-"}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1 }}>PF interest Rate</Text>
                                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                    <Text>
                                        8.5%
                                    </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1 }}>TDS on Withdrawal</Text>
                                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                    <Text>
                                        {"Rs." + " " + removeCurrencySymbol(summaryData?.reportData?.tdsOnWithdrawal) || "-"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ borderTop: 1 }}>
                            <View style={{ marginLeft: 20, marginBottom: 5 }}>
                                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                                    <Text style={{ fontSize: 12 ,marginRight: 10 }}>•</Text>
                                    <Text style={{ fontSize: 12, flex: 1 }}>
                                        If the user is employed for more than 5 years throughout all the employments under this UAN,
                                        then TDS will not be deducted.
                                    </Text>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 5 }}>
                                    <Text style={{ fontSize: 12 ,marginRight: 10 }}>•</Text>
                                    <Text style={{ fontSize: 12, flex: 1 }}>
                                        If employment is less than 5 years, then TDS is applicable at the rate of 10% on total PF balance.
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ borderTop: 1, marginBottom: 40 }} />
                        <View style={{ backgroundColor: '#a8d5ea', borderTop: 1, borderBottom: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 5, marginBottom: 5, marginLeft: 8 }}>
                                Pension
                            </Text>
                        </View>
                        <View >
                            <View style={{ flexDirection: "row", marginTop: 5, marginBottom: 5 }}>
                                <Text style={{ flex: 1, fontSize: 10 }}>Parameter</Text>
                                <Text style={{ flex: 1, fontSize: 10 }}>Result</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1, }}>Total Pension Balance</Text>
                                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                    <Text>
                                        {"Rs" + " " + removeCurrencySymbol(summaryData?.reportData?.amountContributed?.totalPensionShare) || "-"}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1 }}>Lump sum Pension Withdrawal</Text>
                                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                    <Text>
                                        {"Rs" + " " + removeCurrencySymbol(summaryData?.reportData?.pensionWithdrability?.withdrawableAmount) || "-"}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', borderTop: 1 }}>
                                <Text style={{ flex: 1 }}>Monthly Pension</Text>
                                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 5 }}>
                                    {summaryData?.reportData?.pensionWithdrability?.message === "" &&
                                        <Text>
                                            {"Rs" + " " + removeCurrencySymbol(summaryData?.reportData?.pensionWithdrability?.pensionAmountPerMonth) || "-"}
                                        </Text>
                                    }
                                    {summaryData?.reportData?.pensionWithdrability?.message !== "" &&
                                        <Text>
                                            {summaryData?.reportData?.pensionWithdrability?.message}
                                        </Text>
                                    }
                                </View>
                            </View>
                        </View>
                        <View style={{ borderTop: 1 }}>
                            <View style={{ marginLeft: 20, marginBottom: 5 }}>
                                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                                    <Text style={{ fontSize: 12, marginRight: 10 }}>•</Text>
                                    <Text style={{ fontSize: 12, flex: 1 }}>
                                        Employee can withdraw entire pension share as lump sum if total employment history is
                                        less than 5 years
                                    </Text>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 5 }}>
                                    <Text style={{ fontSize: 12, marginRight: 10 }}>•</Text>
                                    <Text style={{ fontSize: 12, flex: 1 }}>
                                        If employment history is more than 5 years can pension will be available post
                                        retirement at the age of 58 years as per below calculation
                                    </Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 5 }}>
                                    <Text style={{ fontSize: 12, marginRight: 10, marginLeft: 50 }}>•</Text>
                                    <Text style={{ fontSize: 12, flex: 1 }}>
                                        Monthly Pension = Total Service x (15000/70)
                                    </Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 5 }}>
                                    <Text style={{ fontSize: 12, marginRight: 10 }}>•</Text>
                                    <Text style={{ fontSize: 12, flex: 1 }}>
                                        This pension calculation is indicative in nature, EPFO as full controlover your final pension value.
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ borderTop: 1 }}>
                            <View style={{ marginLeft: 20, marginBottom: 5 }}>
                                <Text style={{ fontSize: 24, marginTop: 12 }}>Disclaimer</Text>
                                <Text style={{ fontSize: 10, marginTop: 12 }}>
                                    The information provided in the report is as per Finright’s own research and
                                    development efforts. We do not claim any rights over the Employee Provident Fund
                                    Organisation’s proceedings, rules or processes. In any case of conflict EPFO’s
                                    latest rules will apply. Though we have taken utmost care to provide the most
                                    updated report but the information can still change depending on EPFO latest
                                    rules and thus we recommend to get the report validated by PF experts
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

            </Page>
        </Document>
    )
};

export default ReportDownloadTemplate;
