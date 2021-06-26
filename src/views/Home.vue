<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
<!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->

    <el-table :data="records" style="width: 100%" border stripe fit size="mini" @sort-change="handleSortChange" :default-sort="defaultSort" v-loading="loading">
      <el-table-column prop="flag" label="國旗">
        <template #default="scope">
          <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.flag"
              fit="contain">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="國家名稱" sortable="custom" :sort-orders="sortOrders" />
      <el-table-column prop="alpha2Code" label="2位國家代碼" sortable="custom" :sort-orders="sortOrders" />
      <el-table-column prop="alpha3Code" label="3位國家代碼" sortable="custom" :sort-orders="sortOrders" />
      <el-table-column prop="nativeName" label="母語名稱" sortable="custom" :sort-orders="sortOrders" />
      <el-table-column prop="altSpellings" label="替代國家名稱" sortable="custom" :sort-orders="sortOrders" />
      <el-table-column prop="callingCodes" label="國際電話區號" sortable="custom" :sort-orders="sortOrders" />
    </el-table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',

  created () {
    const vm = this;
    console.log('created', vm.url.all, vm.fields);

    axios.get(vm.url.all, {
      params: {
        fields: vm.fields
      }
    }).then(function (response) {
      // handle success
      console.log(response);
      vm.countries = response.data;
    })
        .catch(function (error) {
          // handle error
          console.log(error)
        })
        .then(function () {
          // always executed
        })

  },

  data() {
    return {
      loading: false,

      defaultSort: {
        'prop': 'name',
        'order': 'ascending'
      },
      order: {
        'prop': 'name',
        'order': 'ascending'
      },
      sortOrders: ['ascending', 'descending'],

      fields: 'flag;name;alpha2Code;alpha3Code;nativeName;altSpellings;callingCodes',

      url: {
        all: 'https://restcountries.eu/rest/v2/all',
      },

      countries: []
    }
  },

  computed: {
    records () {
      const vm = this
      // TODO: loading feedback
      // TODO: Pagination
      // TODO: Search filtering

      let countries = vm.countries
      let records = countries.sort((a, b) => {
        if (a[vm.order.prop] < b[vm.order.prop]) {
          return (vm.order.order === 'ascending') ? -1 : 1
        }
        if (a[vm.order.prop] > b[vm.order.prop]) {
          return (vm.order.order === 'ascending') ? 1 : -1
        }
        return 0
      })

      return records
    }
  },

  methods: {
    handleSortChange(column) {
      const vm = this;
      vm.order.prop = column.prop;
      vm.order.order = column.order;
    },
  }
}
</script>
