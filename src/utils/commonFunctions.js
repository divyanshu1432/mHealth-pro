import confetti from 'canvas-confetti';
import moment from 'moment';
export const celebrate = () => {
  var count = 200;
  var defaults = {
    origin: {y: 0.7, x: 0.8},
  };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

export const getDateDifference = (a, b) => {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  // a and b are javascript Date objects
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

export const getLeaderBoardHeading = (currentEvent, currentTab) => {
  if (typeof currentEvent == 'object' && Object.keys(currentEvent).length > 0) {
    const date1 = moment(currentEvent.challengeStartDate, 'YYYY-MM-DD h:mm:ss');
    const date2 = moment(new Date(), 'YYYY-MM-DD h:mm:ss');
    const Start_Date_Difference = date2.diff(date1, 'days', true);
    let isSingleDayEvent =
      moment(currentEvent.challengeEndDate, 'YYYY-MM-DD h:mm:ss').diff(
        moment(currentEvent.challengeStartDate, 'YYYY-MM-DD h:mm:ss'),
        'days'
      ) == 0;

    let daysToGo = moment(new Date(), 'YYYY-MM-DD h:mm:ss').diff(
      moment(currentEvent.challengeStartDate, 'YYYY-MM-DD h:mm:ss'),
      'days'
    );

    let heading = currentTab;
    if (currentEvent.timePeriod == 'PAST' || !currentEvent.isActive) {
      heading = heading + ' - Event is closed';
    }

    if (currentEvent.timePeriod == 'CURRENT') {
      if (currentEvent.isParticipated) {
        heading = isSingleDayEvent
          ? 'Event ends today'
          : heading +
            ' - You are on day ' +
            Math.abs(Math.ceil(Start_Date_Difference));
      }
    }

    if (currentEvent.timePeriod == 'FUTURE') {
      heading = heading + ' - ' + Math.abs(daysToGo) + ' days to go';
    }
    return heading;
  } else {
    return currentTab;
  }
};

export const checkForFalsy = (data) => {
  if (
    !data ||
    data == '' ||
    data == undefined ||
    data == null ||
    data == 'null' ||
    data == 'undefined'
  ) {
    return true;
  }
  return false;
};

export const getWeekDayByNumber = (number) => {
  const WeekDay = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tues',
    3: 'Wed',
    4: 'Thurs',
    5: 'Fri',
    6: 'Sat',
  };
  return WeekDay[number] || number;
};

export const formatDate = (date) => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};
