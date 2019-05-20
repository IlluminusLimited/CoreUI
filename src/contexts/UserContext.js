import React from "react";
import CurrentUser from "../utilities/CurrentUser";

export const UserContext = React.createContext({
  currentUser: new CurrentUser(),
  updateCurrentUser: () => {
  }
});
