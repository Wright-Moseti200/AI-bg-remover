import React,{useState} from 'react'
import { createContext } from 'react'
import  {useAuth} from '@clerk/clerk-react';
import axios from 'axios';
export const AppContext = createContext();
  import { toast } from 'react-toastify';

const AppContextProvider = (props) => {
    const [credit ,setCredit] = useState(false);
    let [image,setImage] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const {getToken} = useAuth();
    const loadCreditsData = async()=>{
        try{
            const token = getToken();
            const {data} = await axios.get(backendUrl+'api/user/credits',{headers:{token}});
            if(data.success){
                setCredit(data.credits);
                console.log(data.credits);
            }
        }
        catch(error){
            console.log(error.message);
            toast.error(error);
        }
    }
    const value ={credit,setCredit,loadCreditsData}
  return (
   <AppContext.Provider value={value}>
    {props.childern}
   </AppContext.Provider>
  )
}

export default AppContextProvider;