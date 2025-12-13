export const storage = {
    getToken: () => localStorage.getItem("token"),

    setToken: (token: string) => {
        localStorage.setItem("token", token);
    },

    clearToken: () => {
        localStorage.removeItem("token");
    }
};
