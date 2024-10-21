import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
  const { theme } = useSelector(state => state.theme);
  
  return (
    <div className={`${theme} min-h-screen`}>
      <div className="min-h-screen bg-white  text-gray-700 dark:bg-gray-700 dark:text-gray-200"> 
        {children}
      </div>
    </div>
  );
}
