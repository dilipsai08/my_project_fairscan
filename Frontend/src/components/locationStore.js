const KEY = "fairscan_location";

export const saveLocation = (data) => {
    localStorage.setItem(KEY, JSON.stringify(data));
};

export const getLocation = () => {
    try {
        return JSON.parse(localStorage.getItem(KEY)) || null;
    } catch { return null; }
};
