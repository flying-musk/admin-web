<template>
  <div class="tracking-wider text-gray-500 text-xs">
    <div
      class="grid grid-cols-1 bg-white rounded mb-3"
      v-for="{
        member_id,
        name,
        commit,
        amt_in,
        amt_out,
        remark,
        pos,
        ep_id,
      } in list"
      :key="ep_id">
      <header
        class="flex justify-between border-b bg-white text-gray-500 py-2 px-3">
        <div class="text-gray-700">#{{ ep_id }}</div>
        <div>{{ commit }}</div>
      </header>
      <CardTwoCol :item="{ label: '會員編號', value: member_id }">
        <span
          class="bg-opacity-20 px-2 py-1 tracking-widest rounded inline-block"
          :class="{
            'bg-slate-300 text-gray-500': pos === '原點位',
            'bg-primary-50  text-primary-500': pos !== '原點位',
          }"
          >{{ pos }}</span
        >｜
      </CardTwoCol>
      <CardTwoCol :item="{ label: '姓名', value: name }" />
      <CardTwoCol :item="{ label: '備註', value: remark }" />
      <footer class="grid grid-cols-2 border-t divide-x py-2 text-sm">
        <div class="text-center" :class="{ increase: amt_in > 0 }">
          補款:{{ amt_in }}
        </div>
        <div class="text-center" :class="{ decrease: amt_out > 0 }">
          扣款:{{ amt_out }}
        </div>
      </footer>
    </div>

    <el-empty v-if="isEmpty(list)"></el-empty>
  </div>
</template>

<script setup>
import CardTwoCol from '@/components/Card/CardTwoCol.vue'
import { isEmpty } from 'lodash-es'

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})
</script>