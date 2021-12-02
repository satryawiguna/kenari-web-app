const dummySurveyDetail = [
  {
    id: 1,
    surveyId: 1,
    question: 'Question A',
    sectionName: 'Section name A',
    weightValue: 0,
    order: 0
  },
  {
    id: 2,
    surveyId: 1,
    question: 'Question B',
    sectionName: 'Section name B',
    weightValue: 0,
    order: 0
  },
  {
    id: 3,
    surveyId: 2,
    question: 'Question C',
    sectionName: 'Section name C',
    weightValue: 0,
    order: 0
  },
  {
    id: 4,
    surveyId: 2,
    question: 'Question D',
    sectionName: 'Section name D',
    weightValue: 0,
    order: 0
  }
]

export default {
  getSurveyDetail (filter, pagination) {
    return new Promise((resolve, reject) => {
      const { sortBy, descending, page, rowsPerPage } = pagination

      let items = dummySurveyDetail
      const total = items.length

      if (pagination.sortBy) {
        items = items.sort((a, b) => {
          const sortA = a[sortBy]
          const sortB = b[sortBy]

          if (descending) {
            if (sortA < sortB) return 1
            if (sortA > sortB) return -1
            return 0
          } else {
            if (sortA < sortB) return -1
            if (sortA > sortB) return 1
            return 0
          }
        })
      }

      if (rowsPerPage > 0) {
        items = items.slice((page - 1) * rowsPerPage, page * rowsPerPage)
      }

      setTimeout(() => {
        this.loading = false
        resolve({
          items,
          total
        })
      }, 1000)
    })
  }
}
