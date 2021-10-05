import {
  SLIDE_IN,
  SLIDE_OUT,
  SLIDE_IN_MOBILE,
  SLIDE_OUT_MOBILE
} from "../animations";

import React, { useState, useCallback, useRef } from "react";
import * as Icon from "react-feather";
import { Link, useHistory } from "react-router-dom";
import { useSpring, useTransition, animated } from "react-spring";
import { useLockBodyScroll, useWindowSize } from "react-use";
import LogoPng from "../assets/logo.png";
import SpeakerNotesIcon from "@material-ui/icons/SpeakerNotes";
function Navbar() {
  let history = useHistory();
  const pages =
    localStorage.getItem("role") && localStorage.getItem("role") !== "Customer"
      ? [
          {
            pageLink: "/dashboard",
            displayName: "Dashboard",
            showInNavbar: true
          },
          {
            pageLink: "/eventmanagement",
            displayName: "Event Management",
            showInNavbar: true
          },
          {
            pageLink: "/activities",
            displayName: "Programs",
            showInNavbar: true
          },
          {
            pageLink: "/report",
            displayName: "Reports",
            showInNavbar: true
          },
          {
            pageLink: "/profile",
            displayName: "Profile",
            showInNavbar: true
          },
          {
            pageLink: "/resetpin",
            displayName: "ResetPin",
            showInNavbar: true
          },

          {
            pageLink: "/source",
            displayName: "DataSource",
            showInNavbar: true
          },
          {
            pageLink: "/logout",
            displayName: "Logout",
            showInNavbar: true
          }
        ]
      : [
          {
            pageLink: "/dashboard",
            displayName: "Dashboard",
            showInNavbar: true
          },
          {
            pageLink: "/profile",
            displayName: "Profile",
            showInNavbar: true
          },
          {
            pageLink: "/resetpin",
            displayName: "ResetPin",
            showInNavbar: true
          },
          {
            pageLink: "/source",
            displayName: "DataSource",
            showInNavbar: true
          },
          {
            pageLink: "/logout",
            displayName: "Logout",
            showInNavbar: true
          }
        ];

  const [expand, setExpand] = useState(false);

  useLockBodyScroll(expand);
  const windowSize = useWindowSize();

  const [spring, set, stop] = useSpring(() => ({ opacity: 0 }));
  set({ opacity: 1 });
  stop();

  const transitions = useTransition(expand, null, {
    from: windowSize.width < 769 ? SLIDE_IN_MOBILE : SLIDE_IN,
    enter: windowSize.width < 769 ? SLIDE_OUT_MOBILE : SLIDE_OUT,
    leave: windowSize.width < 769 ? SLIDE_IN_MOBILE : SLIDE_IN,
    config: { mass: 1, tension: 210, friction: 26 }
  });

  const handleMouseEnter = useCallback(() => {
    if (windowSize.width > 769) {
      setExpand(true);
    }
  }, [windowSize.width]);

  return (
    <animated.div className='Navbar' style={spring}>
      <div className='navbar-middle'>
        <img src={LogoPng} />
        {/* <Link to="/" onClick={setExpand.bind(this, false)}> */}
        mHealth
        {/* </Link> */}
      </div>

      <div
        className='navbar-right'
        onMouseEnter={handleMouseEnter}
        {...(windowSize.width < 769 && {
          onClick: setExpand.bind(this, !expand)
        })}
      >
        {windowSize.width < 769 && <span>{expand ? "Close" : "Menu"}</span>}

        {windowSize.width > 769 && (
          <React.Fragment>
            <Link to='/dashboard'>
              <span>
                <Icon.Home {...activeNavIcon("/dashboard")} />
              </span>
            </Link>
            {localStorage.getItem("role") &&
              localStorage.getItem("role") !== "Customer" && (
                <>
                  <Link to='/eventmanagement'>
                    <span>
                      <Icon.Archive {...activeNavIcon("/eventmanagement")} />
                    </span>
                  </Link>
                  <Link to='/activities'>
                    <span>
                      <Icon.PlusSquare {...activeNavIcon("/activities")} />
                    </span>
                  </Link>
                  <Link to='/report'>
                    <span>
                      <Icon.Book {...activeNavIcon("/report")} />
                    </span>
                  </Link>
                </>
              )}
            <Link
              to='/profile'
              onClick={(e) => {
                e.preventDefault();
                history.push("/profile");
              }}
            >
              <span>
                <Icon.User {...activeNavIcon("/profile")} />
              </span>
            </Link>
            <Link to='/resetpin'>
              <span>
                <Icon.RefreshCcw {...activeNavIcon("/resetpin")} />
              </span>
            </Link>

            <Link to='/source'>
              <span>
                <Icon.Database {...activeNavIcon("/source")} />
              </span>
            </Link>
            <Link
              to='/logout'
              onClick={(e) => {
                e.preventDefault();
                localStorage.clear();
                history.push("/");
              }}
            >
              <span>
                <Icon.LogOut {...activeNavIcon("/logout")} />
              </span>
            </Link>
          </React.Fragment>
        )}
      </div>

      {transitions.map(({ item, key, props }) =>
        item ? (
          <animated.div key={key} style={props}>
            <Expand {...{ pages, setExpand, windowSize, history }} />
          </animated.div>
        ) : (
          <animated.div key={key} style={props}></animated.div>
        )
      )}
    </animated.div>
  );
}

function Expand({ pages, setExpand, windowSize, history }) {
  const expandElement = useRef(null);
  const handleMouseLeave = useCallback(() => {
    windowSize.width > 768 && setExpand(false);
  }, [setExpand, windowSize.width]);

  return (
    <div className='expand' ref={expandElement} onMouseLeave={handleMouseLeave}>
      {pages.map((page, i) => {
        if (page.showInNavbar === true) {
          return (
            <Link
              to={page.pageLink}
              key={i}
              onClick={(e) => {
                if (page.displayName == "Blog" || page.displayName == "About") {
                  e.preventDefault();
                }
                if (page.displayName === "Logout") {
                  localStorage.clear();
                  history.push("/");
                }
              }}
              {...(windowSize.width < 769 && {
                onClick: setExpand.bind(this, false)
              })}
            >
              <span
                {...navLinkProps(page.pageLink, page.animationDelayForNavbar)}
              >
                {page.displayName}
              </span>
            </Link>
          );
        }
        return null;
      })}
    </div>
  );
}

export default Navbar;

const navLinkProps = (path, animationDelay) => ({
  className: `${window.location.pathname === path ? "focused" : ""}`
});

const activeNavIcon = (path) => ({
  style: {
    stroke: window.location.pathname === path ? "#4c75f2" : ""
  }
});
