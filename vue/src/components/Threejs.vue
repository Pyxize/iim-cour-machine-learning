<template>
  <div id="all">
    <h1>Dijkstra</h1>
    <div id="container"></div>
  </div>
</template>

<script>
import * as Three from "three";

export default {
  name: "Dijkstra",
  data() {
    return {
      scene: undefined,
      camera: undefined,
      renderer: undefined,
    };
  },
  methods: {
    init: function () {
      let container = document.getElementById("container");
      let tailleTab = 16;
      this.camera = new Three.PerspectiveCamera(
        70,
        container.clientWidth / container.clientHeight,
        0.01,
        20
      );
      this.camera.position.z = 15;
      this.camera.position.x = tailleTab / 2;
      this.camera.position.y = tailleTab / 2;

      this.scene = new Three.Scene();
      let tab = [];
      let tile = [];

      const geometry = new Three.PlaneGeometry(1, 1);
      const terre = new Three.MeshBasicMaterial({
        color: 0x6e7f6c,
        side: Three.DoubleSide,
      });
      const lave = new Three.MeshBasicMaterial({
        color: 0xec4678,
        side: Three.DoubleSide,
      });
      //generation map
      for (let i = 0; i < tailleTab; i++) {
        tab[i] = [];
        tile[i] = [];
        for (let j = 0; j < tailleTab; j++) {
          let mat = terre;
          tab[i][j] = "terre";
          if (Math.floor(Math.random() * 3) == 0) {
            mat = lave;
            tab[i][j] = "lave";
          }
          tile[i][j] = new Three.Mesh(geometry, mat);
          this.scene.add(tile[i][j]);
          //console.log(i + "  " +j)
          tile[i][j].position.x = i;
          tile[i][j].position.y = j;
        }
      }

      let xkey = Math.floor(Math.random() * tailleTab);
      let ykey = Math.floor(Math.random() * tailleTab);
      tab[xkey][ykey] = "key";
      tile[xkey][ykey].material = new Three.MeshBasicMaterial({
        color: 0xffff00,
        side: Three.DoubleSide,
      });
      //generation hero
      let x = xkey;
      let y = ykey;
      while (x == xkey && y == ykey) {
        x = Math.floor(Math.random() * tailleTab);
        y = Math.floor(Math.random() * tailleTab);
      }
      tab[x][y] = "Hero";
      tile[x][y].material = new Three.MeshBasicMaterial({
        color: 0xf4fefe,
        side: Three.DoubleSide,
      });

      //------------------------------------------------------------------------------------------------------------------
      this.renderer = new Three.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);


      let caseDejaCheck = [];
      let toutesLesCasesAColorer = [];
      let caseTresor = [xkey, ykey];

      this.algoToFindTresor(caseDejaCheck, caseTresor, toutesLesCasesAColorer, tab, x, y)


      let b = 0;
      let doContinue = true;
      while(doContinue && this.caseJamaisCheck(caseDejaCheck, caseTresor) && b < ((caseDejaCheck.length > 1000 ) ? 6 : caseDejaCheck.length)){
        doContinue = this.algoToFindTresor(caseDejaCheck, caseTresor, toutesLesCasesAColorer, tab, caseDejaCheck[b][0], caseDejaCheck[b][1])
        b++;
      }
      if (!this.caseJamaisCheck(caseDejaCheck, caseTresor)) {
        console.log("Point faible : trop fort !")
      }
      if(toutesLesCasesAColorer.length == 0){
        console.log("t'es null")
      }

    },
    algoToFindTresor(caseDejaCheck, caseTresor, toutesLesCasesAColorer, tab, x, y){
      if (!this.caseJamaisCheck(caseDejaCheck, caseTresor)) {
        console.log("Point faible : trop fort !")
        return false;
      } else {
        let caseGauche = this.defineNewCaseGauche(x, y)
        let caseDroite = this.defineNewCaseDroite(x, y)
        let caseHaut = this.defineNewCaseHaut(x, y)
        let caseBas = this.defineNewCaseBas(x, y)

        this.addEligibleCase("Haut", caseHaut, caseDejaCheck, toutesLesCasesAColorer, tab)
        this.addEligibleCase("Bas", caseBas, caseDejaCheck, toutesLesCasesAColorer, tab)
        this.addEligibleCase("Droite", caseDroite, caseDejaCheck, toutesLesCasesAColorer, tab)
        this.addEligibleCase("Gauche", caseGauche, caseDejaCheck, toutesLesCasesAColorer, tab)
        if(toutesLesCasesAColorer.length == 0){
          console.log("T'es nul")
          return false;
        }else{
          //  console.log("ON continue de chercher")
          this.highlightCheckCase(this.scene, toutesLesCasesAColorer, "blue");
          return true;
        }
      }
    },
    addEligibleCase(caseName, caseDirection, caseDejaCheck, toutesLesCasesAColorer, tab) {
      if (caseDirection.length != 0 && (tab[caseDirection[0]][caseDirection[1]] === "terre" || tab[caseDirection[0]][caseDirection[1]] === "key") && this.caseJamaisCheck(caseDejaCheck, caseDirection)) {
        toutesLesCasesAColorer[toutesLesCasesAColorer.length] = caseDirection;
        caseDejaCheck[caseDejaCheck.length] = caseDirection;
      }
    },
    defineNewCaseGauche(xStartCase, yStartCase){
      let caseGauche = []
      if (xStartCase > 0) {
        caseGauche = [xStartCase - 1, yStartCase];
      }
      return caseGauche;
    },
    defineNewCaseDroite(xStartCase, yStartCase){
      let caseDroite = []
      if (xStartCase < 15) {
        caseDroite = [xStartCase + 1, yStartCase];
      }
      return caseDroite;
    },
    defineNewCaseHaut(xStartCase, yStartCase){
      let caseHaut = []
      if (yStartCase < 15) {
        caseHaut = [xStartCase, yStartCase + 1];
      }
      return caseHaut;
    },
    defineNewCaseBas(xStartCase, yStartCase){
      let caseBas = []
      if (yStartCase > 0) {
        caseBas = [xStartCase, yStartCase - 1];
      }
      return caseBas;
    },
    highlightCheckCase(scene, tiletab, colortile) {
      for (let i = 0; i < tiletab.length; i++) {
        const geometry = new Three.PlaneGeometry(0.7, 0.7);
        const mat = new Three.MeshBasicMaterial({
          color: colortile,
          side: Three.DoubleSide,
        });
        const plane = new Three.Mesh(geometry, mat);
        scene.add(plane);
        plane.position.x = tiletab[i][0];
        plane.position.y = tiletab[i][1];
      }
    },
    caseJamaisCheck(caseDejaCheck, caseToCheck) {
      for (let a = 0; a < caseDejaCheck.length; a++) {
        if (caseDejaCheck[a][0] === caseToCheck[0] && caseDejaCheck[a][1] === caseToCheck[1]) {
          return false;
        }
      }
      return true;
    },
    animate: function () {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
    },
  },
  mounted() {
    this.init();
    this.animate();
  },
};
</script>

<style scoped>
#container {
  width: 1000px;
  height: 700px;
  margin-left: auto;
  margin-right: auto;
}
</style>
