
<script  setup>

import { ref } from 'vue';


const props = defineProps({
  title: String,
  id: String
})

const show_content = ref(true);

</script>

<template>

  <div class="mt-3 py-3 px-3 section-header d-flex" :id="props.id">
    <h2>{{ props.title }}</h2>

    <v-spacer></v-spacer>

    <!-- <v-icon size="small" color="white">mdi-eye</v-icon> -->

    <v-btn size="s" :icon="show_content ? `mdi-chevron-down` : `mdi-chevron-up`" color="white"
      @click="show_content = !show_content" />
  </div>

  <hr class="mt-1 mb-7" />

  <v-expand-transition>


    <div v-show="show_content">
      <slot>

      </slot>
    </div>
  </v-expand-transition>

</template>


<style>
.section-header {
  border-radius: 10px 10px 0 0;
  background-color: #004481;
  color: white;
}
</style>
