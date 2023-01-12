<template>
  <div class="space-y-1 py-2 border-t border-b bg-white">
    <SubTitle title="收款資料" />
    <div class="grid md:grid-cols-2 lg:grid-cols-3 text-xs text-gray-500">
      <CardTwoCol
        :item="{
          label: '收款狀態',
          value: ' ',
        }">
        <el-tag
          effect="plain"
          round
          size="small"
          v-show="!!info.paystatus">
          <p class="tracking-widest">
            {{ info.paystatus }}
          </p>
        </el-tag>
      </CardTwoCol>
      <CardTwoCol
        :item="{
          label: '收款日期',
          value: info.payrcvday,
        }" />

      <CardTwoCol
        :item="{
          label: '收款詳情',
          value: info.paydetail,
        }" />
    </div>
  </div>
</template>
<script setup>
import SubTitle from '@/components/Text/SubTitle.vue'
import CardTwoCol from '@/components/Card/CardTwoCol.vue'
const props = defineProps({
  info: {
    type: Object,
    default: () => {},
  },
})
</script>
