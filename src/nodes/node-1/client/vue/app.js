import { loadVue } from "./utils";

function app(node) {
  loadVue(node, startApp);
}

function startApp() {
  new Vue({
    el: "#vue-app",
    data: {
      formData: {
        name: "",
        email: "",
      },
    },
    template: `
		<form @submit.prevent="submitForm">
			<div>
				<label for="name">Name:</label>
				<input type="text" v-model="formData.name" id="name" />
			</div>
			<div>
				<label for="email">Email:</label>
				<input type="email" v-model="formData.email" id="email" />
			</div>
			<button type="submit">Submit</button>
		</form>
    `,
    methods: {
      submitForm() {
        console.log("Form Data:", this.formData);
      },
    },
  });
}

export { app };
