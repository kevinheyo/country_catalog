<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="6">
        <div></div>
      </el-col>
      <el-col :span="8">
        <el-input ref="keyword" placeholder="Keyword" v-model="keyword" autofocus />
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="handleQuery">搜尋</el-button>
        <el-button type="danger" @click="handleReset">清除</el-button>
      </el-col>
      <el-col :span="6">
        <div></div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin: 1.75rem 0">
      <el-col :span="24">
        <el-pagination layout="total,prev,pager,next,jumper" background
                       :total="pager.total" :page-count="pager.pageCount"
                       :page-size="pager.pageSize" :current-page="pager.currentPage"
                       @current-change="handleCurrentChange"/>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin: 1.5rem 0">
      <el-col :span="24">
        <el-table id="catalog" :data="records" style="width: 100%" border stripe fit size="mini"
                  @sort-change="handleSortChange" :default-sort="defaultSort" v-loading="loading">
          <el-table-column prop="flag" label="國旗" width="86">
            <template #default="scope">
              <el-image style="width: 75px; height: 50px" :src="scope.row.flag" fit="contain"/>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="國家名稱" width="150" sortable="custom" :sort-orders="sortOrders">
            <template #default="scope">
              <el-button type="text" @click="handleOpenDialog(scope.row.alpha2Code)">{{ scope.row.name }}</el-button>
            </template>
          </el-table-column>

          <el-table-column prop="alpha2Code" label="2位國家代碼" width="115" sortable="custom" :sort-orders="sortOrders"/>
          <el-table-column prop="alpha3Code" label="3位國家代碼" width="115" sortable="custom" :sort-orders="sortOrders"/>
          <el-table-column prop="nativeName" label="母語名稱" width="100" sortable="custom" :sort-orders="sortOrders"/>
          <el-table-column prop="altSpellings" label="替代國家名稱" sortable="custom" :sort-orders="sortOrders"/>
          <el-table-column prop="callingCodes" label="國際電話區號" width="120" sortable="custom" :sort-orders="sortOrders"/>

          <el-table-column prop="score" label="Fuzziness" width="105" sortable="custom" :sort-orders="sortOrders">
            <template #default="scope">
              <span v-if="scope.row.score !== undefined">{{ scope.row.score.toFixed(4) }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin: 1.75rem 0">
      <el-col :span="24">
        <el-pagination layout="total,prev,pager,next,jumper" background
                       :total="pager.total" :page-count="pager.pageCount"
                       :page-size="pager.pageSize" :current-page="pager.currentPage"
                       @current-change="handleCurrentChange"/>
      </el-col>
    </el-row>

    <country-dialog />
  </div>
</template>

<script>
import api from '../api';
import Fuse from 'fuse.js';
import {mapMutations} from 'vuex';
import CountryDialog from "@/components/CountryDialog";

export default {
  name: 'Home',

  components: {
    CountryDialog
  },

  created() {
    const vm = this;

    const getAll = (countries) => {
      vm.countries = countries;
      vm.nameList = vm.countries.map(c => c.name);
      vm.$nextTick(() => {
        vm.updateRecords();
      });
    }

    api.getAllCountries(getAll);

    vm.registerKeyAction()
  },

  beforeUnmount() {
    console.log('beforeUnmount')
    this.unregisteredKeyAction()
  },

  data() {
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

      keyActionCb: () => {},

      keyword: '',
      countries: [],
      records: [],

      nameList: [],
      fuseOptions: {
        includeScore: true,
        // isCaseSensitive: true
      }
    }
  },

  methods: {
    updateRecords: function () {
      const vm = this
      let countries = vm.countries
      let filteredRecords = []

      // Filtering
      if (vm.keyword !== '') {
        const fuse = new Fuse(vm.nameList, vm.fuseOptions)

        const result = fuse.search(vm.keyword)
        const hashTable = {}
        result.map(r => {
          hashTable[r.item] = r.score
        })
        // console.log('Fuse result', result, hashTable)

        const has = Object.prototype.hasOwnProperty
        countries.map(o => {
          if (has.call(hashTable, o.name)) {
            filteredRecords.push({...o, score: hashTable[o.name]})
          }
        })
        // console.log('filteredRecords', filteredRecords)

      } else {
        filteredRecords = countries
      }

      // Sorting
      filteredRecords = filteredRecords.sort((a, b) => {
        if (a[vm.order.prop] < b[vm.order.prop]) {
          return (vm.order.order === 'ascending') ? -1 : 1
        }
        if (a[vm.order.prop] > b[vm.order.prop]) {
          return (vm.order.order === 'ascending') ? 1 : -1
        }
        return 0
      })

      // Pagination
      const total = filteredRecords.length
      const pageCount = parseInt(total / vm.pager.pageSize) + 1

      vm.pager.total = total
      vm.pager.pageCount = pageCount

      // Slice
      const start = (vm.pager.currentPage - 1) * vm.pager.pageSize
      const end = start + vm.pager.pageSize

      vm.records = filteredRecords.slice(start, end)
    },

    handleQuery() {
      const vm = this
      if (vm.keyword !== '') {
        vm.order.prop = 'score'
        vm.order.order = 'ascending'
        vm.pager.currentPage = 1

        vm.$nextTick(() => {
          vm.updateRecords()
        })
      } else {
        vm.$refs['keyword'].focus()

        vm.$notify.info({
          title: '提醒',
          message: '請輸入關鍵字',
          duration: 3000
        });
      }
    },

    handleReset() {
      const vm = this
      vm.keyword = ''

      vm.updateRecords()
    },

    handleSortChange(column) {
      const vm = this
      console.log('handleSortChange', column)
      vm.order.prop = column.prop
      vm.order.order = column.order

      vm.$nextTick(() => {
        vm.updateRecords();
      });
    },

    handleCurrentChange(v) {
      const vm = this
      vm.pager.currentPage = v;

      vm.$nextTick(() => {
        vm.updateRecords();
      });
    },

    handleOpenDialog(code) {
      const vm = this
      console.log('handleOpenDialog', code)

      vm.showDialog(code)
    },

    handleCLoseDialog() {
      const vm = this
      vm.dialog.visible = false
    },

    registerKeyAction() {
      const vm = this;
      const handler = (e) => {
        console.log('keydown', e)
        if (e.key === 'Enter') vm.handleQuery()
        if (e.key === 'Escape') vm.handleReset()
      }

      vm.keyActionCb = handler
      window.addEventListener('keydown', handler)
    },

    unregisteredKeyAction() {
      window.removeEventListener(this.keyActionCb)
    },


    ...mapMutations(['showDialog'])
  },

  watch: {
    keyword(newVal, oldVal) {
      console.log('keyword watcher')
      if (newVal === '' && oldVal !== '') {
        this.updateRecords();
        console.log('keyword watcher > updateRecords')
      }
    }
  }
}
</script>


<style lang="scss">
#catalog {
  .el-table__row > td {
    padding: 3px 0 !important;

    & > .cell {
      padding: 0 6px !important;
    }
  }
}
</style>