const Mock = require('mockjs')
const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    project: '@title(5, 10)',
    owner: 'name',
    depository: '@sentence(0, 5)',
    branch: '@sentence(0, 2)'
  }))
}

module.exports = [{
  url: '/vue-admin-template/branch/list',
  type: 'get',
  // response: config => {
  //   const items = data.items
  //   return {
  //     code: 20000,
  //     data: {
  //       total: items.length,
  //       items: items
  //     }
  //   }
  // }
  response: config => {
    const { project, page = 1, limit = 20, sort } = config.query
    // alert(config.query)
    let mockList = List.filter(item => {
      if (project && item.project.indexOf(project) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      code: 20000,
      data: {
        total: mockList.length,
        items: pageList
      }
    }
  }
}]
