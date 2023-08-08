import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'
import GetSession from './components/Sessions/GetSession'
import GetSessions from './components/Sessions/GetSessions'
import GetGyms from './components/Gyms/GetGyms'
import GetGym from './components/Gyms/GetGym'
import GetReviews from './components/Reviews/GetReviews'
import GetReview from './components/Reviews/GetReview'
import GetMessages from './components/Messages/GetMessages'
import GetMessage from './components/Messages/GetMessage'
import GetPeople from './components/People/GetPerson'

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector((state) => state.session.user);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <Switch>
        <Route exact path="/">
          {user ? <Redirect to="/user/dashboard/" /> : <LandingPage />}
        </Route>
        <Route exact path="/user/dashboard/">
          {user ? <Dashboard /> : <Redirect to="/" />}
        </Route>
        <Route path="/sessions/:id">
          <GetSession />
        </Route>
        <Route path="/sessions/">
          <GetSessions />
        </Route>
        <Route path="/users/:id">
          <GetPeople />
        </Route>
        <Route path="/gyms/:id">
          <GetGym />
        </Route>
        <Route path="/gyms/">
          <GetGyms />
        </Route>
        <Route path="/reviews/:id">
          <GetReview />
        </Route>
        <Route path="/reviews/">
          <GetReviews />
        </Route>
        <Route path="/messages/:id">
          <GetMessage />
        </Route>
        <Route path="/messages/">
          <GetMessages />
        </Route>
        <Route path="*">
          {user ? <Redirect to="/user/dashboard/" /> : <Redirect to="/" />}
        </Route>
      </Switch>
    </>
  );
}

export default App;
