<template>
  <button :class="`token rounded-full ${className}`">{{tokenIndex}}</button>
</template>

<script>
export default {
  props: {
    tokenIndex: Number,
    className: {
      type: String,
    }
  }
}
</script>

<style>
.token {
  height: 60px;
  width: 60px;

}
</style>