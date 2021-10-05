import React, {useState} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

const DataSourceListItem = ({val, connectedSources}) => {
  const renderSourceAction = (key) => {
    let currentSource = connectedSources.filter(
      (item) => item.dataSource === key
    )[0]
      ? connectedSources.filter((item) => item.dataSource === key)[0]
      : {};
    let currentSourceStatus =
      currentSource && currentSource['authorized'] ? 'Authorized' : 'connect';
    let authLink =
      currentSource && currentSource['authLink']
        ? currentSource['authLink']
        : undefined;
    return (
      <div>
        {currentSourceStatus == 'connect' && key !== 'WHATSAPP' ? (
          <a
            className={key === 'WHATSAPP' ? 'is-default' : 'is-success'}
            style={{
              borderRadius: 12,
              padding: '4px 8px',
              height: 'auto',
              color: '#fff',
            }}
            href={authLink}
            target="_blank"
          >
            Authorize
          </a>
        ) : (
          <button
            className={
              key === 'WHATSAPP' || currentSource['authorized']
                ? 'is-default'
                : 'is-success'
            }
            style={{
              borderRadius: 12,
              padding: '4px 8px',
              height: 'auto',
            }}
          >
            {key === 'WHATSAPP' ? 'Default' : currentSourceStatus}
          </button>
        )}
      </div>
    );
  };
  return (
    <ListItem>
      <ListItemAvatar
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img style={{width: 30, height: 30}} src={val[1]} />
      </ListItemAvatar>
      <ListItemText primary={val[0] === 'GOOGLE_FIT' ? 'GOOGLE FIT' : val[0]} />
      {renderSourceAction(val[0])}
    </ListItem>
  );
};

export default DataSourceListItem;
