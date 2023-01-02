<script setup>
import { ref } from "vue";
import axios from "axios";

import { getToken, validate2FA, generate2FACode } from "../services/auth";

import { io } from "socket.io-client";


import SectionHeader from './SectionHeader.vue';
import UserBalance from './UserBalance.vue';

const links = ref(['Recarga Ya']);

const socket = io("http://localhost:3005");

socket.on("connect", function () {
  // showAlert("success", [
  //   "Conectado al servidor de sockets.",
  //   `Socket ID: ${socket.id}`,
  // ]);
});

socket.on("update-balance", function (data) {
  // console.log(`CLIENT FORM ON EVENT`);
  // console.log({ data });
  const { new_bbva_balance, new_external_balance } = data;
  user_bbva_balance.value = new_bbva_balance;
  user_external_balance.value = new_external_balance;
});

socket.on("nuevo-mensaje", function (payload) {
  console.log("Escuchando", payload);
});

const name = ref(`Jean Carlo`);
const phone_number = ref(`+51989761968`);
const verification_code = ref();
const identifier = ref(`jeancarlo.palomino.g@gmail.com`);
const password = ref(`12345678`);
const show_password = ref(false);

const acc_number = ref(`4716586605041404`);
const exp_date = ref(`12/2023`);
const sec_code = ref(`233`);
const amount = ref(100);
const service_name = ref(`Claro`);
const user_external_balance = ref(`0`);
const user_bbva_balance = ref(`100`);

const btn_loading = ref(false);
const show_input_2fa = ref(false);

const response_messages = ref([]);
const snackbar = ref(false);
const snackbar_color = ref(`success`);

const showAlert = (color, messages) => {
  snackbar_color.value = color;
  response_messages.value = messages;

  snackbar.value = true;
};
const hideAlert = () => {
  snackbar.value = false;
};
const submit2FA = async () => {
  btn_loading.value = true;

  show_input_2fa.value = false;
  verification_code.value = null;

  const code_was_generated = await generate2FACode(phone_number.value);

  if (!code_was_generated) {
    showAlert("warning", ["No se pudo generar el código, intente de nuevo."]);
    btn_loading.value = false;

    return;
  }

  // console.log({ h: document.body.scrollHeight });
  // window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);

  let elmnt = document.getElementById('2fa-section');
  // console.log({elmnt});
  elmnt.scrollIntoView(false);

  show_input_2fa.value = true;

  btn_loading.value = false;
};

const submit = async () => {
  btn_loading.value = true;

  const isValid2FACode = await validate2FA(
    phone_number.value,
    verification_code.value
  );

  if (!isValid2FACode) {
    showAlert("warning", [
      "El código de verificación es incorrecto, intente de nuevo.",
    ]);
    btn_loading.value = false;
    return;
  }

  const uri = `http://localhost:3002/bbva-services/validate-transaction`;
  const data = {
    acc_number: acc_number.value,
    exp_date: exp_date.value,
    sec_code: sec_code.value,
    amount: amount.value,
    service_name: service_name.value,
  };

  axios
    .post(uri, data, {
      headers: {
        "bbva-token": await getToken({
          name: name.value,
          phone_number: phone_number.value,
          identifier: identifier.value,
          password: password.value,
        }),
      },
    })
    .then(({ data }) => {
      showAlert("success", data.messages);
      show_input_2fa.value = false;
      verification_code.value = null;
      setTimeout(() => {
        btn_loading.value = false;
      }, 1000);
    })
    .catch((err) => {
      show_input_2fa.value = false;
      if (err.response) {
        showAlert("warning", err.response.data.messages);
      }

      setTimeout(() => {
        btn_loading.value = false;
      }, 1000);
    });
};
</script>

<template>
  <v-container>
    <v-row v-show="snackbar">
      <v-col cols="12">
        <v-alert :color="snackbar_color" title="Respuesta" variant="tonal" closable v-model="snackbar">
          <v-divider class="my-4 bg-light-blue-lighten-4"></v-divider>

          <div class="d-flex flex-row align-center justify-space-between">
            <ul>
              <li style="list-style-type: none" v-for="(response_message, index) in response_messages" :key="index">
                {{ response_message }}
              </li>
            </ul>
          </div>
        </v-alert>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="9">
        <v-card elevation="0">
          <v-card-text>
            <v-form>

              <SectionHeader title="Información personal">
                <v-row>
                  <v-col cols="6">
                    <v-text-field color="primary" disabled label="Nombre" variant="outlined" v-model="name"
                      prepend-inner-icon="mdi-format-letter-case" hide-details="" />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field color="primary" label="Celular" variant="outlined" v-model="phone_number"
                      prepend-inner-icon="mdi-cellphone" hide-details="" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-text-field color="primary" disabled label="Email" variant="outlined" v-model="identifier"
                      prepend-inner-icon="mdi-account" hide-details="" />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field color="primary" disabled label="Contraseña" variant="outlined" v-model="password"
                      :type="show_password ? 'text' : 'password'" :append-inner-icon="
  show_password ? `mdi-eye` : `mdi-eye-off`
" @click:append-inner="show_password = !show_password" hide-details="" />
                  </v-col>
                </v-row>
              </SectionHeader>




              <SectionHeader title="Información de pago">
                <v-row>
                  <v-col cols="6">
                    <v-text-field color="primary" label="Número de tarjeta" variant="outlined" v-model="acc_number"
                      prepend-inner-icon="mdi-numeric" hide-details="" />
                  </v-col>
                  <v-col cols="3">
                    <v-text-field color="primary" label="Fecha de vencimiento" variant="outlined" v-model="exp_date"
                      prepend-inner-icon="mdi-calendar" hide-details="" />
                  </v-col>
                  <v-col cols="3">
                    <v-text-field color="primary" label="Código de seguridad" variant="outlined" v-model="sec_code"
                      prepend-inner-icon="mdi-key" hide-details="" />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6">
                    <v-text-field color="primary" label="Servicio" v-model="service_name" variant="outlined" disabled
                      prepend-inner-icon="mdi-view-list" hide-details="" />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field color="primary" label="Monto" variant="outlined" v-model="amount"
                      prepend-inner-icon="mdi-currency-usd" hide-details="" />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="d-flex justify-center">
                    <v-btn tile @click="submit2FA()" :loading="btn_loading" elevation="0" variant="outlined"
                      :rounded="0">Recargar</v-btn>
                  </v-col>
                </v-row>
              </SectionHeader>


              <v-expand-transition>
                <v-card elevation="0" v-show="show_input_2fa">
                  <v-card-text class="px-0">
                    <SectionHeader title="Verificación de 2 pasos" id="2fa-section">

                      <v-row>
                        <v-col cols="12">
                          <v-text-field color="primary" label="Código de verificación" variant="outlined"
                            v-model="verification_code" prepend-inner-icon="mdi-numeric" hide-details="" />
                        </v-col>
                        <v-col class="d-flex justify-center">
                          <v-btn @click="submit()" :loading="btn_loading" elevation="0" variant="outlined"
                            :rounded="0">Confirmar</v-btn>
                        </v-col>
                      </v-row>

                    </SectionHeader>
                  </v-card-text>
                </v-card>
              </v-expand-transition>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="3">
        <UserBalance :name="name" :bbva_balance="user_bbva_balance" :external_balance="user_external_balance" />
      </v-col>
    </v-row>
  </v-container>
</template>
