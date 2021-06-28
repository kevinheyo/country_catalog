<template>
  <el-dialog :title="`Country 【${dialogCode}】`" v-model="dialogVisible" width="50%" @open="handleOpen" :before-close="handleClose">

    <table id="dialog-table">
      <tr>
        <th>Name</th>
        <th>Content</th>
      </tr>
      <tr v-for="(content, key) in country" :key="key">
        <td class="name">{{ key }}</td>
        <td class="content">
          <country-item :content="content"/>
        </td>
      </tr>
    </table>

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
import CountryItem from "@/components/CountryItem";


export default {
  name: "CountryDialog",

  components: {
    CountryItem
  },

  computed: {
    ...mapState(['dialogVisible', 'dialogCode']),
  },

  data () {
    return {
      country: {}
    }
  },

  methods: {
    ...mapMutations(['hideDialog']),

    handleOpen () {
      const vm = this
      console.log('CountryDialog > handleOpen', vm.dialogCode)

      const getByCode = (country) => {
        console.log('getByCode', country)
        vm.country = country
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

<style lang="scss">
#dialog-table {
  width: 100%;

  max-height: 400px;
  overflow-y: scroll;

  th {
    background-color: #333;
    color: white;
    height: 2rem;
  }

  td, th {
    min-height: 2.5rem;
    border-top: 1px #666 solid !important;
    border-left: 1px #666 solid !important;
    border-right: 1px #666 solid;
    border-bottom: 1px #666 solid;

    ul {
      padding-left: 2rem;
    }
  }

  td > * {
    margin: .3rem;
  }

  .name {
    width: 30%;
    background-color: #efefef;
  }

  .content {
    width: 70%;
    text-align: left;

    &:hover {
      background-color: #FEF9E7;
    }
  }
}
</style>