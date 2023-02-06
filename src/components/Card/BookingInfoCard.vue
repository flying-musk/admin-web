<template>
  <div class="bg-white border rounded space-y-2 py-2">
    <SubTitle title="訂購人資料" />
    <div class="text-xs text-gray-500">
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
          label: '性別',
          value: info.sex,
        }">
        <template #icon>
          <el-icon> <Male /></el-icon>
        </template>
      </CardTwoCol>
      <CardTwoCol
        :item="{
          label: '國家',
          value: ccodeTitle,
        }">
        <template #icon>
          <el-icon> <WindPower /></el-icon>
        </template>
      </CardTwoCol>
      <CardTwoCol
        :item="{
          label: '生日',
          value: info.birthday,
        }">
        <template #icon>
          <el-icon> <Calendar /></el-icon>
        </template>
      </CardTwoCol>
      <CardTwoCol
        :item="{
          label: '地址',
          value: add,
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
  const hasName = !!props.info.first_name || !!props.info.last_name
  return hasName
    ? `${props.info.first_name} ${props.info.last_name}`
    : props.info?.name
    ? props.info?.name
    : '-'
})

const ccodeTitle = computed(() => {
  const ccode = props.info?.ccode
  if (!ccode) return
  return variables.ccodename[ccode]
})

const add = computed(() => {
  const hasAdd = !!props.info.add1 || !!props.info.add2
  return hasAdd ? `${props.info.add1} ${props.info.add2}` : '-'
})
</script>