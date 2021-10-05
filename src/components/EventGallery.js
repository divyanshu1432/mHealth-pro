import React from 'react';
import ScrollableList from './ScrollableList';
import EventImageCard from './EventImageCard';

const EventGallery = ({eventGalleryData, fetchEventGallery}) => {
  return (
    <div className="EventGallery">
      <div className="challenges-heading">Event Gallery</div>
      <div className="event-image-list-wrapper">
        {eventGalleryData.loading ? (
          <ScrollableList>
            <div className="event-image-card"></div>
            <div className="event-image-card"></div>
            <div className="event-image-card"></div>
            <div className="event-image-card"></div>
          </ScrollableList>
        ) : eventGalleryData.data.length > 0 ? (
          <ScrollableList scrollSource="event-gallery">
            {eventGalleryData.data.map((item, index) => {
              return (
                <EventImageCard
                  data={item}
                  key={index}
                  fetchEventGallery={fetchEventGallery}
                />
              );
            })}
          </ScrollableList>
        ) : (
          <p style={{textAlign: 'center', margin: '100px 0', color: '#8e8e8e'}}>
            {eventGalleryData.message === 'SUCCESS'
              ? 'Data is not present'
              : eventGalleryData.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default EventGallery;
