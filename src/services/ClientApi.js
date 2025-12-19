import axios from "axios";

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;

  } else if (response?.response?.status === 401) {
    return response.response;

  } else if (
    response.response &&
    response.response.status >= 400 &&
    response.response.status < 500
  ) {
    return response.response;

  } else if (
    response.response &&
    response.response.status >= 500 &&
    response.response.status < 600
  ) {
    return response.response;
  }
}

export default function ClientApi(url, payload, httpMethod, accessToken) {

  const Baseurl = `https://stfqc.integrumapps.com/security.api${url}`;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    token: accessToken || "",
  };

  switch (httpMethod) {
    case "GET":
      return axios.get(Baseurl, { headers })
        .then(checkStatus)
        .catch(checkStatus);

    case "POST":
      return axios.post(Baseurl, payload, { headers })
        .then(checkStatus)
        .catch(checkStatus);

    case "PUT":
      return axios.put(Baseurl, payload, { headers })
        .then(checkStatus)
        .catch(checkStatus);

    case "DELETE":
      return axios.delete(Baseurl, { headers })
        .then(checkStatus)
        .catch(checkStatus);

    default:
      console.error("Invalid HTTP Method", httpMethod);
      return null;
  }
}
