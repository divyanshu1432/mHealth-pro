import React, {useState} from 'react';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';

const ScrollableList = ({
  children,
  scrollToWidth,
  source = 'not-defined',
  scrollSource = 'unknown',
}) => {
  let scrollingDiv = React.createRef();
  const [stateObject, setStateObject] = useState({
    scrolledToRight: false,
    scrolledToLeft: true,
  });
  const handleScroll = (event) => {
    event.persist();
    let updatedObj = {...stateObject};
    if (event.target.scrollLeft === 0) {
      updatedObj['scrolledToLeft'] = true;
      updatedObj['scrolledToRight'] = false;
    } else if (
      event.target.scrollLeft + event.target.offsetWidth ===
      event.target.scrollWidth
    ) {
      updatedObj['scrolledToLeft'] = false;
      updatedObj['scrolledToRight'] = true;
    } else {
      updatedObj['scrolledToLeft'] = false;
      updatedObj['scrolledToRight'] = false;
    }
    setStateObject(updatedObj);
  };
  const scrollIt = (type) => {
    let scrollingWidth = scrollToWidth
      ? scrollToWidth
      : scrollSource === 'event-gallery'
      ? 1250
      : 100;
    if (scrollingDiv) {
      type === 'right'
        ? scrollingDiv.current.scrollBy({
            left: scrollingWidth,
            top: 0,
            behavior: 'smooth',
          })
        : scrollingDiv.current.scrollBy({
            left: -scrollingWidth,
            top: 0,
            behavior: 'smooth',
          });
    }
  };
  return (
    <div className="Scrollable-List">
      {!stateObject.scrolledToLeft && (
        <div
          className="scrollable-list-icon scrollable-list-icon-left"
          style={source === 'home-page' ? {backgroundColor: 'transparent'} : {}}
        >
          <ChevronLeftRoundedIcon
            style={{cursor: 'pointer'}}
            onClick={() => scrollIt('left', scrollingDiv, 100)}
          />
        </div>
      )}
      {!stateObject.scrolledToRight && (
        <div
          className="scrollable-list-icon scrollable-list-icon-right"
          style={source === 'home-page' ? {backgroundColor: 'transparent'} : {}}
        >
          <ChevronRightRoundedIcon
            style={{cursor: 'pointer'}}
            onClick={() => scrollIt('right', scrollingDiv, 100)}
          />
        </div>
      )}
      <div
        onScroll={handleScroll}
        ref={scrollingDiv}
        className="challenges-list"
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollableList;
