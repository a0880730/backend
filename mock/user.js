const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = [
  {
    user_id: '4c9f082b-c842-43e1-af33-9468e1f09e4b',
    username: 'admin',
    role: 'admin',
    first_name: '',
    last_name: '',
    display_name: '管理員',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    status: 1
  },
  {
    'user_id': '1234567e-890b-123d-456a-426655440000',
    'username': 'admin',
    'role': 'admin',
    'first_name': '',
    'last_name': '',
    'display_name': '管理員',
    'avatar': '',
    'status': 1
  },
  {
    'user_id': '0e8aaea4-3f96-4352-ac15-d9a33cbdd165',
    'username': 'BW4888',
    'role': 'user',
    'first_name': '任藍',
    'last_name': '龐',
    'display_name': '龐小姐',
    'avatar': '',
    'status': 2
  },
  {
    'user_id': 'a0c125b7-8b26-45b2-9219-b65e75794c0f',
    'username': 'user0003',
    'role': 'user',
    'first_name': '明明',
    'last_name': '王',
    'display_name': '王老先生',
    'avatar': '',
    'status': 1
  },
  {
    'user_id': '0fc97c11-1ad7-4583-bcfc-f1f5476091cf',
    'username': 'WA99980',
    'role': 'user',
    'first_name': '杜元',
    'last_name': '易',
    'display_name': '易老闆',
    'avatar': '',
    'status': 1
  },
  {
    'user_id': '0e17da10-0884-4b21-87c5-8964f4cb53ca',
    'username': 'RQ48841',
    'role': 'user',
    'first_name': '許淩',
    'last_name': '桑',
    'display_name': '桑老闆',
    'avatar': '',
    'status': 0
  }
]

module.exports = [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 201,
        message: 'ok',
        type: 'LOGIN_SUCCESS',
        data: {
          access_token: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDYzODI1OTUsImlhdCI6MTY0NjM3NTM5NSwiaWQiOiI0YzlmMDgyYi1jODQyLTQzZTEtYWYzMy05NDY4ZTFmMDllNGIiLCJyb2xlIjoidXNlciIsInVzZXJuYW1lIjoidXNlcjAwMDEifQ.LlUICc_ell1zFo_OBExXrBxo-hFunUO5dx62v-J6m34cBx9XMpKqmo0N07TR0m_ufkto0_Y-XP0fpl9YitX0vg',
          user_id: '4c9f082b-c842-43e1-af33-9468e1f09e4b',
          user_role: 'user'
        }
      }
    }
  },

  // get user info
  {
    url: '/user/*',
    type: 'get',
    response: config => {
      // const { token } = config.query
      const info = users[0]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 200,
        message: 'ok',
        type: 'GET_USER_SUCCESS',
        data: info
      }
    }
  },

  // get user info
  {
    url: '/user',
    type: 'get',
    response: config => {
      // const { page, page_size } = config.body
      const info = users

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        'code': 200,
        'message': 'ok',
        'type': 'GET_ALL_USER_SUCCESS',
        'pages': {
          // 'page_size': config.body.page_size,
          // 'page_num': config.body.page,
          // 'page_total': (users.length / page_size),
          'total_records': users.length
        },
        'data': info
      }
    }
  },
  // create user
  {
    url: '/user',
    type: 'post',
    response: config => {
      users.push(config.body)
      // mock error
      // if (!info) {
      //   return {
      //     code: 50008,
      //     message: 'Login failed, unable to get user details.'
      //   }
      // }
      return {
        'code': 201,
        'message': 'ok',
        'type': 'CREATE_USER_SUCCESS',
        'data': {
          'user_id': '1234567e-890b-123d-456a-426655440099'
        }
      }
    }
  }
]
