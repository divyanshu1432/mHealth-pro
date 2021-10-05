import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import {withStyles} from '@material-ui/core/styles';
import * as Icon from 'react-feather';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

const TopUserDetails = ({updateAgain = false}) => {
  let history = useHistory();
  const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
    },
  })((props) => {
    const [avatarImg, setAvatrImg] = useState('');

    return (
      <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        avatarImg={avatarImg}
        userDetails={userDetails}
        updateAgain={updateAgain}
        {...props}
      />
    );
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    history.push('/');
  };

  const [userDetails, setUserDetails] = useState({
    aliasName: '',
    avatarImg: '',
  });
  useEffect(() => {
    setUserDetails({
      aliasName: localStorage.aliasName,
      avatarImg: localStorage.avatarImg,
    });
  }, [localStorage.aliasName, localStorage.avatarImg, updateAgain]);
  return (
    <div>
      <div className="Avatar-Container" onClick={handleClick}>
        <div className="dashboard-avatar">
          <Avatar
            src={userDetails.avatarImg}
            style={{
              width: 30,
              height: 30,
              border: '2px solid #f8f8f8',
            }}
          />
        </div>
        <div>
          {localStorage.getItem('aliasName')
            ? userDetails.aliasName
            : `${localStorage.getItem('firstName')} ${localStorage.getItem(
                'lastName'
              )}`}
        </div>
        <Icon.ChevronDown />
      </div>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <div
          style={{
            display: 'flex',
            paddingLeft: 10,
            paddingRight: 10,
            width: 120,
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            outline: 'none !important',
          }}
          onClick={(e) => {
            handleLogout(e);
          }}
        >
          <span style={{marginRight: 5}}>
            <Icon.LogOut />
          </span>
          <ListItemText primary="Logout" />
        </div>
      </StyledMenu>
    </div>
  );
};

export default TopUserDetails;
