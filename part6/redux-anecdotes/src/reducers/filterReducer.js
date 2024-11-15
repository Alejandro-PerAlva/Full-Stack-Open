export const setFilter = (filter) => ({
    type: 'SET_FILTER',
    payload: filter,
  })
  
  const filterReducer = (state = '', action) => {
    switch (action.type) {
      case 'SET_FILTER':
        return action.payload
      default:
        return state
    }
  }
  
  export default filterReducer
  