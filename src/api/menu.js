const Menu = [
  {
    name: 'dashboard',
    icon: 'dashboard',
    title: 'Dashboard',
    path: '/dashboard',
    role: ['Administrator', 'Operator']
  },
  {
    name: 'pasien',
    icon: 'face',
    title: 'Pasien',
    path: '/pasien',
    role: ['Administrator', 'Operator']
  },
  {
    name: 'antrian',
    icon: 'group_work',
    title: 'Antrian',
    path: '/antrian',
    role: ['Administrator', 'Operator']
  },
  {
    icon: 'storage',
    title: 'Master Data',
    items: [
      { name: 'master-ruangan', title: 'Ruangan', path: '/master/ruangan' },
      { name: 'master-survey', title: 'Survey', path: '/master/survey' },
      { name: 'master-user', title: 'User', path: '/master/user' }
    ],
    role: ['Administrator']
  },
  {
    icon: 'description',
    title: 'Laporan',
    items: [
      { name: 'laporan-kunjungan', title: 'Kunjungan', path: '/laporan/kunjungan' },
      { name: 'laporan-survey', title: 'Survey', path: '/laporan/survey' }
    ],
    role: ['Administrator']
  },
  {
    name: 'pengaturan',
    icon: 'settings',
    title: 'Pengaturan',
    path: '/pengaturan',
    role: ['Administrator']
  },
  { header: 'Link Luar' },
  {
    name: 'pendaftaran-antrian',
    icon: 'airplay',
    title: 'Pendaftaran Antrian',
    path: '/pendaftaranantrian',
    target: '_blank',
    role: ['Administrator', 'Operator']
  },
  {
    name: 'display-antrian',
    icon: 'cast_connected',
    title: 'Display Antrian',
    path: '/displayantrian',
    target: '_blank',
    role: ['Administrator', 'Operator']
  },
  {
    name: 'survey',
    icon: 'poll',
    title: 'Survey',
    path: '/survey',
    target: '_blank',
    role: ['Administrator', 'Operator']
  }
]

export default {
  getMenusByRole (role) {
    let menus = Menu.filter((item) => {
      return !item.role || item.role.includes(role)
    })
    return menus
  }
}
