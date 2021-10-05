import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import {APP} from '../utils/appConfig';

const LeaderBoardFilters = ({
  setTableRowData,
  leaderBoardData,
  filters,
  setFilters,
  handlefilterPopoverClose,
}) => {
  const [filterState, setFilterState] = useState({
    gender: '',
    age: [0, 100],
    city: '',
    pinCode: '',
    state: '',
    activeDays: [0, 365],
  });

  useEffect(() => {
    // leaderBoardData.map(item => item.totalParticipantsDays) and take max of this
    setFilterState(filters);
  }, []);
  return (
    <div className="leaderboard-table-filter-wrapper">
      <div>
        <div className="leaderboard-table-filter-list-item">
          <div className="leaderboard-table-filter-list-item-label">
            Gender:
          </div>
          <Select
            value={filterState.gender}
            onChange={(event) => {
              setFilterState((prevState) => {
                return {
                  ...prevState,
                  gender: event.target.value,
                };
              });
            }}
            displayEmpty
            inputProps={{'aria-label': 'Without label'}}
          >
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="male">Male</MenuItem>
          </Select>
        </div>
        <div className="leaderboard-table-filter-list-item">
          <div className="leaderboard-table-filter-list-item-label">Age:</div>
          <Slider
            value={filterState.age}
            aria-labelledby="range-slider"
            onChange={(event, newValue) => {
              setFilterState((prevState) => {
                return {
                  ...prevState,
                  age: newValue,
                };
              });
            }}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={100}
            marks={[
              {value: 0, label: 0},
              {value: 100, label: 100},
            ]}
          />
        </div>
        <div
          className="leaderboard-table-filter-list-item"
          style={{marginBottom: 0}}
        >
          <div className="leaderboard-table-filter-list-item-label">State:</div>
          <Select
            value={filterState.state}
            onChange={(event) => {
              setFilterState((prevState) => {
                return {
                  ...prevState,
                  state: event.target.value,
                };
              });
            }}
            displayEmpty
            inputProps={{'aria-label': 'Without label'}}
          >
            {APP.filterStates.map((item) => {
              return (
                <MenuItem value={item} key={item}>
                  {item}
                </MenuItem>
              );
            })}
          </Select>
        </div>
        <div>
          <TextField
            id="standard-basic"
            label="City"
            value={filterState.city}
            onChange={(event) => {
              setFilterState((prevState) => {
                return {
                  ...prevState,
                  city: event.target.value,
                };
              });
            }}
          />
        </div>
        <div>
          <TextField
            type="number"
            id="standard-basic"
            label="PinCode"
            value={filterState.pinCode}
            onChange={(event) => {
              setFilterState((prevState) => {
                return {
                  ...prevState,
                  pinCode: event.target.value,
                };
              });
            }}
          />
        </div>
      </div>
      <div className="leaderboard-table-filter-list-item">
        <div className="leaderboard-table-filter-list-item-label">
          Active Days:
        </div>
        <Slider
          value={filterState.activeDays}
          aria-labelledby="range-slider"
          onChange={(event, newValue) => {
            setFilterState((prevState) => {
              return {
                ...prevState,
                activeDays: newValue,
              };
            });
          }}
          valueLabelDisplay="auto"
          step={1}
          min={0}
          max={365}
          marks={[
            {value: 0, label: 0},
            {value: 365, label: 365},
          ]}
        />
      </div>

      <div
        style={{
          width: 'max-content',
          marginTop: 10,
          marginLeft: 'auto',
          padding: 0,
          height: 24,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button
          color="secondary"
          onClick={() => {
            setFilterState({
              gender: '',
              age: [0, 100],
              city: '',
              pinCode: '',
              state: '',
              activeDays: [0, 365],
            });
            setFilters({
              gender: '',
              age: [0, 100],
              city: '',
              pinCode: '',
              state: '',
              activeDays: [0, 365],
            });

            if (leaderBoardData && leaderBoardData['data']) {
              let pinnedUsers = leaderBoardData['data']['pinUserRank']
                ? leaderBoardData['data']['pinUserRank'].map(
                    (item) => item.userId
                  )
                : [];

              if (leaderBoardData['data']['rankWiseBoard']) {
                if (leaderBoardData['data']['sessionUserRank']) {
                  setTableRowData([
                    leaderBoardData['data']['sessionUserRank'],
                    ...leaderBoardData['data']['rankWiseBoard'].filter(
                      (item) =>
                        pinnedUsers.includes(item.userId) &&
                        item.userId !==
                          leaderBoardData['data']['sessionUserRank']['userId']
                    ),
                    ...leaderBoardData['data']['rankWiseBoard'].filter(
                      (item) =>
                        !pinnedUsers.includes(item.userId) &&
                        item.userId !==
                          leaderBoardData['data']['sessionUserRank']['userId']
                    ),
                  ]);
                } else {
                  setTableRowData([
                    ...leaderBoardData['data']['rankWiseBoard'].filter((item) =>
                      pinnedUsers.includes(item.userId)
                    ),
                    ...leaderBoardData['data']['rankWiseBoard'].filter(
                      (item) => !pinnedUsers.includes(item.userId)
                    ),
                  ]);
                }
              }
            }
            handlefilterPopoverClose();
          }}
        >
          Reset
        </Button>
        <Button
          color="primary"
          onClick={() => {
            setFilters(filterState);
            if (leaderBoardData?.data?.rankWiseBoard) {
              const combineFilters =
                (...filters) =>
                (item) => {
                  return filters
                    .map((filter) => filter(item))
                    .every((x) => x === true);
                };

              const genderFilter = (item) => {
                return (
                  filterState.gender.toLowerCase() ===
                  item?.gender?.toLowerCase()
                );
              };

              const ageFilter = (item) => {
                return (
                  item.age >= filterState.age[0] &&
                  item.age <= filterState.age[1]
                );
              };

              const cityFilter = (item) => {
                return (
                  item?.city
                    ?.toLowerCase()
                    .indexOf(filterState.city.toLowerCase()) > -1
                );
              };

              const stateFilter = (item) => {
                return (
                  filterState.state.toLowerCase() === item?.state?.toLowerCase()
                );
              };

              const pincodeFilter = (item) => {
                return parseInt(filterState.pinCode) === item?.pinCode;
              };

              const activeDays = (item) => {
                return (
                  parseInt(filterState.activeDays) ===
                  item?.totalParticipationDays
                );
              };

              const result = leaderBoardData.data.rankWiseBoard.filter(
                combineFilters(
                  filterState.gender !== ''
                    ? genderFilter
                    : () => {
                        return true;
                      },
                  ageFilter,
                  filterState.city !== ''
                    ? cityFilter
                    : () => {
                        return true;
                      },
                  filterState.state !== ''
                    ? stateFilter
                    : () => {
                        return true;
                      },
                  filterState.pinCode !== ''
                    ? pincodeFilter
                    : () => {
                        return true;
                      },
                  filterState.activeDays !== ''
                    ? activeDays
                    : () => {
                        return true;
                      }
                )
              );

              setTableRowData(result);
              handlefilterPopoverClose();
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default LeaderBoardFilters;
