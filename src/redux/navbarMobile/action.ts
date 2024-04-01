export const DRAWER_OPEN = "DRAWER_OPEN";
export const DRAWER_CLOSE = "DRAWER_CLOSE";
export const ACCORDION_ACTIVE = "ACCORDION_ACTIVE";
export const MENU_ACTIVE = "MENU_ACTIVE";

export const drawerOpen = () => {
  return {
    type: DRAWER_OPEN,
  };
};

export const drawerClose = () => {
  return {
    type: DRAWER_CLOSE,
  };
};

export const accordionActive = (payload: any) => {
  return {
    type: ACCORDION_ACTIVE,
    payload,
  };
};

export const menuActive = (payload: any) => {
  return {
    type: MENU_ACTIVE,
    payload,
  };
};
