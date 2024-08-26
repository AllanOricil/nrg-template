<template>
  <div>
    Hello World
    <button @click="incrementCounter">Click Me</button>
    <p>Counter: {{ counter }}</p>
  </div>
</template>

<script>
export default {
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
