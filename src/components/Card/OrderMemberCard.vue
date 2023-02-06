<template>
  <div class="mx-auto md:min-w-60 text-xs">
    <div class="bg-white rounded overflow-hidden border">
      <div class="text-center pt-1 pb-3 bg-gray-700 border-b">
        <svg
          aria-hidden="true"
          role="img"
          class="h-12 w-12 text-white rounded-full mx-auto"
          width="32"
          height="32"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 256 256">
          <path
            fill="currentColor"
            d="M172 120a44 44 0 1 1-44-44a44 44 0 0 1 44 44Zm60 8A104 104 0 1 1 128 24a104.2 104.2 0 0 1 104 104Zm-16 0a88 88 0 1 0-153.8 58.4a81.3 81.3 0 0 1 24.5-23a59.7 59.7 0 0 0 82.6 0a81.3 81.3 0 0 1 24.5 23A87.6 87.6 0 0 0 216 128Z"></path>
        </svg>
        <p class="text-lg font-semibold text-gray-50">{{ name }}</p>
        <p class="text-sm text-gray-100" v-show="info?.phone">
          <el-icon :size="12"> <Phone /></el-icon>
          <span>
            {{ info?.phone }}
          </span>
        </p>
        <div class="mt-3">
          <a
            class="
              border
              rounded-full
              py-1
              px-3
              text-xs
              font-semibold
              text-gray-100
            ">
            訂購人
          </a>
        </div>
      </div>
      <div class="border-b">
        <CardTwoCol
          :item="{
            label: '手機',
            value: info?.phone,
          }">
          <template #icon>
<el-icon>            <Phone />
          </template>
        </CardTwoCol>
        <CardTwoCol
          :item="{
            label: 'E-mail',
            value: info?.email,
          }">
          <template #icon> <Message /></template>
        </CardTwoCol>
        <CardTwoCol
          :item="{
            label: '地址',
            value: shipadd,
          }">
          <template #icon>
<el-icon>            <Location />
          </template>
        </CardTwoCol>
      </div>

      <div class="flex justify-end p-2">
        <el-button size="small" auto-insert-space round>取消</el-button>
        <el-button type="primary" size="small" auto-insert-space round
          >保存</el-button
        >
      </div>
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
  const hasName = !!props.info?.first_rcvname || !!props.info?.last_rcvname
  return hasName
    ? `${props.info?.first_rcvname} ${props.info?.last_rcvname}`
    : '-'
})

const shipadd = computed(() => {
  const hasShipAdd = !!props.info?.shipadd1 || !!props.info?.shipadd2
  return hasShipAdd ? `${props.info?.shipadd1} ${props.info?.shipadd2}` : '-'
})
</script>