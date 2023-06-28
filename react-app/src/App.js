import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'
import GetSession from './components/Sessions/GetSession'
import GetSessions from './components/Sessions/GetSessions'

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
        <Route path="/login" >
          <LoginFormPage />
        </Route>
        <Route path="/signup">
          <SignupFormPage />
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
      </Switch>
    </>
  );
}

export default App;
