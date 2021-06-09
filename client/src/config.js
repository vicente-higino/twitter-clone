const prod = {
    url: {
        API: window.location.protocol + "//" + window.location.host + "/api"
    },
};
const dev = {
    url: {
        API: ""
    },
};
export const config = process.env.NODE_ENV === "development" ? dev : prod;
