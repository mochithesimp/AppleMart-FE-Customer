import React from 'react'
import DarkButton from "../../assets/Product/dark-mode-button.png";
import LightButton from "../../assets/Product/light-mode-button.png";
const DarkMode = () => {
    const [theme,setTheme] = React.useState(  localStorage.getItem("theme") ?? "light"
);
    const element = document.documentElement; //access to html
    

    React.useEffect(() => {
        localStorage.setItem("theme", theme);
        if(theme === "dark"){
            element.classList.add("dark");
            element.classList.add("dark");
        } else {
            element.classList.remove("light");
            element.classList.remove("dark");
        }
    },[theme]);

  return (
    <div className='relative'>
        <img
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
        src={LightButton} alt=""
    className={`w-12 cursor-pointer absolute right-0 ${theme === 'dark' ? "opacity-0" : "opacity-100" } transition-all duration-300`} />
    <img
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    src={DarkButton} alt=""
    className={`w-12 cursor-pointer `} />
    </div>
  )
}

export default DarkMode