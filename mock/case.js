const uuidregExp = '[0-9a-f]{8}-?[0-9a-f]{4}-?[1-5][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}'
const caseData = [
  {
    'case_id': '01737bab-2ad5-4c69-811b-61d941f4e518',
    'name': '家9DOWN',
    'address': '臺中市Ｋ區ＡＢ路800巷',
    'notes': '測試'
  }
]

const quotation = [
  {
    'items': [
      {
        'name': '石膏磚',
        'specification': '9cm',
        'unit': 'm2 (平方公尺)',
        'quantity': 100,
        'unit_price': 300,
        'amount': 30000,
        'notes': '測試，石膏磚9cm'
      },
      {
        'name': '石膏磚',
        'specification': '15cm',
        'unit': 'm2 (平方公尺)',
        'quantity': 100,
        'unit_price': 900,
        'amount': 20000,
        'notes': '測試，石膏磚15cm'
      },
      {
        'name': '防護底漆',
        'quantity': '乙次',
        'notes': '測試，防護底漆噴塗'
      }
    ],
    'customer_id': '7d2f8c5e-8aea-4459-a9aa-6ff8c2860162',
    'quotation_id': '395d9ee1-8341-4001-a9c3-69fbcbabb713',
    'customer': {
      'customer_id': '7d2f8c5e-8aea-4459-a9aa-6ff8c2860162',
      'company_name': '台灣積體電路製造股份有限公司',
      'email': 'invest@tsmc.com',
      'fax': '035797337',
      'tax_id_number': 22099131,
      'address': '新竹科學園區新竹市力行六路8號',
      'phone_number': '035636688',
      'contact_person': '劉德音',
      'notes': '測試，台灣公司網'
    }
  }
]

const brickData = [
  {
    'brick_id': '65b8e2f9-f988-4d7f-af91-261658e3bee6',
    'items': [
      {
        'number': '1',
        'name': '石膏磚',
        'width': '10',
        'height': '3',
        'quantity': '30',
        'door_width': '1',
        'door_height': '2',
        'door_quantity': '2',
        'window_width': '5',
        'window_height': '2.4',
        'window_quantity': '12',
        'subtotal': '16',
        'notes': '挑高，落地窗'
      },
      {
        'number': '2',
        'name': '石膏磚',
        'width': '6',
        'height': '3',
        'quantity': '18',
        'door_width': '0',
        'door_height': '0',
        'door_quantity': '0',
        'window_width': '0',
        'window_height': '0',
        'window_quantity': '0',
        'subtotal': '18',
        'notes': '挑高，裝飾壁'
      }
    ],
    'total': '34'
  }
]

module.exports = [
  {
    url: `\/case\/${uuidregExp}\/quotation`,
    type: 'post',
    response: config => {
      const quotationItem = config.body
      quotationItem.quotation_id = '7d2f8c5e-8aea-4459-a9aa-6ff8c2860163'
      quotation.push(quotationItem)

      return {
        'code': 201,
        'message': 'ok',
        'type': 'CREATE_CASE_QUOTATION_SUCCESS',
        'data': {
          'quotation_id': '7d2f8c5e-8aea-4459-a9aa-6ff8c2860162'
        }
      }
    }
  },
  {
    url: `\/case\/${uuidregExp}\/quotation\/${uuidregExp}`,
    type: 'get',
    response: config => {
      return {
        'pages': {
          'page_size': 10,
          'page_num': 1,
          'page_total': 1,
          'total_records': 10
        },
        'code': 200,
        'message': 'ok',
        'type': 'QUERY_SUCCESS',
        'data': quotation[0]
      }
    }
  },
  {
    url: `\/case\/${uuidregExp}\/quotation`,
    type: 'get',
    response: config => {
      return {
        'pages': {
          'page_size': 10,
          'page_num': 1,
          'page_total': 1,
          'total_records': 10
        },
        'code': 200,
        'message': 'ok',
        'type': 'QUERY_SUCCESS',
        'data': quotation
      }
    }
  },
  {
    url: `\/case\/${uuidregExp}\/brick`,
    type: 'get',
    response: config => {
      return {
        'pages': {
          'page_size': 10,
          'page_num': 1,
          'page_total': 1,
          'total_records': 2
        },
        'code': 200,
        'message': 'ok',
        'type': 'QUERY_SUCCESS',
        'data': brickData
      }
    }
  },
  {
    url: `\/case\/${uuidregExp}`,
    type: 'get',
    response: config => {
      var casedt
      for (var i in caseData) {
        if (caseData[i].case_id === '01737bab-2ad5-4c69-811b-61d941f4e518') {
          casedt = caseData[i]
        }
      }

      return {
        'pages': {
          'page_size': 10,
          'page_num': 1,
          'page_total': 1,
          'total_records': 1
        },
        'code': 200,
        'message': 'ok',
        'type': 'QUERY_SUCCESS',
        'data': casedt
      }
    }
  },
  {
    url: '/case',
    type: 'get',
    response: config => {
      return {
        'pages': {
          'page_size': 10,
          'page_num': 1,
          'page_total': 2,
          'total_records': 1
        },
        'code': 200,
        'message': 'ok',
        'type': 'QUERY_SUCCESS',
        'data': caseData
      }
    }
  }
]
