<!-- src/components/MyForm.vue -->
<template>
  <section class="sign-in">
    <div class="container">
      <div class="signin-content">
        <div class="signin-form">
          <h2 class="form-title">Wemasy Add Form</h2>
          <form @submit.prevent="handleOnSubmit">
            <div
              class="alert fade alert-simple alert-success alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light brk-library-rendered rendered show"
              v-if="showSucessMeassge"
            >
              <button
                type="button"
                class="close font__size-18"
                data-dismiss="alert"
              >
                <span aria-hidden="true"
                  ><a> <i class="fa fa-times greencross"></i> </a
                ></span>
                <span class="sr-only">Close</span>
              </button>
              <i class="start-icon fa fa-check-circle faa-tada animated"></i>
              <strong class="font__weight-semibold">Congratulations,</strong>
              Your Inputs saved successfully.
            </div>

            <div class="form-group">
              <label for="name">Name</label>
              <input
                type="text"
                class="form-control"
                id="exampleInputname"
                name="name"
                placeholder="Your Name"
                v-model="formData.name"
              />
              <p class="error-msg">{{ allErrors.name }}</p>
            </div>
            <div class="form-group">
              <label for="Email">Email</label>
              <input
                type="text"
                class="form-control"
                id="email"
                name="email"
                placeholder="Your Email"
                v-model="formData.email"
              />
              <p class="error-msg">{{ allErrors.email }}</p>
            </div>
            <div class="form-group">
              <label for="domainName">Domain Name</label>
              <input
                type="text"
                class="form-control"
                id="exampleInputdomainName"
                name="domainName"
                placeholder="Your Domain Name"
                v-model="formData.domain_name"
              />
              <p class="error-msg">{{ allErrors.domain_name }}</p>
            </div>

            <div class="form-group">
              <label for="homePgaeUrl">Home Page URL</label>
              <input
                type="text"
                class="form-control"
                id="exampleInputhomePgaeUrl"
                name="homePgaeUrl"
                placeholder="Your Home Page URL"
                v-model="formData.home_page_url"
              />
              <p class="error-msg">{{ allErrors.home_page_url }}</p>
            </div>

            <div class="form-group">
              <label for="privacyPolicy">Privacy Policy page URL </label>
              <input
                type="text"
                class="form-control"
                id="exampleInputprivacyPolicy"
                name="privacyPolicy"
                placeholder="Your Privacy Policy Page URL"
                v-model="formData.privacy_policy_url"
              />
              <p class="error-msg">{{ allErrors.privacy_policy_url }}</p>
            </div>
            <div class="form-group">
              <label for="contact">Contact Us Page URL </label>
              <input
                type="text"
                class="form-control"
                id="exampleInputcontact"
                name="contact"
                placeholder="Your Contact Us Page URL"
                v-model="formData.contact_us_url"
              />
              <p class="error-msg">{{ allErrors.contact_us_url }}</p>
            </div>

            <div class="form-group form-button">
              <input
                type="submit"
                name="signin"
                id="signin"
                class="form-submit"
                value="Submit"
                :disabled="isDisabled"
              />
              <div v-if="loading" class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import axios from "axios";

import "popper.js";
import "@/assets/css/animate.min.css";
import "@/assets/css/login.css";
import "@/assets/css/bootstrap.min.css";
import "@/assets/js/bootstrap.min-alpha1.js";
import "@/assets/js/cdn.jsdelivr.net_npm_bootstrap@5.0.2_dist_js_bootstrap.bundle.min.js";
import "@/assets/js/code.jquery.com_jquery-3.6.4.min.js";

export default {
  setup() {
    const formData = ref({});
    const allErrors = ref({});
    const showSucessMeassge = ref(false);
    const { handleSubmit } = useForm();
    const isDisabled = ref(false);
    const loading = ref(false);

    //function handle validations
    const validationSchema = yup.object({
      name: yup.string().required("The name field is required."),
      email: yup
        .string()
        .required("The email field is required.")
        .email("The email field must be a valid email address."),
      domain_name: yup.string().required("The domain name field is required."),
      home_page_url: yup
        .string()
        .required("The home page url field is required.")
        .url(
          "The URL format is invalid. Please ensure it begins with either http:// or https://."
        ),
      privacy_policy_url: yup
        .string()
        .required("The privacy policy url field is required.")
        .url(
          "The URL format is invalid. Please ensure it begins with either http:// or https://."
        ),
      contact_us_url: yup
        .string()
        .required("The contact us url field is required.")
        .url(
          "The URL format is invalid. Please ensure it begins with either http:// or https://."
        ),
    });

    // submit form
    const handleOnSubmit = handleSubmit(async () => {
      try {
        isDisabled.value = true;
        loading.value = true;

        await validationSchema.validate(formData.value, { abortEarly: false });
        allErrors.value = {};

        const response = await axios.post(
          "https://wemasyapi.code4each.com/api/domain/add",
          formData.value
        );
        // console.log(response);
        if (response.data && response.data.status === 200) {
          showSucessMeassge.value = true;
          formData.value = {};
          setTimeout(() => {
            showSucessMeassge.value = false;
          }, 5000);
        }
      } catch (error) {
        const errors =
          error.inner && Array.isArray(error.inner)
            ? error.inner.reduce((acc, err) => {
                acc[err.path] = err.message;
                return acc;
              }, {})
            : {};

        allErrors.value = errors;
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const modifiedErrors = { ...error.response.data.errors };
          Object.keys(modifiedErrors).forEach((key) => {
            modifiedErrors[key] = modifiedErrors[key].join(" ");
          });
          allErrors.value = modifiedErrors;
        }
      }
      isDisabled.value = false;
      loading.value = false;
    });

    return {
      formData,
      handleSubmit,
      handleOnSubmit,
      allErrors,
      showSucessMeassge,
      isDisabled,
      loading,
    };
  },
};
</script>