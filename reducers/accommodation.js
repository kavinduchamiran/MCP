let a_id = 0
const accommodation = (state = [], action) => {
    a_id += 1
    console.log("type...", action.acc_type)
    switch (action.type) {
        case 'accommodation':
            return [
                ...state,
                {
                    id: a_id,
                    acc_type: action.acc_type,
                    name: action.name,
                    capacity: action.capacity,
                    address: action.address,
                    telephone: action.telephone
                }
            ]
        default:
            return state
    }

}

export default accommodation
