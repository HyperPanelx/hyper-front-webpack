import {createApp} from "vue";
import App from "./App.vue";


//////////// Tailwind.config
import './assets/Tailwind.config/Tailwind.base.scss'
import './assets/Tailwind.config/Tailwind.component.scss'
import './assets/Tailwind.config/Tailwind.utilities.scss'
import './assets/components/form.scss'
import './assets/components/formkit.scss'
import './assets/components/conatiner.scss'
import './assets/components/modal.scss'
import './assets/components/layout.scss'
import './assets/components/sidebar.scss'
import './assets/components/navbar.scss'
import './assets/components/login.scss'
import './assets/components/tooltip.scss'
import './assets/components/dropdown.scss'
import './assets/components/table.scss'
import './assets/components/card.scss'
import './assets/components/skelton.scss'
import './assets/components/transition.scss'
import './assets/components/general.scss'
import './assets/components/FAB.scss'

/////////// main style
import './assets/app.scss';

///////// images
import './public/login.jpg'
import './public/logo-lg.png'
import './public/logo-sm.png'
import './public/profiles/profile_1.svg'
import './public/profiles/profile_2.svg'
import './public/profiles/profile_3.svg'
import './public/profiles/profile_4.svg'
import './public/profiles/profile_5.svg'
import './public/profiles/profile_6.svg'
//// router
import router from "./router";


//////////// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {faCircleCheck,faXmark,faEye,faEyeSlash,faCircleExclamation,faBars,faChevronRight,faCompress,faExpand,faMagnifyingGlass,faBell,faMoon,faGear,faArrowRightFromBracket,faHouse,faUserGroup,faTowerBroadcast,faUser,faMicrochip,faServer,faHardDrive,faSignal,faChevronLeft,faKey,faPhone,faSliders,faDownload,faTrash,faRightLeft,faLock,faLockOpen,faArrowRight,faTriangleExclamation,faGhost,faUsersLine,faUserPlus,faSkullCrossbones,faTrashArrowUp,faCodePullRequest,faBan} from '@fortawesome/free-solid-svg-icons'
import {faTelegram,faMegaport} from '@fortawesome/free-brands-svg-icons'
import {faCircle,faEnvelope,faSun,faPenToSquare} from '@fortawesome/free-regular-svg-icons'
library.add(faCircle,faCircleCheck,faXmark,faEye,faEyeSlash,faCircleExclamation,faBars,faChevronRight,faCompress,faExpand,faMagnifyingGlass,faBell,faEnvelope,faMoon,faSun,faGear,faArrowRightFromBracket,faHouse,faUserGroup,faTowerBroadcast,faUser,faMicrochip,faServer,faHardDrive,faSignal,faChevronLeft,faKey,faTelegram,faPhone,faCircle,faSliders,faPenToSquare,faDownload,faTrash,faRightLeft,faLock,faLockOpen,faArrowRight,faTriangleExclamation,faGhost,faUsersLine,faUserPlus,faMegaport,faSkullCrossbones,faTrashArrowUp,faCodePullRequest,faBan)


///// dependencies
import Notifications from '@kyvg/vue3-notification'
import VueApexCharts from "vue3-apexcharts";
import { plugin ,defaultConfig} from '@formkit/vue';
import 'choices.js/public/assets/styles/choices.min.css'
import 'ladda/dist/ladda-themeless.min.css';
import config from '../formkit.config'
import {btnColor,textColor,bgColor} from "./plugins/color";
import vClickOutSide from './directive/vClickOutside'
import vFocus from './directive/vFocus'
import vFade from './directive/vFade'
import vCollapsible from './directive/vCollapsible'
import column from './components/grid/column.vue'
import container from './components/grid/container.vue'
import containerFull from './components/grid/containerFull.vue'
import row from './components/grid/row.vue'
import { createPinia } from 'pinia';
import VueCookies from 'vue-cookies'
///// app
const app=createApp(App)
const pinia = createPinia()
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router)
app.use(VueApexCharts);
app.use(textColor);
app.use(bgColor);
app.use(btnColor);
app.directive('collapse',vCollapsible);
app.directive('fade',vFade);
app.directive('click-outside',vClickOutSide);
app.directive('focus',vFocus);
app.component('row',row);
app.component('column',column);
app.component('container-full',containerFull);
app.component('container',container);
app.use(plugin, defaultConfig(config));
app.use(pinia);
app.use(VueCookies,{
    expires:10*24*60*60,
    path:'/'
})
app.use(Notifications);
app.mount('#v-app');
