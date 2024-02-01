
<template>
  <div v-if="!loading" class="form-login">
    <div class="login-container">
      <form class="login-form" @submit.prevent="getInfo">
        <h1>
          {{ data.type == "A" ? "Login (Version A)" : "Login (Version B)" }}
        </h1>
        <p>Please login to your account</p>
        <div class="row">
          <div class="main-div">
            <div class="input-group">
              <label for="username">Name</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                required
                v-model="formData.username"
              />
            </div>
            <div class="input-group">
              <label for="Email">Email</label>
              <input
                type="email"
                id="Email"
                name="Email"
                placeholder="Enter your Email"
                required
                v-model="formData.email"
              />
            </div>
          </div>

          <div class="input-group">
            <label for="Email">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              v-model="formData.password"
              required
            />
          </div>
          <button class="button-submit" type="submit">
            {{ data.text }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="responseData">
    <h3>Response:</h3>
    <pre>{{ responseData }}</pre>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

import "popper.js";
import "@/assets/css/animate.min.css";
import "@/assets/css/variation.css";
import "@/assets/css/bootstrap.min.css";
import "@/assets/js/bootstrap.min-alpha1.js";
import "@/assets/js/cdn.jsdelivr.net_npm_bootstrap@5.0.2_dist_js_bootstrap.bundle.min.js";
import "@/assets/js/code.jquery.com_jquery-3.6.4.min.js";

export default {
  setup() {
    const loading = ref(true);
    const formData = ref({});
    const responseData = ref(null);

    const primaryColor1 = ref("#113383");
    const fontFamily = ref("#113383");

    const data = ref([]);

    const fetchData = async () => {
      try {
        loading.value = true;
        const urlParams = new URLSearchParams(window.location.search);
        let variation = urlParams.get("v") !== "B" ? "A" : "B";

        const response = await axios.get(
          "https://wemasyapi.code4each.com/api/variation/get",
          {
            params: {
              variation: variation,
            },
          }
        );
        if (response.data && response.data.status === 200) {
          data.value = response.data.data[0];
          setGlobalValues(
            data.value.color,
            data.value.font,
            data.value.max_width,
            data.value.grid_col
          );
        }
      } catch (error) {
        setGlobalValues();
        console.error("Error fetching data:", error);
      }
      loading.value = false;
    };

    const setGlobalValues = (
      color = "#11835d",
      font = "cursive",
      max_width = "500px",
      grid_col = "1fr"
    ) => {
      document.documentElement.style.setProperty("--primarColor1", color);
      document.documentElement.style.setProperty("--fontFamily", font);
      document.documentElement.style.setProperty("--max-width", max_width);
      document.documentElement.style.setProperty("--grid-col", grid_col);
    };
    const getInfo = async () => {
      // Get location using browser's Geolocation API
      let location = "";
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        location = `Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`;
      } catch (error) {
        location = "Read location is not enable";
      }
      const userAgent = window.navigator.userAgent.toLowerCase();
      let systemType = "";
      if (userAgent.match(/android/)) {
        systemType = "Phone (Android)";
      } else if (userAgent.match(/iphone|ipod/)) {
        systemType = "Phone (iOS)";
      } else if (userAgent.match(/ipad/)) {
        systemType = "Tablet (iOS)";
      } else if (userAgent.match(/windows/)) {
        systemType = "PC (Windows)";
      } else if (userAgent.match(/macintosh|mac os x/)) {
        systemType = "PC (Mac)";
      } else {
        systemType = "Unknown";
      }

      responseData.value = {
        name: formData.value.username,
        email: formData.value.email,
        location: location,
        systemType: systemType,
      };
      formData.value = {};
    };

    onMounted(fetchData);

    return {
      loading,
      data,
      primaryColor1,
      fontFamily,
      getInfo,
      formData,
      responseData,
    };
  },
};
</script>
