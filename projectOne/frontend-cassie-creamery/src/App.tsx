import React from 'react';
import './App.css';
import Routes from './components/Routes';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import userService from './service/user.service';
import {getUser} from './store/actions/user';
import Header from './components/Header';
import Nav from './components/Nav';
import TuitionRmbtForm from './components/TuitionRmbtForm';
import UserHome from './components/UserHome';
import EmployeeNav from './components/EmployeeNav';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
      userService.getLogin().then((user) => {
          dispatch(getUser(user));
          console.log('user inside useEffect in APP.TSX after dispatch getUser', user);
      });
  }, [dispatch]);
  return (
    <div className="App">
            <Header />
      {/* <Nav /> */}
      <Routes />
      {/* <UserHome /> */}
    </div>
  );
}

export default App;
