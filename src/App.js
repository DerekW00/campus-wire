import CreateEvent from './components/CreateEvent';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Calendar from './components/Calendar';
import SignIn from './components/SignIn';
import Landing from './components/Landing';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import Account from './components/Account';
import MyEvents from './components/MyEvent';
import Welcome from './components/Welcome';
import MyFavorites from './components/MyFavorites';
import FigmaCalendar from './components/FigmaCalendar';
import Chat from './components/Chat';
import Search from './components/Search';
import WoOchat from './components/WoOchat';
//import Calendar2 from './components/Calendar/Calendar';

function App() {
  return (
    <div>
      <Router>
          <Routes>
            <Route exact path='/' element={<Landing />} />
            <Route path='/CreateEvent' element={<CreateEvent />} />
            <Route path='/Calendar' element={<Calendar />} />
            <Route path='/SignIn' element={<SignIn />} />
            <Route path='/Home' element={<Home />} />
            <Route path='/SignUp' element={<SignUp />} />
            <Route path='/Profile' element={<Profile />} />
            <Route path='/Account' element={<Account />} />
            <Route path='/MyEvents' element={<MyEvents />} />
            <Route path='/Welcome' element={<Welcome />} />
            <Route path='/MyFavorites' element={<MyFavorites />} />
            <Route path='/FigmaCalendar' element={<FigmaCalendar />} />
            <Route path='/Chat' element={<Chat />} />
            <Route path='/WoOchat' element={<WoOchat />} />
            <Route path='/Search' element={<Search />} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
