import { defineNuxtPlugin } from '#app'
import Toast, { type PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  const options: PluginOptions = {
    position: 'top-right',
    timeout: 3500,
    closeOnClick: true,
    pauseOnHover: true,
  }
  nuxtApp.vueApp.use(Toast, options)
})
