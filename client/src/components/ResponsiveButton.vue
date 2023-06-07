<template>
  <div>
    <button>{{ label }}</button>
  </div>
</template>

<script>
export default {
  name: "ResponsiveButton",
  props: {
    label: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
button {
  color: #ffffff;
  border: none;
  padding: 12px 28px;
  background: #037ef2;
  border-radius: 24px;
  transition: all 0.2s ease;
}
button:active {
  transform: scale(0.95);
}
</style>
