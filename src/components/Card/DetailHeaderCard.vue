<template>
    <div
      class="
        flex
        justify-between
        text-xs
        leading-5
        tracking-wider
        bg-primary-50 bg-opacity-10
        pr-2
      ">
      <div class="flex items-center gap-x-2">
        <div
          class="
            flex
            items-center
            gap-x-2
            from-primary-50
            to-primary-400
            bg-gradient-to-tr
            pl-2
            pr-4
            text-white
            rounded-r
          ">
          <el-icon :size="24">
            <SuccessFilled />
          </el-icon>
          <div>
            <p>#2131</p>
            <p>已成功</p>
          </div>
        </div>
        <div class="flex gap-x-1 items-center text-gray-500">
          <el-avatar :size="28"> 送 </el-avatar>
          <p>送單人:1</p>
        </div>
      </div>
      <div>
        <p>下單日期：2022-03-23</p>
        <p>訂單金額：9,600</p>
      </div>
    </div>
  </template>