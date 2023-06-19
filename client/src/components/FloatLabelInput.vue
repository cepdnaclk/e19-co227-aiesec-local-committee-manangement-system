<template>
  <div class="form-floating my-3">
    <input
      :type="type"
      label="floatingInput"
      class="form-control"
      :placeholder="placeholder"
      v-model="data"
    />
    <label for="floatingInput">{{  }}</label>
    <!-- <div class="input-box">
      <input :id="id" :type="type" v-model="value" :placeholder="label" />
      <span>{{ label }}</span>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "FloatLabelInput",
  props: {
    type: {
      type: String,
      required: false,
      default: "text",
    },
    placeholder: {
      type: String,
      required: false,
      default: "",
    },    
  },
  data() {
    return {
      value: "",
    };
  },
  data () {
    return {
      data: ""
    }
  },
};
</script>

<style scoped>
.body-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  letter-spacing: 0.1em;
  background: #ffffff;
  font-size: medium;
}
.input-box {
  position: relative;
  background: #ffffff;
}
.input-box input {
  width: 100%;
  padding: 10px;
  border: 1px solid #5d5d5d;
  border-radius: 5px;
  outline: none;
  transition: 0.2s;
}
.input-box span {
  position: absolute;
  left: 0;
  padding: 10px;
  pointer-events: none;
  font-size: 1em;
  color: #5d5d5d;
  transition: 0.2s;
}
.input-box input:placeholder-shown ~ span,
.input-box input:focus ~ span {
  color: #037ef2;
  transform: translateX(10px) translateY(-7px);
  font-size: 0.65em;
  padding: 0 5px;
  background: #ffffff;
  /* border-left: 1px solid #037ef2;
    border-right: 1px solid #037ef2; */
}
.input-box input:placeholder-shown,
.input-box input:focus {
  border: 1px solid #037ef2;
}
</style>
