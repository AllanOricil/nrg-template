<template>
  <div class="form-row">
    <label for="node-input-name"><i class="fa fa-tag"></i>Name</label>
    <input
      type="text"
      id="node-input-name"
      placeholder="Name"
      v-model="nodeData.name"
    />
    <button @click="incrementCounter">Click Me</button>
    <p>Counter: {{ counter }}</p>
    <p>Node Type: {{ nodeData.type }}</p>
  </div>
</template>

<script>
export default {
  props: {
    nodeData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      counter: 0,
    };
  },
  methods: {
    incrementCounter() {
      this.counter++;
    },
  },
};
</script>

<style scoped>
button {
  margin-top: 10px;
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
}

p {
  font-size: 18px;
  margin-top: 10px;
}
</style>
