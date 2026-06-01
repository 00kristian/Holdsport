import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView      from '../views/HomeView.vue'
import NySpillerView from '../views/NySpillerView.vue'
import ReglerView    from '../views/ReglerView.vue'
import HoldetView    from '../views/HoldetView.vue'
import KontaktView   from '../views/KontaktView.vue'
import ProgramView   from '../views/ProgramView.vue'
import BurgerCupView from '../views/BurgerCupView.vue'

// Using hash history (#) so GitHub Pages works without a server
// e.g. https://yourname.github.io/holdet-vue/#/regler
const routes = [
  { path: '/',           name: 'home',       component: HomeView },
  { path: '/ny-spiller', name: 'ny-spiller', component: NySpillerView },
  { path: '/regler',     name: 'regler',     component: ReglerView },
  { path: '/holdet',     name: 'holdet',     component: HoldetView },
  { path: '/kontakt',    name: 'kontakt',    component: KontaktView },
  { path: '/program',    name: 'program',    component: ProgramView },
  { path: '/burger-cup', name: 'burger-cup', component: BurgerCupView },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
