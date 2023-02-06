<template>
  <div class="bg-white rounded space-y-2 py-2">
    <SubTitle title="物流資料" />
    <div class="text-xs text-gray-500 flex flex-col md:flex-row">
      <CardTwoCol
        :item="{
          label: '出貨日期',
          value: info.shipdate,
        }">
        <template #icon>
          <el-icon> <Calendar /></el-icon>
        </template>
      </CardTwoCol>
      <CardTwoCol
        :item="{
          label: '出貨方式',
          value: info.express_co,
        }">
        <template #icon>
          <el-icon> <Van /></el-icon>
        </template>
      </CardTwoCol>

      <CardTwoCol
        :item="{
          label: '快遞單號',
          value: info.trackno,
        }">
        <template #icon> <Message /></template>
      </CardTwoCol>
    </div>
  </div>
</template>
<script setup>
import SubTitle from '@/components/Text/SubTitle.vue'
import CardTwoCol from '@/components/Card/CardTwoCol.vue'

import { computed } from 'vue'
import { useVariables } from '@/hooks/useVariables'
import { Calendar } from '@element-plus/icons-vue'
const { variables } = useVariables()

const props = defineProps({
  info: {
    type: Object,
    default: () => {},
  },
})
const name = computed(() => {
  const hasName = !!props.info.first_rcvname || !!props.info.last_rcvname
  return hasName
    ? `${props.info.first_rcvname} ${props.info.last_rcvname}`
    : '-'
})

const shipadd = computed(() => {
  const hasShipAdd = !!props.info.shipadd1 || !!props.info.shipadd2
  return hasShipAdd ? `${props.info.shipadd1} ${props.info.shipadd2}` : '-'
})
</script>