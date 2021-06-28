<template>
  <el-dialog title="Tips" v-model="dialogVisible" width="50%" @open="handleOpen" :before-close="handleClose">
    <span>This is a message</span>
    <p>{{ dialogVisible }}</p>
    <p>{{ dialogCode }}</p>
    <template #footer>
    <span class="dialog-footer">
      <el-button type="primary" @click="hideDialog">OK</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
import api from '../api';
import { mapState, mapMutations } from 'vuex';

export default {
  name: "CountryDialog",

  computed: {
    ...mapState(['dialogVisible', 'dialogCode']),
  },

  data () {
    return {}
  },

  methods: {
    ...mapMutations(['hideDialog']),

    handleOpen () {
      const vm = this
      console.log('CountryDialog > handleOpen', vm.dialogCode)

      const getByCode = (country) => {
        console.log(country)
      }

      api.getByCountry(vm.dialogCode, getByCode)
    },

    handleClose (done) {
      done()
      this.hideDialog()
    }
  }
}
</script>
