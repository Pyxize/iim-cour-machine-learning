<template>
  <div class="game-board grid grid-rows-6 grid-cols-7 grid-flow-row bg-blue-800">
    <token v-for="tokenIndex in 42" :key="tokenIndex">{{tokenIndex }}</token>
  </div>
</template>

<script>
import Token from './Token.vue'
export default {
  components: { Token },
  data() {
    return {
      gameBoard: {}
    }
  },
  mounted() {

  },
  methods: {
    createGame() {

    }
  }
}

</script>

<style scoped>
.game-board {
  height: 500px;
  width: 700px;
}
</style>