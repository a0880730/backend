<template>
  <div class="print-page">
    <div class="text-center t_title">{{ companyData["company_name"] }}</div>
    <div class="text-center t_info">
      <span>{{ companyData["address"] }}</span>
      <span>TEL:{{ companyData["phone_number"] }}</span>
      <span>FAX:{{ companyData["fax"] }}</span>
    </div>
    <div class="text-center">E-mail:{{ companyData["email"] }}</div>
    <div class="text-center t_title">報價單</div>
    <div class="case-info-row">
      <div class="_info col-3">
        <span class="_title">工程編號：</span>
        <span class="_content">{{ /*caseFieldData['']*/ }}</span>
      </div>
      <div class="_info col-9">
        <span class="_title">工程名稱：</span>
        <span class="_content">{{ caseFieldData['name'] }}</span>
      </div>
    </div>
    <div class="case-info-row">
      <div class="_info col-8">
        <span class="_title">客戶名稱：</span>
        <span class="_content">{{ caseFieldData['customer'].company_name }}</span>
      </div>
      <div class="_info col-4">
        <span class="_title">統一編號：</span>
        <span class="_content">{{ quotationData['customer']['tax_id_number'] }}</span>
      </div>
    </div>
    <div class="case-info-row">
      <div class="_info col-5">
        <span class="_title">聯絡人：</span>
        <span class="_content">{{ quotationData['customer']['contact_person'] }}</span>
      </div>
      <div class="_info col-3">
        <span class="_title">手 機：</span>
        <span class="_content">{{ /*quotationData['customer']['']*/ }}</span>
      </div>
      <div class="_info col-4">
        <span class="_title">電 話：</span>
        <span class="_content">{{ quotationData['customer']['phone_number'] }}</span>
      </div>
    </div>
    <div class="case-info-row">
      <div class="_info col-8">
        <span class="_title">地 址：</span>
        <span class="_content">{{ quotationData['customer']['address'] }}</span>
      </div>
      <div class="_info col-4">
        <span class="_title">傳 真：</span>
        <span class="_content">{{ quotationData['customer']['fax'] }}</span>
      </div>
    </div>
    <div class="case-info-row">
      <div class="_info col-8">
        <span class="_title">施工地址：</span>
        <span class="_content">{{ caseFieldData['address'] }}</span>
      </div>
      <div class="_info col-4">
        <span class="_title">日 期：</span>
        <span class="_content">{{ caseFieldData['created_at'] | dateFormat }}</span>
      </div>
    </div>
    <div class="case-table">
      <div class="_tr">
        <div class="_th">項目</div>
        <div class="_th">施工內容</div>
        <div class="_th">規格</div>
        <div class="_th">單位</div>
        <div class="_th">數量</div>
        <div class="_th">單價(元)</div>
        <div class="_th">金額(元)</div>
        <div class="_th">備註</div>
      </div>
      <div v-for="(value,index) in list" :key="index" class="_tr">
        <div class="_td text-center">{{ index }}</div>
        <div class="_td">{{ value['name'] }}</div>
        <div class="_td">{{ value['specification'] }}</div>
        <div class="_td text-center">{{ value['unit'] }}</div>
        <div class="_td">{{ value['quantity'] }}</div>
        <div class="_td">{{ value['unit_price'] }}</div>
        <div class="_td">{{ value['amount'] }}</div>
        <div class="_td">{{ value['notes'] }}</div>
      </div>
      <div class="_tr">
        <div class="_td text-center">備註:</div>
        <div class="_td"></div>
        <div class="_td"></div>
        <div class="_td"></div>
        <div class="_td"></div>
        <div class="_td"></div>
        <div class="_td"></div>
        <div class="_td"></div>
      </div>
      <div class="_tr">
        <div class="_td"></div>
        <div class="_td total_title">未稅小計</div>
        <div class="_td"></div>
        <div class="_td"></div>
        <div class="_td"></div>
        <div class="_td"></div>
        <div class="_td"></div>
        <div class="_td text-center"></div>
      </div>
      <div class="_tr">
        <div class="_td"></div>
        <div class="_td total_title">稅 金</div>
        <div class="_td"></div>
        <div class="_td"></div>
        <div class="_td"></div>
        <div class="_td"></div>
        <div class="_td"></div>
        <div class="_td"></div>
      </div>
      <div class="_tr">
        <div class="_td"></div>
        <div class="_td total_title">合 計</div>
        <div class="_td"></div>
        <div class="_td"></div>
        <div class="_td"></div>
        <div class="_td"></div>
        <div class="_td"></div>
        <div class="_td"></div>
      </div>
      <div class="_tr">
        <div class="_td total_td">新台幣：</div>
        <div class="_td total_td text-center">零</div>
        <div class="_td total_td"></div>
      </div>
      <div class="_tr">
        <div class="_td note_td">備註:</div>
        <div class="_td note_td">
          <ol>
            <li>本報價含5%營業稅，本報價單自報價日起算30天內有效。</li>
            <li>本報價單自客戶簽名確認回傳，視同合約成立。</li>
            <li>以上報價內容.過程中，如因客戶需求更改或追加設計時，其所衍生相關費用、材料需抽(檢驗)時期檢驗費用由客戶自行負擔。給付方式、時間等詳載於工程備忘錄。</li>
            <li>交易第三條之規定為附條件買賣，本案建完工驗收款尚未結清前，安裝現場之櫥櫃及配件隸屬統釗工程有限公司所有。</li>
            <li>付款條件:完成簽訂合約後支付20%定金，工程完成進料30%，施工完成後40%（不含二次工程）本工程驗收完成支付10%工程尾款(100%10天期票)完工後，客戶應於7日內完成驗收，逾期視同驗收通過。</li>
            <li>本報價單不含油漆、批 土工程。（批土須達1.5mm以上.防止磚影呈現）</li>
            <li>簽訂本單同時，視為對其內容表示同意。客戶收受之貨品如非有重大瑕疵致不堪使用，否則一概謝絕退貨。，至統釗工程有限公司需展延工期時，統釗工程有限公司不負給付遲延或損害賠償之責任。</li>
            <li>本工程聯絡人:徐正一 0928-903326</li>
            <li>以上請款方式甲方如無按時付款；以方可不用再施作剩餘工程內容。</li>
            <li>如因本訂單發生糾紛，雙方同意本事件由台灣台中地方法院為管轄法院。</li>
            <li>以上完工後保固一年.</li>
            <li>完工結清尾款後.即可開立防火證明文件</li>
          </ol>
        </div>
      </div>
      <div class="_tr">
        <div class="_td sign_td">甲方簽章欄</div>
        <div class="_td sign_td">已方簽章欄</div>
      </div>
      <div class="_tr">
        <div class="_td sign_td _box"></div>
        <div class="_td sign_td _box">
          <div>公司名稱:{{ companyData["company_name"] }}　負責人:{{ companyData["person_in_charge"] }}</div>
          <div>地址:{{ companyData["address"] }}</div>
          <div>統一編號:{{ companyData["tax_id_number"] }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCompanyInfo} from '@/api/company'
import { getQuotation, getInfo } from '@/api/caseField'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'PrintQuatation',
  components: {},
  data() {
    return {
      list: [],
      companyData: {},
      quotationData: {},
      caseFieldData: {}
    }
  },
  created() {
    this.list = []
    this.getCompanyInfo()
    this.getCaseData()
    this.getList()
    // window.print()
  },
  methods: {
    getCompanyInfo() {
      getCompanyInfo().then((response) => {
        this.companyData = response.data
      })
    },
    getCaseData() {
      this.listLoading = true
      var paras = {}
      paras.case_id = this.$route.query.caseId
      getInfo(paras).then((response) => {
        this.caseFieldData = response.data
      })
    },
    getList() {
      this.listLoading = true
      var paras = {}
      paras = Object.assign({}, this.listQuery)
      paras.case_id = this.$route.query.caseId
      paras.quotation_id = this.$route.params.pathMatch
      getQuotation(paras).then((response) => {
        this.quotationData = response.data
        this.list = [...this.quotationData.items]
        this.listLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.text-center {
  text-align: center;
}

.col-3 {
  flex-basis: 25%;
}
.col-4 {
  flex-basis: 33.33%;
}
.col-5 {
  flex-basis: 41.66%;
}
.col-8 {
  flex-basis: 66.66%;
}
.col-9 {
  flex-basis: 75%;
}

.print-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  font-size: 16px;
  // letter-spacing: 1px;
  font-family: PMingLiU;
  padding: 20px 20px 0 20px;

  & > div{
    margin: 3px 0 0;
  }

  .case-info-row {
    display: flex;

    ._info{

      ._title{
        letter-spacing: 5px;
      }
    }
  }

  .t_title{
    font-size: 24px;
    font-weight: bold;
  }
  .t_info{
    span{
      padding: 0 5px;
    }

  }
}

.case-table {
  border: 2px solid #000;

  ._tr{
    display: flex;
    width: 100%;

    &:not(:last-child){
      border-bottom: 1px solid #000;
    }

    ._th,._td{
      flex: 1 1 auto;
      padding: 5px;
      &:not(:last-child){
        border-right: 1px solid #000;
      }

      &:nth-child(1){
        flex-basis: calc(8% - 1px);
      }
      &:nth-child(2){
        flex-basis: calc(36% - 1px);
      }
      &:nth-child(3){
        flex-basis: calc(10% - 1px);
      }
      &:nth-child(4){
        flex-basis: calc(7% - 1px);
      }
      &:nth-child(5){
        flex-basis: calc(9% - 1px);
      }
      &:nth-child(6){
        flex-basis: calc(10% - 1px);
      }
      &:nth-child(7){
        flex-basis: calc(10% - 1px);
      }
      &:nth-child(8){
        flex-basis: 10%;
      }

    }

    .total_td{
      &:nth-child(1){
        flex-basis: calc(30% - 1px);
      }
      &:nth-child(2){
        flex-basis: calc(60% - 1px);
        text-align: center;
      }
      &:nth-child(3){
        flex-basis: 10%;
      }
    }

    .note_td{
      &:nth-child(1){
        flex-basis: 7%;
        border: unset;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &:nth-child(2){
        flex-basis: 93%;
      }
      ol{
        margin-top: 0;
        margin-bottom: 0;
        margin-right: 10px;

        li{
          font-size: 14px;
          line-height: 1.3;
        }
      }
    }

    .total_title{
      text-align: center;
      letter-spacing: 10px;
    }

    & ._td.sign_td{
      flex-basis: calc(50% - 1px);
      text-align: center;

      &._box{
        min-height: 150px;
        text-align: left;
        line-height: 1.5;
        font-size: 14px;
      }
    }

    ._th{
      text-align: center;
      // padding-left: 0;
      // padding-right: 0;
    }

  }

}
</style>
