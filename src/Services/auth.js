import axios from 'axios';

// export const login = async (endPoint, username, password) => {
//   try {
//     const response = await fetch(endPoint, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({username, password}),
//     });
//
//     if (!response.ok) {
//       throw new Error('Login failed');
//     }
//
//     const data = await response.json();
//     return data.token; // Assuming the API returns a token
//   } catch (error) {
//     console.error('Error during login:', error);
//     throw error;
//   }
// };
export const login = async (endPoint, body) => {
  return await axios
    .post(endPoint, body)
    .then(response => {
      return response;
    })
    .catch(err => err);
};
