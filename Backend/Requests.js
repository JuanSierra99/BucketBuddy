export const getJson = async (url) => {
  const token = localStorage.getItem("jwtToken");
  const response = await fetch(url, {
    method: "Get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const json = await response.json();
    return json;
  } else {
    console.log("Error: " + response.status + " " + response.statusText);
    return null;
  }
};

export const Post = async (url, request_body) => {
  const token = localStorage.getItem("jwtToken");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request_body),
  });
  if (response.ok) {
    console.log(response.status + " " + response.statusText);
    const json = await response.json();
    return json;
  } else {
    console.log("Error: " + response.status + " " + response.statusText);
    return null;
  }
};
