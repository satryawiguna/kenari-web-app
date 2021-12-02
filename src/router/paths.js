export default [
  {
    path: '/404',
    meta: {
      public: true
    },
    name: 'NotFound',
    component: () => import(
      '@/pages/NotFound.vue'
    )
  },
  {
    path: '/403',
    meta: {
      public: true
    },
    name: 'AccessDenied',
    component: () => import(
      '@/pages/Deny.vue'
    )
  },
  {
    path: '/500',
    meta: {
      public: true
    },
    name: 'ServerError',
    component: () => import(
      '@/pages/Error.vue'
    )
  },
  {
    path: '/',
    redirect: {
      path: '/login'
    }
  },
  {
    path: '/login',
    meta: {
      public: true
    },
    name: 'login',
    component: () => import(
      '@/pages/Login.vue'
    )
  },
  {
    path: '/dashboard',
    meta: { breadcrumb: true },
    name: 'dashboard',
    component: () => import(
      '@/pages/Dashboard.vue'
    )
  },
  {
    path: '/pasien',
    name: 'pasien',
    component: () => import(
      '@/pages/Pasien.vue'
    )
  },
  {
    path: '/antrian',
    name: 'antrian',
    component: () => import(
      '@/pages/Antrian.vue'
    )
  },
  {
    path: '/master/ruangan',
    name: 'master-ruangan',
    component: () => import(
      '@/pages/master/Ruangan.vue'
    ),
    meta: {
      role: ['Administrator']
    }
  },
  {
    path: '/master/surveydetail',
    name: 'master-surveydetail',
    component: () => import(
      '@/pages/master/SurveyDetail.vue'
    ),
    meta: {
      role: ['Administrator']
    }
  },
  {
    path: '/master/survey',
    name: 'master-survey',
    component: () => import(
      '@/pages/master/Survey.vue'
    ),
    meta: {
      role: ['Administrator']
    }
  },
  {
    path: '/master/user',
    name: 'master-user',
    component: () => import(
      '@/pages/master/User.vue'
    ),
    meta: {
      role: ['Administrator']
    }
  },
  {
    path: '/laporan/kunjungan',
    name: 'laporan-kunjungan',
    component: () => import(
      '@/pages/laporan/Kunjungan.vue'
    ),
    meta: {
      role: ['Administrator']
    }
  },
  {
    path: '/laporan/survey',
    name: 'laporan-survey',
    component: () => import(
      '@/pages/laporan/Survey.vue'
    ),
    meta: {
      role: ['Administrator']
    }
  },
  {
    path: '/pengaturan',
    name: 'pengaturan',
    component: () => import(
      '@/pages/Pengaturan.vue'
    ),
    meta: {
      role: ['Administrator']
    }
  },
  {
    path: '/pendaftaranantrian',
    name: 'pendaftaran-antrian',
    component: () => import(
      '@/pages/PendaftaranAntrian.vue'
    ),
    meta: {
      public: true
    }
  },
  {
    path: '/displayantrian',
    name: 'display-antrian',
    component: () => import(
      '@/pages/DisplayAntrian.vue'
    ),
    meta: {
      public: true
    }
  },
  {
    path: '/survey',
    name: 'survey',
    component: () => import(
      '@/pages/Survey.vue'
    ),
    meta: {
      public: true
    }
  }
]
