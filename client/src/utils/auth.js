// initialize variables
import decode from 'jwt-decode';

class AuthService {
  // get user profile data from decoded token
  getProfile = () => decode(this.getToken());
  // check if the user is logged in
  loggedIn = () => {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  };
  // check if the token is expired
  isTokenExpired = (token) => {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  };
  // get the user token from localStorage
  getToken = () => localStorage.getItem('jwtToken');
  // save user token to localStorage and redirect to homepage
  login = (idToken) => {
    localStorage.setItem('jwtToken', idToken);
    window.location.assign('/');
  };
  // remove user token from localStorage and redirect to homepage
  logout = () => {
    localStorage.removeItem('jwtToken');
    window.location.assign('/');
  };
}
// create an instance of the AuthService
const authService = new AuthService(); 
// export the auth service
export default authService; 