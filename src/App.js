import "./App.css";

import React, { lazy, Suspense } from "react";
import {
  Route,
  Redirect,
  Switch,
  useLocation,
  useHistory
} from "react-router-dom";

const Login = lazy(() => import("./components/Login/Login"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Profile = lazy(() => import("./components/Profile"));
const ResetPin = lazy(() => import("./components/ResetPin"));
const DataSource = lazy(() => import("./components/DataSourceConnect"));
const EventManagement = lazy(() => import("./components/EventManagement"));
const UpcomingEvents = lazy(() => import("./components/UpcomingEvents"));
const Logout = lazy(() => import("./components/Logout"));
const Activities = lazy(() => import("./components/Activities/Activities"));
const MisReport = lazy(() => import("./components/MisReport"));
import axios from "axios";

const App = () => {
  const location = useLocation();
  const history = useHistory();

  const pages =
    localStorage.getItem("role") && localStorage.getItem("role") !== "Customer"
      ? [
          {
            pageLink: "/login",
            view: Login,
            displayName: "Login",
            showInNavbar: true
          },
          {
            pageLink: "/dashboard",
            view: Dashboard,
            displayName: "Dashboard",
            showInNavbar: true
          },
          {
            pageLink: "/eventmanagement",
            view: EventManagement,
            displayName: "Event Management",
            showInNavbar: true
          },
          {
            pageLink: "/activities",
            view: Activities,
            displayName: "Activities",
            showInNavbar: true
          },
          {
            pageLink: "/",
            view: UpcomingEvents,
            displayName: "UpcomingEvents",
            showInNavbar: true
          },
          {
            pageLink: "/profile",
            view: Profile,
            displayName: "Profile",
            showInNavbar: true
          },
          {
            pageLink: "/resetpin",
            view: ResetPin,
            displayName: "Reset Pin",
            showInNavbar: true
          },
          {
            pageLink: "/report",
            view: MisReport,
            displayName: "Reset Pin",
            showInNavbar: true
          },
          {
            pageLink: "/source",
            view: DataSource,
            displayName: "Data Source",
            showInNavbar: true
          },
          {
            pageLink: "/logout",
            view: Logout,
            displayName: "Logout",
            showInNavbar: false
          }
        ]
      : [
          {
            pageLink: "/login",
            view: Login,
            displayName: "Login",
            showInNavbar: true
          },
          {
            pageLink: "/dashboard",
            view: Dashboard,
            displayName: "Dashboard",
            showInNavbar: true
          },
          {
            pageLink: "/",
            view: UpcomingEvents,
            displayName: "UpcomingEvents",
            showInNavbar: true
          },
          {
            pageLink: "/profile",
            view: Profile,
            displayName: "Profile",
            showInNavbar: true
          },
          {
            pageLink: "/resetpin",
            view: ResetPin,
            displayName: "Reset Pin",
            showInNavbar: true
          },
          {
            pageLink: "/source",
            view: DataSource,
            displayName: "Data Source",
            showInNavbar: true
          },
          {
            pageLink: "/logout",
            view: Logout,
            displayName: "Logout",
            showInNavbar: false
          }
        ];
  function isLoggedIn() {
    if (localStorage.getItem("token")) {
      return true;
    }
    return false;
  }

  axios.interceptors.response.use(
    function (response) {
      const responseCode = response?.data?.response?.responseCode;
      if ([13, 14, 20, 21, 22].includes(responseCode)) {
        localStorage.clear();
        history.push("/");
      }
      return response;
    },
    function (error) {
      // Do something with response error
      return Promise.reject(error);
    }
  );

  return (
    <div className='App'>
      <Suspense fallback={<div />}>
        <Switch location={location}>
          {pages.map((page, index) => {
            if (isLoggedIn()) {
              return (
                <Route
                  exact
                  path={page.pageLink}
                  render={() => <page.view />}
                  key={index}
                />
              );
            } else {
              if (history.location.pathname === "/login") {
                return (
                  <Route
                    exact
                    path={"/login"}
                    render={() => <Login />}
                    key={0}
                  />
                );
              } else {
                return (
                  <Route
                    exact
                    path={"/"}
                    render={() => <UpcomingEvents />}
                    key={0}
                  />
                );
              }
            }
          })}
          <Redirect to='/' />
        </Switch>
      </Suspense>
    </div>
  );
};

export default App;
