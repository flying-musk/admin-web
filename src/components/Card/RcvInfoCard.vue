<template>
  <div class="bg-white rounded space-y-2 py-2">
    <SubTitle title="收貨人資料" />
    <div class="text-xs text-gray-500 flex flex-col md:flex-row">
      <CardTwoCol
        :item="{
          label: '姓名',
          value: name,
        }">
        <template #icon>
          <el-icon> <User /></el-icon>
        </template>
      </CardTwoCol>
      <CardTwoCol
        :item="{
          label: '手機',
          value: info.phone,
        }">
        <template #icon>
          <el-icon> <Phone /></el-icon>
        </template>
      </CardTwoCol>

      <CardTwoCol
        :item="{
          label: 'E-mail',
          value: info.email,
        }">
        <template #icon> <Message /></template>
      </CardTwoCol>
      <CardTwoCol
        :item="{
          label: '地址',
          value: shipadd,
        }">
        <template #icon>
          <el-icon> <Location /></el-icon>
        </template>
      </CardTwoCol>
    </div>
  </div>
</template>
<script setup>
import SubTitle from '@/components/Text/SubTitle.vue'
import CardTwoCol from '@/components/Card/CardTwoCol.vue'

import { computed } from 'vue'
import { useVariables } from '@/hooks/useVariables'
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