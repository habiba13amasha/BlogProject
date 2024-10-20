import {useSelector} from 'react-redux'
export default function ThemeProvider({children}) {
    const {theme}=useSelector(state=>state.theme);
  return (
    <div className={theme}>
       <div className='min-h-screen bg-white text-gray-700 dark:text-gray-500 dark:bg[rgb(2, 3, 4)]'> 
         {children}
       </div>
    </div>
  )
}
