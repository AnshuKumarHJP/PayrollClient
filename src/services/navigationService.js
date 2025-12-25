let navigatorRef = null;

export const setNavigator = (nav) => {
  navigatorRef = nav;
};

export const navigateTo = (path) => {
  if (navigatorRef) {
    navigatorRef(path);
  }
};
