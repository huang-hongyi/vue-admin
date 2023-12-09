<template>
  <d-action-timeline :data="timeData" :load-more-config="loadMoreConfig" @action-load-more="onLoadMore">
    <template #content="page">
      <div style="display:flex;flex-direction:column">
        <div style="height:24px;line-height:24px;">{{ page.option.action }}</div>
        <div>{{ page.option.actionContent }}</div>
      </div>
    </template>
  </d-action-timeline>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  const timeData = [
    {
        time: '2023-12-03',
        actions: [
          {
            action: '实现具体操作',
            actionContent: '操作内容1',
            createdAt: '2023-12-03 07:30:09 GMT+08:00',
            icon: 'icon-closed-merge',
            status: 'color-none',
          },
          {
            action: '实现具体操作',
            actionContent: '操作内容2',
            createdAt: '2022/07/01 15:21:54 GMT+08:00',
            icon: 'icon-merge-request',
            status: 'color-info',
          },
        ],
      },
      {
        time: '2022-07-01',
        actions: [
          {
            action: '实现具体操作',
            actionContent: '操作内容1',
            createdAt: '2022-07-01T07:30:09.681Z',
            icon: 'icon-closed-merge',
            status: 'color-none',
          },
          {
            action: '实现具体操作',
            actionContent: '操作内容2',
            createdAt: '2022/07/01 15:21:54 GMT+08:00',
            icon: 'icon-merge-request',
            status: 'color-info',
          },
        ],
      },
      {
        time: '2022-06-30',
        actions: [
          {
            action: '实现具体操作',
            actionContent: '操作内容3',
            createdAt: '2022-06-30 21:39:25',
            icon: 'icon-add-member',
            status: 'color-success',
          },
          {
            action: '实现具体操作',
            actionContent: '操作内容4',
            createdAt: 'Fri Jun 30 2022 15:21:54 GMT+0800（中国标准时间）',
            icon: 'icon-remove-member-icon',
            status: 'color-danger',
          },
        ],
      },
    ];
</script>