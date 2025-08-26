// import React from 'react'
// import { useState,useEffect } from 'react';
// import { Outlet,Navigate } from 'react-router-dom'
// const Super=() =>{
//     const [isAuth,setIsAuth] = useState(false); 
//     const [loading,setLoading] = useState(true);
     
//     useEffect(()=>
//     {
//        const getRouteAcces = async()=>{
//         try {
//             setLoading(true)
//             const response = await fetch(apis().getAccess,{
//                 method:'POST',
//                 body:JSON.stringify({token:localStorage.getItem(passToken)}),
//                 headers:{'Content-Type':'application/json'}
//             })
           
//             const result = await response.json()

//             if (!response.ok){
//                 throw new Error(reult?.message)
                
//             }
//             if (result?.status){
//                 setLoading(false)
//                 setIsAuth(true)
//             }


//         } catch (error) {
            
//         }
//        };
//        getRouteAcces();
//     },[])




//     if(loading){
//         return <h2>loading.....</h2>}
//         if(!isAuth){
//             return <Outlet/>
//         }else{
//             return <Navigate to={"/login"}/>
//         }
//   return (
//     <div>Super</div>
//   )
// }

// export default Super