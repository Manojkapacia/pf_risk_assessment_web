export const ConvertPeriod = (period) => {
    // Mapping months to their numeric equivalents
    const months = {
        Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
        Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
    };

    // Split the period into start and end parts
    const [start, end] = period.split(" - ");

    // Helper function to convert "Month YYYY" to "MM/YYYY"
    const formatDate = (date) => {
        if (!date || date.trim().toLowerCase() === "n/a") return "NA";
        if (date.trim().toLowerCase() === "present") return "Present";
        const [month, year] = date.split(" ");
        return `${months[month]}/${year}`;
    };

    // Convert the start and end dates
    const startDate = formatDate(start);
    const endDate = formatDate(end);

    // Return the formatted string
    return `${startDate} - ${endDate}`;
};
