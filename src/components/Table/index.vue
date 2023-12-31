<template>
  <div>
    <el-table
      :data="tableData"
      size="small"
      class="default-table"
      stripe
      border
      max-height="420"
      ref="refTable"
      :header-cell-style="mainTableStyle.header"
      :row-style="mainTableStyle.row"
      :row-class-name="mainTableStyle.tableRowClassName"
      :cell-class-name="mainTableStyle.tableColClassName"
      v-loading="loading"
    >
      <el-table-column type="index" align="center" width="55" fixed="left" :index="handleIndex" />
      <slot name="custom"></slot>
      <el-table-column
        v-for="{
          prop,
          label,
          align,
          formatter,
          width,
          sortable,
          fixed,
        } in columns"
        :key="prop"
        :prop="prop"
        :label="label"
        :align="align || 'left'"
        :width="width"
        :fixed="fixed"
        :sort-orders="['descending', 'ascending']"
        :sortable="sortable || false"
      >
        <template v-if="formatter" #default="scope">
          <slot v-if="formatter" :name="prop" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
    <section class="flex justify-end pt-3" v-if="total > 0">
      <el-pagination
        v-model:current-page="currentPage"
        background
        small
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :page-size="take"
        :total="total"
      />
    </section>
  </div>
</template>

<script setup>
import { tableStyle } from '@/utils/format-table'
import { ref, computed } from 'vue'

const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
  loading: { type: Boolean, default: false },
  page: { type: Number, default: 1 },
  total: { type: Number, default: 0 },
  take: { type: Number, default: 20 },
})

const emit = defineEmits(['update:page'])

const mainTableStyle = tableStyle().main

const refTable = ref(null)

const currentPage = computed({
  get: () => props.page,
  set: value => emit('update:page', value),
})

const handleCurrentChange = val => {
  refTable.value.setScrollTop(0)
  currentPage.value = val
}

const handleIndex = index => {
  const no_page = !props.take || !currentPage.value
  if (no_page) return index + 1
  const take = props.take
  return (currentPage.value - 1) * take + index + 1
}
</script>
