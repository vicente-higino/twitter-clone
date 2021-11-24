interface URLInterface {
  url: {
    API: string;
  };
}

const prod: URLInterface = {
  url: {
    API: window.location.protocol + "//" + window.location.host + "/api",
  },
};
const dev: URLInterface = {
  url: {
    API: "",
  },
};
export const config = process.env.NODE_ENV === "development" ? dev : prod;
