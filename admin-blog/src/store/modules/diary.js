import { addDiary, delDiary, putDiary, getDiary } from '../../api/diary'

const state = {
  diarylist: [],
}

const mutations = {
  getDiaryList(state, payload) {
    state.diarylist = payload
  },
}

const actions = {
  async getDiaryListAsync({ commit }) {
    const res = await getDiary()
    commit('getDiaryList', res.data)
  },
}

const getters = {}

export default {
  state,
  actions,
  getters,
  mutations,
  namespaced: true,
}
