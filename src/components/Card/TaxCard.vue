<template>
  <div class="tracking-wider text-gray-500 text-xs" v-loading="loading">
    <div
      class="grid grid-cols-1 bg-white rounded mb-3"
      v-for="(item, index) in list"
      :key="item.name">
      <header
        class="
          flex
          justify-between
          items-center
          border-b
          bg-white
          text-gray-500
          p-2
        ">
        <div>#{{ index + 1 }}｜{{ item.filetime }}</div>
        <el-tag effect="plain" round size="small" :type="item.statusType">{{
          item.status
        }}</el-tag>
      </header>

      <CardTwoCol
        :item="{
          label: '姓名',
          value: `${item.member.mbid}｜${item.member.name}`,
        }" />
      <CardTwoCol :item="{ label: '手機', value: item.member.phone }" />
      <CardTwoCol :item="{ label: 'E-mail', value: item.member.email }" />
      <CardTwoCol :item="{ label: '税號', value: item.member.taxno }" />
      <CardTwoCol :item="{ label: '檔案', value: item.name }" />
      <footer class="grid grid-cols-2 border-t divide-x py-2 text-sm">
        <div
          class="text-center cursor-pointer hover:opacity-70 text-primary-500"
          v-show="!item.name.includes('verified')"
          @click="
            emit('verify-tax', {
              file: item.name,
              type: 'verify',
            })
          ">
          通過
        </div>
        <div
          class="text-center cursor-pointer hover:opacity-70 text-red-400"
          v-show="item.name.includes('verified')"
          @click="
            emit('verify-tax', {
              file: item.name,
              type: 'revoke',
            })
          ">
          撤銷
        </div>
        <div
          class="
            justify-center
            cursor-pointer
            hover:opacity-70
            text-gray-500
            flex
            items-center
            gap-x-1
          "
          @click="emit('on-download', { name: item.name, path: item.path })">
          <span> 下載檔案 </span>
          <el-icon><Download /></el-icon>
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
  loading: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['on-download', 'verify-tax'])
</script>