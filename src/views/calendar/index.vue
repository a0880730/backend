<template>
  <div class="text-center section">
    <aside class="text-left">
      點擊該日期空白處，可新增當天的待辦事項。點擊待辦事項可查看詳細資料並編輯內容。
    </aside>
    <v-calendar
      ref="calendar"
      class="custom-calendar max-w-full"
      :masks="masks"
      :attributes="attributes"
      disable-page-swipe
      is-expanded
      trim-weeks
      :from-page.sync="fromPage"
    >
      <template v-slot:day-content="{ day, attributes }">
        <div class="flex flex-col h-full z-10 overflow-hidden add-class" title="點擊新增事件" @click="newData(day)">
          <span class="day-label text-sm text-gray-900">{{ day.day }}</span>
          <div class="flex-grow overflow-y-auto overflow-x-auto">
            <p
              v-for="attr in attributes"
              :key="attr.key"
              class="even-label text-xs leading-tight rounded-sm text-white"
              :style="`background-color:${attr.customData.color}`"
              @click.stop="evenInfo(attr.customData)"
            >
              {{ attr.customData.name }}
            </p>
          </div>
        </div>
      </template>
    </v-calendar>
    <EditDialog :dialog-data="dialogData" />
  </div>
</template>

<script>
import { getCalendar, postCalendar, updateCalendar, deleteCalendar } from '@/api/user'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
  },
  data() {
    return {
      dialogData: {},
      masks: {
        weekdays: 'WWW'
      },
      attributes: [],
      calendar: {},
      fromPage: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      }
    }
  },
  computed: {
    ...mapState({
      CalendarData: state => state.user.CalendarData,
      CalendarDataRules: state => state.user.CalendarDataRules,
      PersonnelDataList: state => state.user.PersonnelDataList
    }),
    ...mapGetters([
      'defaultData',
      'timeToRFC'
    ]),
    PersonnelSelectData() {
      const userData = []
      for (const i in this.PersonnelDataList) {
        var item = {}
        item.value = i
        item.label = this.PersonnelDataList[i].username
        userData.push(item)
      }
      return userData
    }
  },
  watch: {
    PersonnelSelectData(val) {
      this.CalendarData.assign_for.selectData = this.PersonnelSelectData
    },
    fromPage: {
      handler: function(val, oldVal) {
        this.getList()
      },
      deep: true
    }
  },
  mounted() {
    this.calendar = this.$refs.calendar
  },
  created() {
    this.CalendarData.assign_for.selectData = this.PersonnelSelectData
    this.getList()
  },
  methods: {
    getList() {
      const start_at = new Date(this.fromPage.year + '-' + this.fromPage.month + '-01')
      let end_at = new Date(this.fromPage.year + '-' + (this.fromPage.month + 1) + '-01')
      end_at = new Date(end_at.getTime() - 1000)
      const paras = {}
      paras.start_date = this.timeToRFC(start_at)
      paras.end_date = this.timeToRFC(end_at)
      getCalendar(paras).then((response) => {
        const attributes = []
        for (const i in response.data) {
          const item = {}
          item.key = response.data.length - (i * 1)
          item.customData = response.data[i]
          item.dates = new Date(response.data[i].start_at)
          attributes.push(item)
        }
        this.attributes = attributes
      })
    },
    newData(data) {
      const defaultData = this.defaultData(this.CalendarData)
      defaultData.start_at = data.date
      defaultData.end_at = data.date

      var dialogData = {}
      dialogData.dialogName = '新增待辦事項'
      dialogData.tableFormat = { ...this.CalendarData }
      dialogData.dialogFormVisible = true
      dialogData.temp = defaultData
      dialogData.rules = this.CalendarDataRules
      dialogData.submitEvent = this.postCalendar
      this.dialogData = dialogData
    },
    // 事件修改
    evenInfo(data) {
      var dialogData = {}
      dialogData.dialogName = '編輯待辦事項'
      dialogData.tableFormat = { ...this.CalendarData }
      dialogData.dialogFormVisible = true
      dialogData.temp = data
      dialogData.rules = this.CalendarDataRules
      dialogData.submitEvent = this.updateCalendar
      dialogData.deleteEvent = this.deleteCalendar
      this.dialogData = dialogData
    },
    // 新增資料
    postCalendar(paras) {
      paras.start_at = this.timeToRFC(paras.start_at)
      paras.end_at = paras.start_at
      postCalendar(paras).then((response) => {
        this.dialogData.dialogFormVisible = false
        this.getList()
        this.$notify({ title: '成功', message: '新增成功', type: 'success', duration: 2000 })
      }).catch(() => {
        this.$notify({ title: '失敗', message: '資料新增失敗', type: 'error', duration: 2000 })
      })
    },
    // 修改資料
    updateCalendar(paras) {
      paras.start_at = this.timeToRFC(paras.start_at)
      paras.end_at = paras.start_at
      updateCalendar(paras).then((response) => {
        this.dialogData.dialogFormVisible = false
        this.getList()
        this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 })
      }).catch(() => {
        this.$notify({ title: '失敗', message: '資料修改失敗', type: 'error', duration: 2000 })
      })
    },
    // 刪除資料
    deleteCalendar(paras) {
      deleteCalendar(paras).then((response) => {
        this.dialogData.dialogFormVisible = false
        this.getList()
        this.$notify({ title: '成功', message: '刪除成功', type: 'success', duration: 2000 })
      }).catch(() => {
        this.$notify({ title: '失敗', message: '刪除失敗', type: 'error', duration: 2000 })
      })
    },
    checkToday(day) {
      if (day.day === new Date().getDate() && day.month === (new Date().getMonth() + 1) && day.year === new Date().getFullYear()) {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss">
.text-center{
  padding: 20px;
}

::-webkit-scrollbar {
  width: 0px;
}

::-webkit-scrollbar-track {
  display: none;
}

.custom-calendar.vc-container {
  --day-border: 1px solid #b8c2cc;
  --day-border-highlight: 1px solid #b8c2cc;
  --day-width: 90px;
  --day-height: 120px;
  --weekday-bg: #f8fafc;
  --weekday-border: 1px solid #eaeaea;

  border-radius: 0;
  width: 100%;

  & .vc-header {
    background-color: #f1f5f8;
    padding: 10px 0;
  }
  & .vc-weeks {
    overflow: auto;
    padding: 0;
  }
  & .vc-weekday {
    background-color: var(--weekday-bg);
    border-bottom: var(--weekday-border);
    border-top: var(--weekday-border);
    padding: 5px 0;
  }
  & .vc-day {
    padding: 3px 5px;
    text-align: left;
    height: var(--day-height);
    min-width: var(--day-width);
    background-color: white;
    overflow: auto;
    transition: background-color .2s;
    &.weekday-1,
    &.weekday-7 {
      background-color: #eff8ff;
    }
    &:not(.on-bottom) {
      border-bottom: var(--day-border);
      &.weekday-1 {
        border-bottom: var(--day-border-highlight);
      }
    }
    &:not(.on-right) {
      border-right: var(--day-border);
    }
    &:hover{
      background-color: #f0f0f0dc;
    }
  }
  & .vc-day-dots {
    margin-bottom: 5px;
  }
}
</style>

<style lang="scss" scoped>
.add-class{
  height: 100%;
  cursor: pointer;

}
.even-label{
  --text-opacity: 1;
  color: #fff;
  color: rgba(255,255,255,var(--text-opacity));
  border-radius: 0.125rem;
  padding: 0.25rem;
  margin-bottom: 0.25rem;
  margin-top: 0;
  font-size: 1rem;
}
.flex-grow{
  padding-bottom: 0.25rem;
}

.is-today .day-label{
  background-color: #000;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: block;
  text-align: center;
  line-height: 24px;
  color: #FFF;
  margin-bottom: 0.25rem;
}
</style>
