let API_URL;

if (process.env.NODE_ENV === "production") {
  API_URL = "https://api.web2print.roulemarcel.fr";
} else if (process.env.NODE_ENV === "development") {
  API_URL = "http://localhost:1337";
}

export default API_URL;
