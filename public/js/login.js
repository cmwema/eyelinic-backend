import "../node_modules/axios/dist/axios.min.js";
import { showAlert } from "./alerts.js";

const login = async (email, password) => {
  // console.log(email, password);
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:8000/api/v1/users/log-in",
      data: {
        email,
        password,
      },
    });

    console.log(res.data);

    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      // window.setTimeout(() => {
      //   location.assign("/profile-settings");
      // });
    }
  } catch (err) {
    console.log(err);
    showAlert("error", err.message);
  }
};

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  login(email, password);
});
