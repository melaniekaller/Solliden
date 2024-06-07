import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import ResetConfirmationPage from "./pages/ResetConfirmationPage";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from "./pages/Layout";
import Villkor from "./pages/Villkor";


export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout/>}>
          <Route path='/LoginPage' element={<LoginPage/>}></Route>
          <Route path='/RegisterPage' element={<RegisterPage/>}></Route>
          <Route path='/PasswordResetPage' element={<PasswordResetPage/>}></Route>
          <Route path='/ResetConfirmationPage' element={<ResetConfirmationPage/>}></Route>
          <Route path='/Villkor' element={<Villkor/>}></Route>
        </Route>
        {/* <Route path="/" element={<MyPageLayout/>}> */}
          {/* <Route path='/Dashboard' element={<Dashboard/>}></Route> */}
          {/* <Route path='/MyProfilePage' element={<MyProfilePage/>}></Route> */}
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
};