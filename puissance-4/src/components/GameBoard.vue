<template>
  <div class="game-board grid grid-rows-6 grid-cols-7 grid-flow-row bg-blue-800">
    <token 
      v-for="tokenIndex in gridSize" 
      :key="tokenIndex" 
      :token-index="tokenIndex" 
      :class-name="getTokenClass(tokenIndex)" 
      @click="putToken('player', tokenIndex)"
    />
  </div>
</template>

<script>
import Token from './Token.vue'
import difference from 'lodash/difference'

export default {
  components: { Token },
  data() {
    return {
      gameBoard: {
        dimensions: {
          rows: 6,
          columns: 7
        },
        player: [],
        AI: []
      }
    }
  },
  mounted() {
    this.putToken('AI', 30)
  },
  methods: {
    putToken(player, tokenIndex) {
      const columnCount = this.gameBoard.dimensions.columns;
      const remainder = tokenIndex % columnCount;
      const colNumber = remainder === 0 ? columnCount : remainder;
      var column = [colNumber];
      for (var x = 0; column.length < this.gameBoard.dimensions.rows; x++) {
        column.push(column[x] + columnCount)
      }
      console.log('col', column);
      this.gameBoard.player.push(
        Math.max(...difference(column, this.gameBoard[player]))
        );
    },

    getTokenClass(tokenIndex) {
      return this.gameBoard.player.includes(tokenIndex) ? 'bg-red-500' : 'bg-yellow-500';
    }
  },
  computed: {
    gridSize() {
      const dimensions = this.gameBoard.dimensions;
      return dimensions.rows * dimensions.columns
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