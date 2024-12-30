export const getReportSubmissionMessage = () => {
    const now = new Date();

    // Helper function to check if current time is in a specific range
    const isBetween = (startHour, startMinute, endHour, endMinute) => {
        const start = new Date(now);
        start.setHours(startHour, startMinute, 0, 0);

        const end = new Date(now);
        end.setHours(endHour, endMinute, 0, 0);

        return now >= start && now <= end;
    };

    if (isBetween(19, 0, 23, 59)) {
        // Between 7:00 PM and 12:00 AM
        return "by 12.00 noon tomorrow";
    } else if (isBetween(0, 1, 8, 59)) {
        // Between 12:01 AM and 9:00 AM
        return "by 12.00 noon today";
    }

    return "within 4 hours"; // Default case, if required
};
