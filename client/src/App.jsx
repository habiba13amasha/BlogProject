import { BrowserRouter , Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from "./pages/About"
import Dashboard from "./pages/Dashboard"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Projects from "./pages/Projects"
import Header from './components/Header'
import FooterCom from './components/FooterCom'
export default function App() {
  return (
  <>
  <BrowserRouter>
  <Header/>   {/*to show header in all pages */}
   <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/about' element={<About/>}/>
    <Route path='/dashboard' element={<Dashboard/>}/>
    <Route path='/sign-in' element={<SignIn/>}/>
    <Route path='/sign-up' element={<SignUp/>}/>
    <Route path='/projects' element={<Projects/>}/>
   </Routes>
   <FooterCom/>
  </BrowserRouter>
  </>
  )
}
