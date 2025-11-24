// import { useState, useEffect } from "react";
// import { tokenManager, logout } from "./authUtils"; 

// export const useAuth = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = () => {
//       const token = tokenManager.getAccessToken();
//       setIsAuthenticated(!!token);
//       setIsLoading(false);
//     };

//     checkAuth();
//   }, []);

//   return {
//     isAuthenticated,
//     isLoading,
//     logout,
//   };
// };
