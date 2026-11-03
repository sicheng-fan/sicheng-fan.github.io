export interface Honor {
  id: string
  title: string
  titleZh: string
  institution?: string
}

export const honors: Honor[] = [
  {
    id: 'national-scholarship',
    title: 'National Scholarship',
    titleZh: '国家奖学金',
  },
  {
    id: 'shanghai-outstanding-graduate',
    title: 'Outstanding Graduate of Shanghai',
    titleZh: '上海市优秀毕业生',
  },
  {
    id: 'fudan-wangdao-scholar',
    title: 'Wangdao Scholar',
    titleZh: '复旦大学望道学者',
    institution: 'Fudan University',
  },
  {
    id: 'fudan-outstanding-student',
    title: 'Outstanding Student',
    titleZh: '复旦大学优秀学生',
    institution: 'Fudan University',
  },
]
