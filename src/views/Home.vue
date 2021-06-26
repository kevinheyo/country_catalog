<template>
  <div class="home">
    <el-input placeholder="Keyword" v-model="keyword" @input="handleKeywordChange"></el-input>

    <el-pagination layout="total,prev,pager,next,jumper" :total="pager.total" :page-count="pager.pageCount" background
                   :page-size="pager.pageSize" :current-page="pager.currentPage" @current-change="handleCurrentChange"></el-pagination>

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
      console.log(response);
      vm.countries = response.data;
      vm.$nextTick(() => {
        vm.updateRecords();
      });
    }).catch(function (error) {
      console.error(error)
    });
  },

  data () {
    return {
      loading: false,

      defaultSort: {
        prop: 'name',
        order: 'ascending'
      },
      order: {
        prop: 'name',
        order: 'ascending'
      },
      sortOrders: ['ascending', 'descending'],

      pager: {
        total: 0,
        pageCount: 0,
        pageSize: 25,
        currentPage: 1
      },

      fields: 'flag;name;alpha2Code;alpha3Code;nativeName;altSpellings;callingCodes',

      url: {
        all: 'https://restcountries.eu/rest/v2/all',
      },

      keyword: '',

      countries: [],
      records: [],
    }
  },

  methods: {
    updateRecords () {
      const vm = this
      let countries = vm.countries;
      let filteredRecords = countries;

      if (vm.keyword !== '') {
        filteredRecords = filteredRecords.filter((o) => {
          return o.name.includes(vm.keyword);
        });
      }

      filteredRecords = filteredRecords.sort((a, b) => {
        if (a[vm.order.prop] < b[vm.order.prop]) {
          return (vm.order.order === 'ascending') ? -1 : 1;
        }
        if (a[vm.order.prop] > b[vm.order.prop]) {
          return (vm.order.order === 'ascending') ? 1 : -1;
        }
        return 0;
      });

      // Pagination
      const total = filteredRecords.length;
      const pageCount = parseInt(total / vm.pager.pageSize) + 1;

      vm.pager.total = total;
      vm.pager.pageCount = pageCount;

      // Slice
      const start = (vm.pager.currentPage - 1) * vm.pager.pageSize;
      const end = start + vm.pager.pageSize + 1;

      vm.records = filteredRecords.slice(start, end);
    },

    handleKeywordChange() {
      const vm = this
      vm.updateRecords();
    },

    handleSortChange (column) {
      const vm = this
      console.log('handleSortChange', column)
      vm.order.prop = column.prop
      vm.order.order = column.order

      vm.$nextTick(() => {
        vm.updateRecords();
      });
    },

    handleCurrentChange (v) {
      const vm = this
      vm.pager.currentPage = v;

      vm.$nextTick(() => {
        vm.updateRecords();
      });
    }
  }
}
</script>
