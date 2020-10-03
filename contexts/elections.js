const majorParties = ["DEM", "REP"];

/**
 * gets all historical presidential election dates going back to 1972
 * (which would seem the earliest possible data date)
 *
 * @returns {[Date]}
 */
const presidentialElectionDates = () => {
    const startDate = new Date("1972-11-05");
    const fourYearsFromNow = new Date();
    const endDate = fourYearsFromNow.setFullYear(
        fourYearsFromNow.getFullYear() + 4
    );
    let dateArray = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
        dateArray.push(new Date(currentDate));

        let year = currentDate.getUTCFullYear() + 4;
        currentDate = new Date(`${year}-11-06`);
    }

    return dateArray;
};

/**
 * gets list of years included in the current election cycle
 * @returns {[]}
 */
const currentCycleYears = () => {
    const electionCycles = presidentialElectionDates();
    const dates = electionCycles.slice(-2);

    return yearRange(dates[0], dates[1]);
};

/**
 * gets the day after the most recent presidential election
 * @returns {Date}
 */
const currentCycleStart = () => {
    const electionCycles = presidentialElectionDates();
    const lastElectionDay = electionCycles[electionCycles.length - 2];

    lastElectionDay.setDate(lastElectionDay.getDate() + 1);
    return lastElectionDay;
};

/**
 * gets the next upcoming presidential election day
 * @returns {Date}
 */
const currentCycleEnd = () => {
    const electionCycles = presidentialElectionDates();
    return electionCycles[electionCycles.length - 1];
};

const yearRange = (startDate, endDate) => {
    const endYear = endDate.getFullYear(),
        years = [];
    let startYear = startDate.getFullYear() + 1;

    while (startYear <= endYear) {
        years.push(startYear++);
    }
    return years;
};


const getCycleDatesByEndYear = (end) => {
    const electionCycles = presidentialElectionDates();
    const index = electionCycles.findIndex(cycle => cycle.getUTCFullYear() === end);
    return electionCycles.slice(index - 1, index + 1);
};

module.exports = {
    currentCycleYears,
    currentCycleStart,
    currentCycleEnd,
    getCycleDatesByEndYear,
    majorParties
};
