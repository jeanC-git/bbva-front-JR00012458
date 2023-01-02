
<script  setup>


const props = defineProps({
  bbva_balance: String,
  external_balance: String,
  name: String
})

</script>


<template>
  <v-card elevation="0">
    <v-card-text >
      <v-row class="user-balance-section-header">
        <v-col>
          <h2>
            {{ props.name }}
          </h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="8">
          Saldo BBVA: <br />
          <strong>
            {{ props.bbva_balance }}
          </strong>
        </v-col>
        <v-col cols="8">
          Saldo Claro: <br />
          <strong>
            {{ props.external_balance }}
          </strong>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>



<style>
.user-balance-section-header {
  background-color: #043262;
  color: white;
}
</style>
