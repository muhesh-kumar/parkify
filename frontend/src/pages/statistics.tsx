import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const today = new Date();

const Statistics = () => {
  const randomValues = getRange(365).map((index) => {
    return {
      date: shiftDate(today, -index),
      count: getRandomInt(1, 5),
    };
  });

  return (
    <div className="min-w-[1500px] md:min-w-full">
      <CalendarHeatmap
        startDate={shiftDate(today, -365)} // last 1 year data
        endDate={today}
        values={randomValues}
        classForValue={(value) => {
          if (!value) {
            return 'color-empty';
          }
          return `color-github-${value.count}`;
        }}
        tooltipDataAttrs={(value: {
          date: { toISOString: () => string | any[] };
          count: any;
        }) => {
          return {
            'data-tip': `${value.date.toISOString().slice(0, 10)} has count: ${
              value.count
            }`,
          };
        }}
        showWeekdayLabels={true}
        onClick={(value) =>
          alert(`Clicked on value with count: ${value.count}`)
        }
      />
      {/* <ReactTooltip /> */}
    </div>
  );
};

const shiftDate = (date: string | number | Date, numDays: number) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
};

const getRange = (count: number) => {
  return Array.from({ length: count }, (_, i) => i);
};

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default Statistics;
