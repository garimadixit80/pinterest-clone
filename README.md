# Pinterest Clone
## Features

### User Authentication  
- **Secure Passwords**: Passwords are encrypted with bcrypt before storing in the database.  
- **Token-based Authentication**: A JWT token is generated on login, stored in `localStorage`, and automatically authenticated on page reloads for a seamless user experience.  
- **Authorization**: The token is sent with every HTTP request and authenticated via `passport.js`.  
- **Routing**:  
  - Authenticated users are redirected to the home page if they access login or signup.  
  - Non-authenticated users are redirected to the login page for restricted pages.

### Photo Search  
- **Search Functionality**: Search photos by keyword using Unsplash API. Displays the top 30 relevant photos.  
- **Random Photos**: On the home page without input, 30 random photos are displayed.  

### Account Features  
- **Save Photos**: Users can save or unsave photos they like.  
- **Profile Page**: View saved photos in a personalized profile.

## Tech Stack  

### Frontend  
- **React** and **CSS**: Dynamic and responsive UI.  
- **React Redux**: State management for authentication and photo handling.  
- **React Router**: Client-side routing.

### Backend  
- **Node.js** and **Express**: RESTful API creation.  
- **MongoDB**: Database for user and saved photo data.

